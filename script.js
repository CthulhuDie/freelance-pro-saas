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

// --- 2. MOTOR DE INTELIGENCIA ARTIFICIAL (MEJORADO) ---
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
      // Llamada a la función de Netlify (Asegúrate de tener el archivo en netlify/functions/getGhostwriter.js)
      const response = await fetch('/.netlify/functions/getGhostwriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: texto }) 
      });
      
      // Verificamos si la respuesta del servidor es correcta (Status 200)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const data = await response.json();
      
      if (data.text) {
        // Mostramos el resultado final
        areaSalida.innerText = data.text;
      } else {
        areaSalida.innerText = "La IA no devolvió un resultado claro. Intenta con otra frase.";
      }

    } catch (error) {
      console.error("Error detallado:", error);
      areaSalida.innerText = "Lo siento, hubo un fallo en la conexión. Verifica que la API Key esté configurada en Netlify.";
    } finally {
      // Restauramos el botón pase lo que pase
      btnEjecutar.innerText = "Generar Resultado";
      btnEjecutar.disabled = false;
    }
  });
}

// --- 3. BOTÓN PAYPAL ---
if (document.getElementById('paypal-button-container')) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      // Valor del servicio: 19.00 USD
      return actions.order.create({ 
        purchase_units: [{ amount: { value: '19.00' } }] 
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        const statusEl = document.getElementById('payment-status');
        if (statusEl) statusEl.innerText = "¡Pago verificado! Desbloqueando contenido...";
        
        // Simulación de carga antes de mostrar la pestaña de éxito
        setTimeout(() => {
          showTab('success');
        }, 1500);
      });
    },
    onError: (err) => {
      console.error("Error en el pago:", err);
      alert("Hubo un problema con la transacción de PayPal.");
    }
  }).render('#paypal-button-container');
}

// --- 4. CALCULADORA DE TARIFAS ---
function calcularTarifa() {
  const g = parseFloat(document.getElementById('gastos').value) || 0;
  const a = parseFloat(document.getElementById('ahorro').value) || 0;
  const hInput = document.getElementById('horas');
  const h = (parseFloat(hInput ? hInput.value : 0) || 0) * 4;
  
  if(h > 0) {
    const tarifa = ((g + a) / h) * 1.20; // Margen del 20%
    const valorHoraEl = document.getElementById('valor-hora');
    const resCalcEl = document.getElementById('res-calc');
    
    if (valorHoraEl) valorHoraEl.innerText = tarifa.toFixed(2);
    if (resCalcEl) resCalcEl.classList.remove('hidden');
  } else {
    alert("Por favor, ingresa horas válidas.");
  }
}

// --- 5. MODAL PDF ---
function descargarPDF() { 
  const modal = document.getElementById('pdf-modal');
  if (modal) modal.classList.remove('hidden'); 
}

function cerrarModal() { 
  const modal = document.getElementById('pdf-modal');
  if (modal) modal.classList.add('hidden'); 
}
