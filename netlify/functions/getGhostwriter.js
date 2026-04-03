const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    // 1. Configuración de CORS para permitir peticiones desde tu frontend
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // Manejar la petición de pre-vuelo (OPTIONS) de los navegadores
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // 2. Validación de entrada
        if (!event.body) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "No se recibieron datos en el cuerpo de la petición." }) 
            };
        }

        const { prompt } = JSON.parse(event.body);
        
        if (!prompt) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "El campo 'prompt' es obligatorio." }) 
            };
        }

        // 3. Inicialización de Gemini
        // Asegúrate de que GEMINI_API_KEY esté configurada en el panel de Netlify
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Usamos 'gemini-1.5-flash-latest' para evitar el error 404 de versión
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" 
        });

        // 4. Prompt de Sistema (Instrucciones para el Ghostwriter)
        const instruction = "Actúa como un Ghostwriter profesional. Tu objetivo es redactar, mejorar o continuar el texto que el usuario te proporcione, manteniendo un tono elegante y útil.";
        const fullPrompt = `${instruction}\n\nPedido del usuario: ${prompt}`;

        // 5. Generación de contenido
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiText = response.text();

        // 6. Respuesta exitosa
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error("ERROR EN LA FUNCIÓN:", error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Error interno del servidor", 
                message: error.message 
            })
        };
    }
};
