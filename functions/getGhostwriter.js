async function generateText(userPrompt) {
  try {
    const response = await fetch("/api/ghostwriter", { // Ajusta la ruta a tu worker
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) throw new Error("Error en la petición");

    // 1. Preparamos el lector del stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    // 2. Bucle para leer cada trozo (chunk)
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Convertimos el buffer a texto
      const chunk = decoder.decode(value, { stream: true });
      
      // NOTA: Gemini en modo stream devuelve objetos JSON por cada trozo.
      // Dependiendo de cómo lo manejes, podrías necesitar limpiar el texto:
      console.log("Trozo recibido:", chunk);
      
      // Aquí actualizarías tu estado (ej: setTexto(prev => prev + chunk))
      fullText += chunk; 
      // Si usas React: setOutput(fullText);
    }

    console.log("Lectura completada");

  } catch (error) {
    console.error("Fallo en el frontend:", error);
  }
}
