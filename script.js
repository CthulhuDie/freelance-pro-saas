console.log("¡POR FIN! El código se está ejecutando correctamente");

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

// --- 2. LÓGICA PRINCIPAL AL CARGAR EL DOM ---
document.addEventListener('DOMContentLoaded', () => {
  
  const btnEjecutar = document.getElementById('generateBtn');

  if (btnEjecutar) {
    btnEjecutar.addEventListener('click', async () => {
        const entradaUsuario = document.getElementById('userInput');
        const areaSalida = document.getElementById('output');
        const contenedorResultado = document.getElementById('resultContainer');
        
        if (!entradaUsuario.value.trim()) return alert("Escribe algo para mejorar");

        btnEjecutar.innerText = "Escribiendo...";
        btnEjecutar.disabled = true;
        contenedorResultado.classList.remove('hidden');
        areaSalida.innerText = "Recibiendo datos...";

        try {
          const response = await fetch('/getGhostwriter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: entradaUsuario.value })
          });
          
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          areaSalida.innerText = ""; 

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            console.log("Chunk recibido:", chunk); // ESTO TE DIRÁ EL SECRETO EN LA CONSOLA

            // PROCESADOR DE TEXTO REFORZADO
            const lines = chunk.split('\n');
            for (let line of lines) {
              if (!line.trim()) continue;
              
              // Si viene en formato JSON (Gemini)
              if (line.includes('"text":')) {
                const match = line.match(/"text"\s*:\s*"([^"]*)"/);
                if (match && match[1]) {
                  const cleanText = match[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"');
                  areaSalida.innerText += cleanText;
                }
              } 
              // Si viene texto plano o con el prefijo 'data:'
              else if (!line.startsWith('{')) {
                const cleanLine = line.replace(/^data:\s*/, "").trim();
                if (cleanLine) areaSalida.innerText += cleanLine + " ";
              }
            }
          }
        } catch (e) {
          areaSalida.innerText = "Error: " + e.message;
          console.error("Fallo en la IA:", e);
        } finally {
          btnEjecutar.innerText = "Generar Resultado";
          btnEjecutar.disabled = false;
        }
      });
    });
  }

  // --- 3. PAYPAL ---
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

// --- 4. CALCULADORA ---
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
