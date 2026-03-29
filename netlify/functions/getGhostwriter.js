const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    try {
        // 1. Validar que el body existe
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No hay datos" }) };
        }

        const { prompt } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        // 2. Configurar Gemini con la librería oficial
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Generar contenido
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Evita problemas de CORS
            },
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error("ERROR DETECTADO:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Falla técnica", 
                detalles: error.message 
            })
        };
    }
};
