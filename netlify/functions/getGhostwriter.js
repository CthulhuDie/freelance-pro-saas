const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    // 1. Configuración de cabeceras (CORS y JSON)
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // Manejar petición pre-vuelo (OPTIONS)
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // 2. Validación de entrada
        if (!event.body) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "No se recibieron datos." }) 
            };
        }

        const { prompt } = JSON.parse(event.body);
        if (!prompt) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "El campo 'prompt' es requerido." }) 
            };
        }

        // 3. Configuración de la IA (Solución al error 404)
        // Usamos la variable de entorno configurada en el panel de Netlify
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // IMPORTANTE: El prefijo "models/" es obligatorio para evitar el 404 en v1beta
        const model = genAI.getGenerativeModel({ 
            model: "models/gemini-1.5-flash" 
        });

        // 4. Instrucción del Ghostwriter
        const systemInstruction = "Eres un asistente de escritura profesional. Mejora o redacta lo siguiente:";
        const fullPrompt = `${systemInstruction}\n\n${prompt}`;

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
                error: "Error en la comunicación con la IA", 
                message: error.message 
            })
        };
    }
};
