export async function onRequestPost(context) {
  try {
    // 1. Obtener el prompt del frontend
    const { prompt } = await context.request.json();
    
    // 2. Obtener la API KEY de las variables de entorno de Cloudflare
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "API Key no configurada en Cloudflare" }), { status: 500 });
    }

    // 3. Configurar la llamada a la IA (Ejemplo con Gemini)
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
    const aiText = data.candidates[0].content.parts[0].text;

    // 4. Devolver la respuesta al frontend
    return new Response(JSON.stringify({ text: aiText }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
