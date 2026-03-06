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

// --- 2. MOTOR DE INTELIGENCIA ARTIFICIAL (Nombres Neutrales) ---
const btnEjecutar = document.getElementById('generateBtn');
if (btnEjecutar) {
  btnEjecutar.addEventListener('click', async () => {
    const entradaUsuario = document.getElementById('userInput');
    const areaSalida = document.getElementById('output');
    const contenedorResultado = document.getElementById('resultContainer');
    const texto = entradaUsuario.value;
    
    // Validación de longitud mínima
    if (!texto || texto.length < 5) {
      alert("Por favor, ingresa un texto más detallado para procesar.");
      return;
    }

    // Estado de carga neutral
    btnEjecutar.innerText = "Procesando...";
    btnEjecutar.disabled = true;
    areaSalida.innerText = "Analizando y mejorando tu texto...";
    contenedorResultado.classList.remove('hidden');

    try {
      // Llamada a la función de Netlify
      const response = await fetch('/.netlify/functions/getGhostwriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Mejora y profesionaliza el siguiente texto de forma experta: ${texto}` })
      });
      
      const data = await response.json();
      
      if (data.text) {
        areaSalida.innerText = data.text;
      } else {
        areaSalida.innerText = "No se pudo obtener una respuesta válida del servidor.";
      }
    } catch (error) {
      console.error(error);
      areaSalida.innerText = "Error de conexión. Inténtalo de nuevo más tarde.";
    } finally {
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}

// --- 3. BOTÓN PAYPAL ---
if (document.getElementById('paypal-button-container')) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({ purchase_units: [{ amount: { value: '19.00' } }] });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        document.getElementById('payment-status').innerText = "¡Pago verificado! Desbloqueando...";
        setTimeout(() => {
          showTab('success');
        }, 1500);
      });
    }
  }).render('#paypal-button-container');
}

// --- 4. CALCULADORA DE TARIFAS ---
function calcularTarifa() {
  const g = parseFloat(document.getElementById('gastos').value) || 0;
  const a = parseFloat(document.getElementById('ahorro').value) || 0;
  const h = (parseFloat(document.getElementById('horas').value) || 0) * 4;
  
  if(h > 0) {
    const tarifa = ((g + a) / h) * 1.20;
    document.getElementById('valor-hora').innerText = tarifa.toFixed(2);
    document.getElementById('res-calc').classList.remove('hidden');
  }
}

// --- 5. MODAL PDF ---
function descargarPDF() { document.getElementById('pdf-modal').classList.remove('hidden'); }
function cerrarModal() { document.getElementById('pdf-modal').classList.add('hidden'); }
