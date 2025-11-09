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
    const { topic, contentType = 'module', detailLevel = 'comprehensive' } = await req.json();
    
    console.log(`Generating ${contentType} content for topic: ${topic}`);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    let prompt = '';
    if (contentType === 'module') {
      prompt = `Create comprehensive educational content for a climate action course module on "${topic}".

Include:
- Introduction (2-3 paragraphs)
- Key concepts and definitions
- Real-world examples and case studies
- Practical applications
- Important statistics or data
- Actionable takeaways

Format the content in clear sections with headings. Make it engaging and educational.`;
    } else if (contentType === 'course') {
      prompt = `Create a complete course outline for "${topic}" in climate action and sustainability.

Include:
- Course overview and objectives
- List of 5-8 modules with descriptions
- Key learning outcomes for each module
- Suggested assessments
- Prerequisites (if any)
- Target audience

Format professionally and make it comprehensive.`;
    } else {
      prompt = `Create educational content about "${topic}" related to climate action and sustainability.

Detail level: ${detailLevel}

Make it informative, engaging, and actionable.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in climate action, environmental sustainability, and green initiatives. Create clear, accurate, and engaging educational content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log(`Successfully generated ${contentType} content for ${topic}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedContent,
        topic,
        contentType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-course-content:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
