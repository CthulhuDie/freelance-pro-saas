// --- 2. MOTOR DE INTELIGENCIA ARTIFICIAL (CONECTADO A CLOUDFLARE FUNCTIONS) ---
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
       * Al usar Cloudflare Pages Functions, la ruta relativa
       * debe coincidir con el nombre de tu archivo en la carpeta /functions.
       * Si tu archivo es /functions/getGhostwriter.js, la ruta es '/getGhostwriter'.
       */
      const response = await fetch('/getGhostwriter', { 
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
        // Mostramos el resultado que viene de la IA
        areaSalida.innerText = data.text;
      } else {
        areaSalida.innerText = "La IA no devolvió un resultado claro. Intenta con otra frase.";
      }

    } catch (error) {
      console.error("Error detallado:", error);
      areaSalida.innerText = "Lo siento, hubo un fallo en la conexión con el servicio de IA. Inténtalo de nuevo en unos momentos.";
    } finally {
      // Restauramos el botón
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}
