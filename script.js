console.log("Script.js cargado correctamente");

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

// --- TODO LO QUE NECESITA QUE LA PÁGINA ESTÉ LISTA ---
document.addEventListener('DOMContentLoaded', () => {
  
  // --- 2. MOTOR DE IA ---
  const btnEjecutar = document.getElementById('generateBtn');
  console.log("Buscando botón generateBtn:", btnEjecutar);

  if (btnEjecutar) {
    btnEjecutar.addEventListener('click', async () => {
      console.log("¡Click detectado en el botón!");
      
      const entradaUsuario = document.getElementById('userInput');
      const areaSalida = document.getElementById('output');
      const contenedorResultado = document.getElementById('resultContainer');
      const texto = (entradaUsuario) ? entradaUsuario.value.trim() : "";
      
      if (!texto || texto.length < 5) {
        alert("Por favor, ingresa un texto más detallado.");
        return;
      }

      btnEjecutar.innerText = "Escribiendo...";
      btnEjecutar.disabled = true;
      areaSalida.innerText = "Cargando respuesta..."; 
      contenedorResultado.classList.remove('hidden');

      try {
        const response = await fetch('/getGhostwriter', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: texto }) 
        });
        
        if (!response.ok) throw new Error("Error en la conexión");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        areaSalida.innerText = ""; 

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          const lines = chunk.split('\n');
          for (let line of lines) {
            if (line.includes('"text":')) {
              const parts = line.split('"text":');
              if (parts[1]) {
                const content = parts[1].split('"')[1]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"');
                accumulatedText += content;
                areaSalida.innerText = accumulatedText;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error en Fetch:", error);
        areaSalida.innerText = "Error: " + error.message;
      } finally {
        btnEjecutar.innerText = "Generar Resultado";
        btnEjecutar.disabled = false;
      }
    });
  }

  // --- 3. PAYPAL (Metido aquí dentro para evitar conflictos) ---
  if (document.getElementById('paypal-button-container')) {
    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '19.00' } }] }),
      onApprove: (data, actions) => actions.order.capture().then(() => {
        alert("¡Pago exitoso!");
        showTab('success');
      })
    }).render('#paypal-button-container');
  }
});

// --- 4. CALCULADORA (Fuera porque se llama por onclick) ---
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

// --- 5. MODALES ---
function descargarPDF() { document.getElementById('pdf-modal').classList.remove('hidden'); }
function cerrarModal() { document.getElementById('pdf-modal').classList.add('hidden'); }
