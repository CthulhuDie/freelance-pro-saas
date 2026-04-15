export async function onRequestPost(context) {
  try {
    // 1. Extraer el texto enviado por el usuario
    const { prompt } = await context.request.json();
    
    // 2. Obtener la API KEY desde las variables de entorno de Cloudflare
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "API Key no configurada en Cloudflare" }), { status: 500 });
    }

    // 3. Llamada a Google Gemini 1.5 Flash (más rápido y estable)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Actúa como un Ghostwriter experto para freelancers. Mejora profesionalmente este texto: "${prompt}"` }]
        }]
      })
    });

    const data = await response.json();

    // 4. Verificación de seguridad de la respuesta (evita el error 'reading 0')
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ text: aiText }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "La IA no pudo procesar esa solicitud." }), { status: 500 });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: "Error de servidor: " + error.message }), { status: 500 });
  }
}
