<!DOCTYPE html>
<div class="dashboard">
  <header class="main-header">
    <h1>Freelance Pro <span class="badge">IA Engine</span></h1>
    <p>Plataforma de Gestión y Formación para Freelancers</p>
  </header>

  <section class="course-container">
    <nav class="tabs">
      <button class="tab-btn active" onclick="showTab('intro')">Inicio</button>
      <button class="tab-btn" onclick="showTab('free')">Lección 1</button>
      <button class="tab-btn premium-btn" onclick="showTab('pay')">Premium 🔒</button>
    </nav>

    <div id="display-area" class="display-card">
      
      <div id="content-intro">
        <h2>Bienvenido al Futuro del Trabajo</h2>
        <p>Aprende a usar la IA como tu <b>Ghostwriter</b> personal para ganar más clientes.</p>
        <div class="ia-features">
          <span>🚀 Alta Productividad</span>
          <span>💰 Gestión de Cobros</span>
        </div>
      </div>

      <div id="content-free" class="hidden">
        <h2>Módulo 1: Mentalidad de Negocio</h2>
        <p>No vendas código, vende soluciones. La IA hará el trabajo pesado por ti.</p>
        <div class="video-placeholder">▶️ Video: Cómo usar la IA en Upwork</div>
      </div>

      <div id="content-pay" class="hidden">
        <div class="paywall">
          <h2>Desbloquea el Kit Premium</h2>
          <p>Accede al Manual Maestro, la Calculadora de Tarifas y el Generador IA.</p>
          <div id="paypal-button-container"></div>
          <p id="payment-status" class="status-msg"></p>
        </div>
      </div>

      <div id="content-success" class="hidden">
        <h2 class="text-success">¡Acceso Total Concedido!</h2>
        <p>Usa estas herramientas exclusivas para potenciar tu carrera:</p>
        
        <div class="tools-grid">
          <div class="tool-card">
            <h4>Manual Ghostwriter</h4>
            <button class="btn-tool" onclick="descargarPDF()">📖 Abrir Manual</button>
          </div>
          
          <div class="tool-card">
            <h4>Calculadora de Tarifas</h4>
            <div class="calc-form">
              <input type="number" id="gastos" placeholder="Gastos Mes ($)">
              <input type="number" id="ahorro" placeholder="Meta Ahorro ($)">
              <input type="number" id="horas" placeholder="Horas/Semana">
              <button onclick="calcularTarifa()">Calcular</button>
            </div>
            <div id="res-calc" class="res-box hidden">
              Tarifa: <b>$<span id="valor-hora">0</span>/h</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="roadmap card">
    <h3>Roadmap de Desarrollo 2026</h3>
    <ul class="roadmap-list">
      <li class="done">✅ Interfaz y Pasarela PayPal</li>
      <li class="current">🚀 Integración API Ghostwriter (Próximamente)</li>
      <li>⏳ Dashboard de Analítica para el Freelancer</li>
    </ul>
  </section>
</div>

<div id="pdf-modal" class="modal hidden">
  <div class="modal-content">
    <span class="close-btn" onclick="cerrarModal()">&times;</span>
    <div class="modal-header">
      <h2>La Biblia del Freelancer IA</h2>
    </div>
    <div class="modal-body">
      <h3>Framework R-I-C</h3>
      <p>Rol + Instrucción + Contexto. Ejemplo: "Actúa como un experto en ventas..."</p>
      <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
    </div>
  </div>
</div>

<script src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"></script>
</html>
