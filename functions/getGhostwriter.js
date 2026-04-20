export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "API Key no configurada" }), { status: 500 });
    }

    // 1. CAMBIO A ENDPOINT DE STREAMING
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Actúa como un Ghostwriter experto para freelancers. Mejora profesionalmente este texto: "${prompt}"` }]
        }]
      })
    });

    // 2. RETORNAR EL CUERPO COMO STREAM DIRECTO
    // Esto mantiene la conexión viva y evita el timeout de Cloudflare
    // Dentro de tu archivo functions/getGhostwriter.js
return new Response(stream, {
  headers: { 
    "Content-Type": "text/event-stream", 
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  }
});

  } catch (error) {
    return new Response(JSON.stringify({ error: "Error de servidor: " + error.message }), { status: 500 });
  }
}
