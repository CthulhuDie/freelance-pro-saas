const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No hay datos" }) };
        }

        const { prompt } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Cambio sugerido: gemini-1.5-flash-latest
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Verificación básica de seguridad (safety ratings)
        const aiText = response.text() || "El modelo no pudo generar una respuesta.";

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error("ERROR DETECTADO:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Error en la comunicación con Gemini", 
                detalles: error.message 
            })
        };
    }
};
