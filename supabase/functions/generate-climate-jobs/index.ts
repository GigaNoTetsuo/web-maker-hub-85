import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { climateData, location, count = 3 } = await req.json();

    console.log('Generating climate jobs for:', { climateData, location, count });

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const climateContext = climateData 
      ? `Current Climate & Soil Conditions:
- Temperature: ${climateData.temperature}°C
- Humidity: ${climateData.humidity}%
- Wind Speed: ${climateData.windSpeed} km/h
- Soil Temperature: ${climateData.soilTemperature}°C
- Soil Moisture: ${climateData.soilMoisture}%
- Weekly Precipitation: ${climateData.weeklyPrecipitation}mm
Location: ${location || 'Not specified'}`
      : `Location: ${location || 'General climate action'}`;

    const prompt = `You are a climate action job creator. Generate ${count} realistic micro-jobs (1-6 hours, $30-$150) that address current climate and soil challenges.

${climateContext}

Generate jobs that:
1. Address the specific climate AND soil conditions (e.g., low soil moisture → irrigation setup, poor soil health → composting, extreme heat + dry soil → mulching)
2. Are immediately actionable by local community members
3. Have clear environmental impact
4. Pay fairly for the time and skill required
5. Use diverse climate action categories: Renewable Energy, Water Conservation, Waste Reduction, Carbon Sequestration, Urban Greening, Energy Efficiency, Soil Health

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "Concise job title (max 50 chars)",
    "company": "Realistic organization name",
    "location": "City, State or specific area",
    "pay": "$XX" (reasonable for task),
    "duration": "X hours",
    "type": "One of: Planting, Maintenance, Survey, Audit, Installation, Cleaning, Education",
    "difficulty": "One of: Easy, Medium, Advanced",
    "description": "Clear 1-2 sentence description of the task",
    "skills": ["Skill1", "Skill2"] (2-3 relevant skills),
    "urgent": true/false (only if climate-critical)
  }
]

Make jobs specific to the climate conditions and diverse in type.`;

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
            content: 'You are a climate jobs generator. Return only valid JSON arrays of job objects. Be creative but realistic.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to generate jobs');
    }

    const groqData = await groqResponse.json();
    const generatedText = groqData.choices[0].message.content.trim();
    console.log('AI Generated:', generatedText);

    // Parse the JSON array
    let jobs;
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobs = JSON.parse(jsonMatch[0]);
      } else {
        jobs = JSON.parse(generatedText);
      }
    } catch (e) {
      console.error('Failed to parse generated jobs:', e);
      throw new Error('Invalid job format generated');
    }

    // Add unique IDs and default values
    const jobsWithIds = jobs.map((job: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      ...job,
      match: climateData ? 90 + Math.floor(Math.random() * 10) : 85,
      icon: getIconForType(job.type),
      aiGenerated: true
    }));

    console.log('Generated jobs:', jobsWithIds.length);

    return new Response(
      JSON.stringify({ jobs: jobsWithIds }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-climate-jobs:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getIconForType(type: string): string {
  const iconMap: Record<string, string> = {
    'Planting': 'TreeDeciduous',
    'Maintenance': 'Sun',
    'Survey': 'Droplets',
    'Audit': 'Zap',
    'Installation': 'TreeDeciduous',
    'Cleaning': 'Sun',
    'Education': 'BookOpen',
  };
  return iconMap[type] || 'Leaf';
}
