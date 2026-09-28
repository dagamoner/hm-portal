<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #334155;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4 {
    color: #4F46E5; /* MH Indigo */
  }
  .cover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 85vh;
    text-align: center;
  }
  .cover img {
    width: 250px;
    margin-bottom: 3rem;
  }
  .cover h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: #1E1B4B;
    line-height: 1.1;
  }
  .cover h2 {
    font-size: 1.8rem;
    color: #4F46E5;
    font-weight: 400;
  }
  .cover .footer {
    margin-bottom: 0;
    font-size: 1.2rem;
    color: #64748B;
    border-top: 2px solid #E2E8F0;
    padding-top: 1rem;
    width: 80%;
    margin-top: 5rem;
  }
  .page-break {
    page-break-before: always;
  }
  .step-card {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background-color: #F8FAFC;
    border-left: 6px solid #4F46E5;
  }
  .step-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1E1B4B;
    margin-bottom: 0.5rem;
  }
  .highlight {
    color: #4F46E5;
    font-weight: bold;
  }
  .alert-box {
    background-color: #EEF2FF;
    border: 1px solid #C7D2FE;
    color: #3730A3;
    padding: 1rem;
    border-radius: 8px;
    margin: 1.5rem 0;
  }
</style>

<div class="cover">
  <img src="file:///C:/Users/PC/Documents/antigravity/wonderful-curie/hm-portal/public/logo-mh.png" alt="MH Logo" />
  <h1>MANUAL DE USUARIO</h1>
  <h2>Módulo de Capacitaciones</h2>
  <div class="footer">
    Portal de Gestión Integral - MH
  </div>
</div>

<div class="page-break"></div>

## 1. Introducción

El **Módulo de Capacitaciones** del Portal MH está diseñado para llevar un registro estructurado y auditable de toda la formación en materia de Higiene y Seguridad que reciben los trabajadores de su empresa. 

El módulo permite planificar temáticas, registrar asistentes y emitir de manera automatizada las constancias de asistencia listas para ser firmadas, agilizando el cumplimiento de los planes de capacitación anuales exigidos por la legislación vigente.

---

## 2. Acceso al Módulo

Para ingresar al registro de capacitaciones:

1. Inicie sesión en su cuenta del **Portal MH**.
2. Diríjase al **Directorio de Empresas** y seleccione la <span class="highlight">Empresa</span> deseada.
3. Dentro del panel principal de la empresa, haga clic en el recuadro **"Capacitaciones"** (ícono de presentación / pizarra).
4. Verá el panel principal con un resumen mensual, las últimas capacitaciones impartidas, y un desglose de estadísticas sobre las horas de formación acumuladas.

---

## 3. Registrar una Nueva Capacitación

Registrar un nuevo evento formativo requiere definir primero los datos del evento, y luego asentar quiénes fueron los asistentes.

<div class="step-card">
  <div class="step-title">Paso 1: Crear el Registro Base</div>
  <p>En el panel principal de Capacitaciones, haga clic en el botón superior azul <strong>"+ Nueva Capacitación"</strong>.</p>
  Se abrirá un formulario donde deberá completar:
  <ul>
    <li><strong>Tema de la Capacitación:</strong> El título o asunto principal tratado (ej. "Riesgo Eléctrico", "Uso de Extintores").</li>
    <li><strong>Fecha y Duración:</strong> Seleccione cuándo se realizó y cuántos minutos u horas duró.</li>
    <li><strong>Capacitador:</strong> Indique el nombre del profesional a cargo de impartir la instrucción.</li>
    <li><strong>Metodología:</strong> Si fue Teórica, Práctica o Teórico/Práctica.</li>
  </ul>
  Una vez completados los campos, haga clic en <strong>Guardar</strong> para crear el evento.
</div>

<div class="step-card">
  <div class="step-title">Paso 2: Administrar la Capacitación (Agregar Asistentes)</div>
  <p>Al guardar el registro, el sistema lo redireccionará a la "Vista de Detalle" de esa capacitación específica.</p>
  <ul>
    <li>Busque la sección <strong>"Asistentes"</strong> o <strong>"Nómina de Personal"</strong>.</li>
    <li>Haga clic en <strong>"+ Agregar Asistentes"</strong>.</li>
    <li>Se desplegará la lista completa de empleados activos de la empresa. Puede buscar por nombre o sector, y marcar las casillas correspondientes a quienes presenciaron la charla.</li>
    <li>Haga clic en <strong>Confirmar Asistentes</strong>.</li>
  </ul>
</div>

---

<div class="page-break"></div>

## 4. Diferencia entre "Capacitaciones" y "Charlas de 5 Minutos"

El sistema contempla una separación para las charlas operativas y rápidas en el lugar de trabajo:

<div class="alert-box">
  <strong>Charlas de 5 Minutos:</strong> 
  <br>Si necesita cargar charlas breves de concientización o inducciones pre-tarea, puede acceder a la sub-sección <strong>"Charlas de 5 Minutos"</strong> (ubicada en la parte superior derecha del módulo principal). El proceso de carga es mucho más ágil, simplificado e ideal para los diálogos de seguridad diarios.
</div>

---

## 5. Descargar Constancia de Asistencia (PDF)

Una de las funciones más importantes es la generación automatizada de actas de capacitación para ser firmadas por los trabajadores.

Para exportar el documento:
1. Ingrese al detalle de la capacitación que acaba de cargar (o búsquela en el listado histórico y haga clic sobre ella).
2. Verifique que todos los asistentes estén cargados correctamente en la lista.
3. Busque el botón <strong>"Exportar a PDF"</strong> o <strong>"Descargar Registro"</strong> (ubicado generalmente en la cabecera de la capacitación).
4. El sistema compilará un acta formal con los colores institucionales, el logo, los datos del disertante, los temas tratados, y una grilla con los nombres, DNI y espacio para la <strong>Firma</strong> de cada asistente.

---

## 6. Historial y Modificaciones

Toda capacitación cargada puede ser auditada en el futuro:
- **Editar Evento:** Si hubo un error en la fecha o el nombre del capacitador, puede ingresar al detalle y seleccionar la opción "Editar" (ícono de lápiz).
- **Borrar Evento:** Para eliminar definitivamente el registro y sus asistentes asociados, utilice el botón "Eliminar" (ícono de papelera).
- **Estadísticas Automáticas:** Cada asistente registrado suma a las métricas globales de la empresa. Podrá visualizar en los reportes anuales cuántas horas hombre de capacitación se han invertido.

---

## 7. Soporte Técnico

Si tiene alguna dificultad o consulta adicional sobre el uso del Módulo de Capacitaciones, no dude en contactar a su asesor designado de **MH** o utilizar los canales de soporte integrados en el Portal.

<br><br>
<div style="text-align: center; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 2rem;">
  <strong>MH</strong> - Innovación en Higiene y Seguridad Laboral<br>
  <em>Documento generado automáticamente a través de la plataforma MH.</em>
</div>
