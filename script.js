// --- 2. MOTOR DE INTELIGENCIA ARTIFICIAL (OPTIMIZADO PARA CLOUDFLARE) ---
const btnEjecutar = document.getElementById('generateBtn');

if (btnEjecutar) {
  btnEjecutar.addEventListener('click', async () => {
    const entradaUsuario = document.getElementById('userInput');
    const areaSalida = document.getElementById('output');
    const contenedorResultado = document.getElementById('resultContainer');
    const texto = entradaUsuario.value.trim();
    
    // Validación de longitud mínima
    if (!texto || texto.length < 5) {
      alert("Por favor, ingresa un texto más detallado para procesar.");
      return;
    }

    // Estado de carga visual
    btnEjecutar.innerText = "Escribiendo...";
    btnEjecutar.disabled = true;
    areaSalida.innerText = "Tu Ghostwriter está analizando y mejorando tu texto...";
    contenedorResultado.classList.remove('hidden');

    try {
      /**
       * IMPORTANTE: En Cloudflare Pages, si no usas Functions, 
       * deberás llamar directamente a la API o a tu Worker.
       * He cambiado la ruta de Netlify a una genérica de API.
       */
      const response = await fetch('/api/getGhostwriter', { // Ruta actualizada
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: texto }) 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const data = await response.json();
      
      if (data.text) {
        areaSalida.innerText = data.text;
      } else {
        areaSalida.innerText = "La IA no devolvió un resultado claro. Intenta con otra frase.";
      }

    } catch (error) {
      console.error("Error detallado:", error);
      // MENSAJE CORREGIDO: Sin menciones a Netlify
      areaSalida.innerText = "Lo siento, hubo un fallo en la conexión con el servicio de IA. Inténtalo de nuevo en unos momentos.";
    } finally {
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}
