exports.handler = async (event, context) => {
    // 1. Obtener el prompt que viene del frontend
    const { prompt } = JSON.parse(event.body);

    // 2. Tu API KEY desde las variables de entorno de Netlify
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        // 3. Usamos el fetch global (no necesitas importar nada)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 4. Extraer el texto de la respuesta de Gemini
        const aiText = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiText })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error conectando con Gemini: " + error.message })
        };
    }
};
