// Navegación SPA
function showTab(tabName) {
  const sections = ['content-intro', 'content-free', 'content-pay', 'content-success'];
  sections.forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('content-' + tabName).classList.remove('hidden');
  
  // Actualizar botones de tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

// Botón PayPal Real
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

// Calculadora
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

// Modal PDF
function descargarPDF() { document.getElementById('pdf-modal').classList.remove('hidden'); }
function cerrarModal() { document.getElementById('pdf-modal').classList.add('hidden'); }
