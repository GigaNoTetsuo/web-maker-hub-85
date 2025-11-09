import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, jobs } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch user skills
    const { data: userSkills, error: skillsError } = await supabaseClient
      .from('user_skills')
      .select('skill_name')
      .eq('user_id', userId);

    if (skillsError) {
      console.error('Error fetching user skills:', skillsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user skills' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userSkillsList = userSkills?.map(s => s.skill_name.toLowerCase()) || [];
    console.log('User skills:', userSkillsList);

    if (userSkillsList.length === 0) {
      // No skills, return all jobs with match score of 0
      const jobsWithScores = jobs.map((job: any) => ({
        ...job,
        recommendationScore: 0,
        matchedSkills: []
      }));
      
      return new Response(
        JSON.stringify({ jobs: jobsWithScores }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to rank jobs based on user skills
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const prompt = `You are a job matching expert. Match these jobs with user skills and rank them.

User Skills: ${userSkillsList.join(', ')}

Available Jobs:
${jobs.map((job: any, idx: number) => 
  `${idx}. ${job.title} - Required Skills: ${job.skills.join(', ')} - Difficulty: ${job.difficulty} - Type: ${job.type}`
).join('\n')}

Analyze skill matches, considering:
- Direct skill matches (highest priority)
- Related/transferable skills
- Job difficulty vs user experience level
- Job type alignment

Return ONLY a JSON array of objects with this exact format:
[
  {"jobIndex": 0, "score": 95, "matchedSkills": ["skill1", "skill2"]},
  {"jobIndex": 1, "score": 85, "matchedSkills": ["skill1"]}
]

Score from 0-100. Sort by score descending.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a job matching expert. Return only valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to analyze job matches');
    }

    const groqData = await groqResponse.json();
    const analysisText = groqData.choices[0].message.content.trim();
    console.log('AI Analysis:', analysisText);

    // Parse the ranking
    let rankings: Array<{jobIndex: number, score: number, matchedSkills: string[]}>;
    try {
      const jsonMatch = analysisText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        rankings = JSON.parse(jsonMatch[0]);
      } else {
        rankings = JSON.parse(analysisText);
      }
    } catch (e) {
      console.error('Failed to parse rankings:', e);
      // Fallback: basic matching
      rankings = jobs.map((job: any, idx: number) => {
        const jobSkills = job.skills.map((s: string) => s.toLowerCase());
        const matchedSkills = jobSkills.filter((s: string) => 
          userSkillsList.some(us => s.includes(us) || us.includes(s))
        );
        const score = matchedSkills.length > 0 ? 50 + (matchedSkills.length * 15) : 20;
        return { jobIndex: idx, score, matchedSkills };
      }).sort((a: any, b: any) => b.score - a.score);
    }

    // Attach scores to jobs
    const rankedJobs = rankings.map((ranking) => ({
      ...jobs[ranking.jobIndex],
      recommendationScore: ranking.score,
      matchedSkills: ranking.matchedSkills
    })).filter(job => job.id !== undefined);

    // Add any missing jobs at the end with low scores
    const includedIndices = new Set(rankings.map(r => r.jobIndex));
    const remainingJobs = jobs
      .map((job: any, idx: number) => ({ job, idx }))
      .filter(({ idx }: { idx: number }) => !includedIndices.has(idx))
      .map(({ job }: { job: any }) => ({
        ...job,
        recommendationScore: 10,
        matchedSkills: []
      }));

    const finalJobs = [...rankedJobs, ...remainingJobs];

    return new Response(
      JSON.stringify({ jobs: finalJobs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recommend-jobs:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
