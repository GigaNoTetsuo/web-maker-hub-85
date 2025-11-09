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
    const { latitude, longitude, jobs } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching climate data for coordinates: ${latitude}, ${longitude}`);

    // Fetch weather and soil data from Open-Meteo (free, no API key needed)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,soil_temperature_0cm,soil_moisture_0_to_1cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&past_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', weatherData);

    // Prepare climate analysis prompt with soil conditions
    const climatePrompt = `Analyze the following climate and soil data to identify the main environmental challenges:

Current Conditions:
- Temperature: ${weatherData.current.temperature_2m}°C
- Humidity: ${weatherData.current.relative_humidity_2m}%
- Precipitation: ${weatherData.current.precipitation}mm
- Wind Speed: ${weatherData.current.wind_speed_10m}km/h
- Soil Temperature: ${weatherData.current.soil_temperature_0cm}°C
- Soil Moisture: ${weatherData.current.soil_moisture_0_to_1cm}%
- Weather Code: ${weatherData.current.weather_code}

Past 7 Days:
- Avg Max Temperature: ${(weatherData.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / 7).toFixed(1)}°C
- Avg Min Temperature: ${(weatherData.daily.temperature_2m_min.reduce((a: number, b: number) => a + b, 0) / 7).toFixed(1)}°C
- Total Precipitation: ${weatherData.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0).toFixed(1)}mm

Available Jobs:
${jobs.map((job: any, idx: number) => `${idx + 1}. ${job.title} - ${job.description} (Type: ${job.type})`).join('\n')}

Based on these climate and soil conditions, rank the jobs by relevance (return job indices in order of relevance, most relevant first). 
Consider factors like: extreme temperatures, flooding risk, drought, soil health, moisture levels, planting conditions, water conservation needs, etc.
Return ONLY a JSON array of job indices (0-based) in order of relevance, like: [2, 0, 5, 1, 3, 4, 6, 7, 8, 9]`;

    // Call Groq API for climate analysis
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

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
            content: 'You are a climate analysis expert. Analyze weather patterns and match them with relevant climate action jobs. Return only a JSON array of job indices.'
          },
          {
            role: 'user',
            content: climatePrompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to analyze climate data');
    }

    const groqData = await groqResponse.json();
    const analysisText = groqData.choices[0].message.content.trim();
    console.log('AI Analysis:', analysisText);

    // Parse the ranking
    let ranking: number[];
    try {
      // Extract JSON array from response
      const jsonMatch = analysisText.match(/\[[\d,\s]+\]/);
      if (jsonMatch) {
        ranking = JSON.parse(jsonMatch[0]);
      } else {
        ranking = JSON.parse(analysisText);
      }
    } catch (e) {
      console.error('Failed to parse ranking, using default order:', e);
      ranking = jobs.map((_: any, idx: number) => idx);
    }

    // Reorder jobs based on AI ranking
    const rankedJobs = ranking.map((idx: number) => jobs[idx]).filter((job: any) => job !== undefined);
    
    // Add any missing jobs at the end
    const includedIndices = new Set(ranking);
    const remainingJobs = jobs.filter((_: any, idx: number) => !includedIndices.has(idx));
    const finalJobs = [...rankedJobs, ...remainingJobs];

    return new Response(
      JSON.stringify({
        climate: {
          temperature: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
          precipitation: weatherData.current.precipitation,
          windSpeed: weatherData.current.wind_speed_10m,
          soilTemperature: weatherData.current.soil_temperature_0cm,
          soilMoisture: weatherData.current.soil_moisture_0_to_1cm,
          weeklyPrecipitation: weatherData.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0),
        },
        jobs: finalJobs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in match-climate-jobs:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
