// --- 1. NAVEGACIÓN SPA ---
function showTab(tabName, event) {
  const sections = ['content-intro', 'content-free', 'content-pay', 'content-success'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  
  const target = document.getElementById('content-' + tabName);
  if (target) target.classList.remove('hidden');
  
  if (event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
  }
}

// --- 2. MOTOR DE INTELIGENCIA ARTIFICIAL (CONECTADO A CLOUDFLARE) ---
const btnEjecutar = document.getElementById('generateBtn');

if (btnEjecutar) {
  btnEjecutar.addEventListener('click', async () => {
    const entradaUsuario = document.getElementById('userInput');
    const areaSalida = document.getElementById('output');
    const contenedorResultado = document.getElementById('resultContainer');
    const texto = entradaUsuario.value.trim();
    
    if (!texto || texto.length < 5) {
      alert("Por favor, ingresa un texto más detallado para procesar.");
      return;
    }

    btnEjecutar.innerText = "Escribiendo...";
    btnEjecutar.disabled = true;
    areaSalida.innerText = "Tu Ghostwriter está analizando y mejorando tu texto...";
    contenedorResultado.classList.remove('hidden');

    try {
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
      areaSalida.innerText = data.text || "La IA no devolvió un resultado claro.";

    } catch (error) {
      console.error("Error detallado:", error);
      areaSalida.innerText = "Fallo en la conexión. Revisa la configuración de la función.";
    } finally {
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}

// --- 3. FUNCIONES ADICIONALES (CALCULADORA, MODALES, ETC.) ---
function calcularTarifa() {
  const g = parseFloat(document.getElementById('gastos').value) || 0;
  const a = parseFloat(document.getElementById('ahorro').value) || 0;
  const hInput = document.getElementById('horas');
  const h = (parseFloat(hInput ? hInput.value : 0) || 0) * 4;
  
  if(h > 0) {
    const tarifa = ((g + a) / h) * 1.20;
    document.getElementById('valor-hora').innerText = tarifa.toFixed(2);
    document.getElementById('res-calc').classList.remove('hidden');
  } else {
    alert("Por favor, ingresa horas válidas.");
  }
}

function descargarPDF() { document.getElementById('pdf-modal').classList.remove('hidden'); }
function cerrarModal() { document.getElementById('pdf-modal').classList.add('hidden'); }
