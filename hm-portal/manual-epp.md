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
    margin-top: auto;
    font-size: 1.2rem;
    color: #64748B;
    border-top: 2px solid #E2E8F0;
    padding-top: 1rem;
    width: 80%;
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
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }
  th, td {
    border: 1px solid #E2E8F0;
    padding: 0.75rem;
    text-align: left;
  }
  th {
    background-color: #4F46E5;
    color: white;
  }
  tr:nth-child(even) {
    background-color: #F8FAFC;
  }
</style>

<div class="cover">
  <img src="file:///C:/Users/PC/Documents/antigravity/wonderful-curie/hm-portal/public/logo-mh.png" alt="MH Logo" />
  <h1>MANUAL DE USUARIO</h1>
  <h2>Gestión y Entrega de E.P.P.</h2>
  <div class="footer">
    Portal de Gestión Integral - MH
  </div>
</div>

<div class="page-break"></div>

## 1. Introducción

El **Módulo de Entrega de E.P.P. (Elementos de Protección Personal)** del Portal MH está diseñado para facilitar, digitalizar y auditar la asignación de indumentaria y equipos de seguridad a los trabajadores de su empresa, dando pleno cumplimiento a la **Resolución 299/11 de la SRT**.

Este manual lo guiará paso a paso para utilizar el módulo de forma eficiente, permitiéndole generar registros de entrega, descargar constancias en PDF y mantener el legajo de cada trabajador siempre al día.

---

## 2. Acceso al Módulo

Para ingresar al módulo de Entrega de EPP:

1. Inicie sesión en su cuenta del **Portal MH**.
2. En el menú principal (o Directorio de Empresas), seleccione la <span class="highlight">Empresa</span> con la que desea trabajar.
3. Dentro del panel de la empresa, busque y haga clic en la pestaña **"Personal y EPP"** (ícono de usuarios/casco).
4. Verá el listado de todos los trabajadores registrados. Haga clic sobre el nombre del trabajador, o presione el botón **Ver Ficha / EPP** para abrir su perfil individual.

---

## 3. Registrar una Nueva Entrega de EPP

Una vez dentro del perfil del trabajador, descienda hasta la sección denominada **"Registro de Entrega de EPP (Res. SRT 299/11)"**. Allí verá el historial de entregas. Para realizar una nueva carga:

<div class="step-card">
  <div class="step-title">Paso 1: Abrir el Formulario</div>
  Haga clic en el botón azul <strong>"+ Nueva Entrega"</strong>. Se abrirá una ventana emergente (modal) con el formulario de carga.
</div>

<div class="step-card">
  <div class="step-title">Paso 2: Datos Generales</div>
  Complete los campos principales del registro:
  <ul>
    <li><strong>Fecha de Entrega:</strong> Seleccione el día en que se le entregó el equipo al trabajador (por defecto aparecerá la fecha actual).</li>
    <li><strong>Supervisor / Entregado por:</strong> Ingrese el nombre de la persona responsable de entregar el equipo (opcional).</li>
    <li><strong>Observaciones:</strong> Añada notas adicionales si fuese necesario (ej. "Reposición por desgaste").</li>
  </ul>
</div>

<div class="step-card">
  <div class="step-title">Paso 3: Agregar Artículos (Ítems)</div>
  <p>En la sección "Elementos Entregados", podrá listar los equipos exactos:</p>
  <ol>
    <li>Haga clic en <strong>"+ Agregar Ítem"</strong>.</li>
    <li>Seleccione el <strong>Tipo de EPP</strong> de la lista desplegable (ej. Casco, Zapatos de Seguridad, Guantes, etc.).</li>
    <li>Ingrese la <strong>Descripción/Marca</strong> (ej. "Zapatos Funcional Talle 42").</li>
    <li>Indique la <strong>Cantidad</strong> entregada.</li>
    <li>Indique si cuenta con <strong>Certificación</strong> (Sí/No).</li>
  </ol>
  <em>Nota: Puede repetir este paso haciendo clic en "+ Agregar Ítem" tantas veces como artículos haya entregado en esa fecha.</em>
</div>

<div class="step-card">
  <div class="step-title">Paso 4: Guardar Registro</div>
  Una vez cargados todos los elementos, revise la información y haga clic en <strong>"Guardar Entrega"</strong>. El sistema procesará los datos y el nuevo registro aparecerá instantáneamente en el historial del trabajador.
</div>

---

<div class="page-break"></div>

## 4. Descargar Constancia en PDF (Res. 299/11)

El Portal MH genera de manera automática la constancia de entrega de EPP con el formato legal exigido por la Superintendencia de Riesgos del Trabajo (SRT).

Para obtener este documento:

1. Diríjase a la tabla de **Registro de Entrega de EPP** dentro de la ficha del trabajador.
2. Busque la entrega que desea imprimir.
3. Haga clic en el botón **"Descargar PDF"** (ícono de nube/flecha) ubicado a la derecha de esa entrega.
4. El sistema generará y descargará automáticamente un archivo PDF con la planilla de entrega, lista para que el trabajador la firme físicamente, dando cumplimiento a la normativa vigente.

---

## 5. Historial, Edición y Eliminación

El sistema guarda un registro perpetuo de las entregas. Cada vez que usted registre una nueva entrega, se sumará al historial del trabajador, permitiendo tener una trazabilidad absoluta de la vida útil de los elementos.

### Eliminar una Entrega por Error
Si cometió un error al registrar una entrega, puede eliminarla permanentemente:
1. En la fila de la entrega, haga clic en el botón rojo de **Borrar** (ícono de papelera).
2. El sistema le pedirá una doble confirmación en línea ("¿Borrar?").
3. Al confirmar, el registro desaparecerá del sistema.

### Seguimiento de Certificaciones
En la vista principal del historial, un indicador verde o rojo le informará rápidamente si los artículos entregados en esa fecha contaban con la certificación correspondiente, lo cual es fundamental frente a eventuales auditorías o inspecciones.

---

## 6. Soporte Técnico

Si tiene alguna dificultad o consulta adicional sobre el uso del Módulo de Entrega de EPP, no dude en contactar a su asesor designado de **MH** o utilizar los canales de soporte integrados en el Portal.

<br><br><br>
<div style="text-align: center; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 2rem;">
  <strong>MH</strong> - Innovación en Higiene y Seguridad Laboral<br>
  <em>Documento generado automáticamente a través de la plataforma MH.</em>
</div>
