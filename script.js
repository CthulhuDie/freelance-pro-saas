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

// --- 2. MOTOR DE IA (CONECTADO A CLOUDFLARE) ---
const btnEjecutar = document.getElementById('generateBtn');

if (btnEjecutar) {
  btnEjecutar.addEventListener('click', async () => {
    const entradaUsuario = document.getElementById('userInput');
    const areaSalida = document.getElementById('output');
    const contenedorResultado = document.getElementById('resultContainer');
    const texto = entradaUsuario.value.trim();
    
    if (!texto || texto.length < 5) {
      alert("Por favor, ingresa un texto más detallado.");
      return;
    }

    // Visual: Cargando
    btnEjecutar.innerText = "Escribiendo...";
    btnEjecutar.disabled = true;
    areaSalida.innerText = "Tu Ghostwriter está trabajando...";
    contenedorResultado.classList.remove('hidden');

    try {
      const response = await fetch('/getGhostwriter', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: texto }) 
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la conexión");
      }
      
      areaSalida.innerText = data.text || "La IA no devolvió un resultado.";

    } catch (error) {
      console.error("Error:", error);
      areaSalida.innerText = "Error: " + error.message;
    } finally {
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}

// --- 3. PAYPAL ---
if (document.getElementById('paypal-button-container')) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({ purchase_units: [{ amount: { value: '19.00' } }] });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        alert("¡Pago exitoso!");
        showTab('success');
      });
    }
  }).render('#paypal-button-container');
}

// --- 4. CALCULADORA ---
function calcularTarifa() {
  const g = parseFloat(document.getElementById('gastos').value) || 0;
  const a = parseFloat(document.getElementById('ahorro').value) || 0;
  const h = (parseFloat(document.getElementById('horas').value) || 0) * 4;
  
  if(h > 0) {
    const tarifa = ((g + a) / h) * 1.20;
    document.getElementById('valor-hora').innerText = tarifa.toFixed(2);
    document.getElementById('res-calc').classList.remove('hidden');
  } else {
    alert("Ingresa horas semanales válidas.");
  }
}

// --- 5. MODALES ---
function descargarPDF() { document.getElementById('pdf-modal').classList.remove('hidden'); }
function cerrarModal() { document.getElementById('pdf-modal').classList.add('hidden'); }
