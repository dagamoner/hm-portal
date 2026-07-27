"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function LegalModals() {
  const [openModal, setOpenModal] = useState<'terms' | 'privacy' | null>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <>
      <ul className="flex flex-col gap-2 text-gray-400">
        <li>
          <button onClick={() => setOpenModal('terms')} className="hover:text-white transition-colors text-left">
            Términos y Condiciones
          </button>
        </li>
        <li>
          <button onClick={() => setOpenModal('privacy')} className="hover:text-white transition-colors text-left">
            Política de Privacidad
          </button>
        </li>
      </ul>

      {/* Modal - Términos y Condiciones */}
      {openModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800">Términos y Condiciones</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed">
              <section>
                <h3 className="text-lg font-bold mb-2">Aceptación</h3>
                <p>El registro, acceso, contratación o utilización de la Plataforma implica que la persona usuaria declara:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Haber leído y comprendido estos Términos y Condiciones.</li>
                  <li>Aceptarlos íntegramente.</li>
                  <li>Contar con capacidad legal suficiente.</li>
                  <li>Estar autorizada para actuar en representación de la empresa u organización que registra.</li>
                  <li>Haber leído la Política de Privacidad.</li>
                </ul>
                <p className="mt-2">La aceptación deberá registrarse mediante una casilla independiente, acompañada por la fecha, hora, dirección IP, usuario y versión del documento aceptado.</p>
                <p className="mt-2">La Ley 25.506 reconoce la eficacia jurídica del documento electrónico, la firma electrónica y la firma digital, aunque no toda aceptación mediante casilla equivale jurídicamente a una firma digital certificada.</p>
                <p className="mt-2">A los fines de este documento:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Cliente:</strong> persona humana o jurídica que contrata o administra una cuenta organizacional.</li>
                  <li><strong>Usuario:</strong> persona autorizada por el Cliente para acceder a la Plataforma.</li>
                  <li><strong>Usuario administrador:</strong> usuario que puede crear cuentas, asignar permisos y administrar información del Cliente.</li>
                  <li><strong>Datos del Cliente:</strong> información cargada, importada, generada o almacenada por el Cliente o sus usuarios.</li>
                  <li><strong>Datos personales:</strong> información referida a una persona determinada o determinable.</li>
                  <li><strong>Datos sensibles:</strong> información que, conforme la legislación aplicable, comprende, entre otros datos, información relativa a la salud.</li>
                  <li><strong>Contenido generado:</strong> matrices, informes, recomendaciones, indicadores, programas, documentos o resultados producidos con asistencia de la Plataforma.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Objeto del servicio</h3>
                <p>La Plataforma proporciona herramientas digitales destinadas, entre otras finalidades, a:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Gestionar empresas y establecimientos.</li>
                  <li>Registrar sectores, procesos, puestos y tareas.</li>
                  <li>Identificar peligros y evaluar riesgos laborales.</li>
                  <li>Elaborar matrices y mapas de riesgos.</li>
                  <li>Gestionar obras y Programas de Seguridad.</li>
                  <li>Registrar accidentes, incidentes y acciones correctivas.</li>
                  <li>Gestionar capacitaciones.</li>
                  <li>Registrar entrega y control de EPP.</li>
                  <li>Administrar mediciones y estudios técnicos.</li>
                  <li>Gestionar contratistas.</li>
                  <li>Elaborar informes y planes de mejora.</li>
                  <li>Administrar documentación de Higiene y Seguridad.</li>
                  <li>Generar alertas, recordatorios y paneles de gestión.</li>
                </ul>
                <p className="mt-2">Las funcionalidades disponibles dependerán del plan contratado.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Naturaleza de la Plataforma</h3>
                <p>La Plataforma constituye una herramienta de asistencia técnica y administrativa. No reemplaza:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>El relevamiento presencial del establecimiento u obra.</li>
                  <li>La inspección profesional.</li>
                  <li>Las mediciones instrumentales.</li>
                  <li>El criterio de un profesional competente.</li>
                  <li>La intervención del Servicio de Medicina del Trabajo.</li>
                  <li>La firma profesional exigida legalmente.</li>
                  <li>La aprobación de una ART o autoridad administrativa.</li>
                  <li>Los trámites obligatorios ante organismos públicos.</li>
                  <li>La obligación del empleador de cumplir la normativa vigente.</li>
                </ul>
                <p className="mt-2">Todo informe, matriz, programa, recomendación o resultado generado automáticamente deberá ser revisado y validado por un profesional con incumbencia y matrícula habilitante cuando la naturaleza del documento así lo exija.</p>
                <p className="mt-2 text-rose-600 font-semibold">El Cliente no deberá utilizar resultados automáticos como única base para autorizar tareas críticas, suspender trabajadores, determinar aptitud médica o adoptar decisiones que puedan comprometer la vida, salud o integridad de las personas.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Registro de cuentas</h3>
                <p>Para utilizar determinadas funciones será necesario crear una cuenta.</p>
                <p className="mt-2">El Usuario deberá:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Proporcionar información exacta y actualizada.</li>
                  <li>Mantener la confidencialidad de sus credenciales.</li>
                  <li>Utilizar contraseñas robustas.</li>
                  <li>Activar autenticación multifactor cuando esté disponible.</li>
                  <li>No compartir cuentas personales.</li>
                  <li>Informar inmediatamente accesos sospechosos.</li>
                  <li>Cerrar sesión en equipos compartidos.</li>
                  <li>Mantener actualizados sus datos de contacto.</li>
                </ul>
                <p className="mt-2">Las acciones realizadas mediante una cuenta se presumirán efectuadas por su titular, salvo prueba de compromiso, suplantación o acceso ilegítimo oportunamente informado.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Administración de usuarios</h3>
                <p>El Cliente será responsable de:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Autorizar a sus usuarios.</li>
                  <li>Asignar permisos conforme a sus funciones.</li>
                  <li>Aplicar el principio de mínimo privilegio.</li>
                  <li>Dar de baja inmediatamente accesos de personas desvinculadas.</li>
                  <li>Revisar periódicamente roles y permisos.</li>
                  <li>Evitar que personas no autorizadas accedan a datos de trabajadores.</li>
                  <li>Definir qué usuarios pueden visualizar datos sensibles.</li>
                </ul>
                <p className="mt-2">El Proveedor no será responsable por accesos concedidos incorrectamente por el administrador del Cliente, salvo que el hecho se origine en una vulnerabilidad atribuible al Proveedor.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Obligaciones del Cliente</h3>
                <p>El Cliente se obliga a:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Utilizar la Plataforma de acuerdo con la ley.</li>
                  <li>Cargar información verdadera, pertinente y actualizada.</li>
                  <li>Contar con autorización o fundamento legal para tratar los datos incorporados.</li>
                  <li>Informar a sus trabajadores, contratistas y demás titulares acerca del tratamiento.</li>
                  <li>No cargar información innecesaria o excesiva.</li>
                  <li>Respetar la confidencialidad de los trabajadores.</li>
                  <li>Validar profesionalmente los documentos que correspondan.</li>
                  <li>Mantener su propia infraestructura y dispositivos protegidos.</li>
                  <li>Realizar las copias o exportaciones que correspondan según el plan contratado.</li>
                  <li>Cumplir las obligaciones laborales, previsionales, profesionales y de Higiene y Seguridad aplicables.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Datos de trabajadores y terceros</h3>
                <p>Antes de ingresar datos de trabajadores, contratistas, proveedores o visitantes, el Cliente deberá contar con una base jurídica válida y haber brindado la información exigida por la Ley 25.326.</p>
                <p className="mt-2">El Cliente declara que los datos:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Fueron recolectados lícitamente.</li>
                  <li>Son adecuados y pertinentes.</li>
                  <li>Se encuentran relacionados con finalidades laborales o preventivas.</li>
                  <li>No serán utilizados para discriminación.</li>
                  <li>Serán actualizados cuando corresponda.</li>
                  <li>Serán eliminados cuando dejen de ser necesarios, salvo obligación de conservación.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Información relativa a la salud</h3>
                <p>Los datos relativos a la salud son datos sensibles y requieren protección reforzada. La legislación argentina restringe su recolección y tratamiento y exige preservar el secreto profesional.</p>
                <p className="mt-2">Salvo que exista un módulo expresamente diseñado, contratado y protegido para ello, el Cliente no deberá cargar:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Historias clínicas completas.</li>
                  <li>Diagnósticos médicos detallados.</li>
                  <li>Estudios clínicos.</li>
                  <li>Medicación.</li>
                  <li>Información genética.</li>
                  <li>Datos sobre salud mental.</li>
                  <li>Información no necesaria para la prevención laboral.</li>
                </ul>
                <p className="mt-2">Para la gestión de puestos deberán utilizarse, preferentemente, categorías funcionales como:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Apto.</li>
                  <li>Apto con restricciones.</li>
                  <li>Requiere adecuación.</li>
                  <li>Restricción temporal.</li>
                  <li>Restricción permanente.</li>
                  <li>Fecha de revisión.</li>
                </ul>
                <p className="mt-2">El acceso a esta información deberá limitarse a las personas autorizadas y, cuando corresponda, al Servicio de Medicina del Trabajo.</p>
                <p className="mt-2">Cuando la Plataforma administre historias clínicas o documentación asistencial, también deberán analizarse las obligaciones de confidencialidad y custodia de la Ley 26.529 sobre derechos del paciente.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Usos prohibidos</h3>
                <p>Queda prohibido:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Acceder sin autorización a cuentas, sistemas o datos.</li>
                  <li>Exceder los permisos asignados.</li>
                  <li>Intentar eludir mecanismos de seguridad.</li>
                  <li>Realizar pruebas de penetración sin autorización escrita.</li>
                  <li>Introducir malware, virus o código malicioso.</li>
                  <li>Alterar, destruir o inutilizar información.</li>
                  <li>Interceptar comunicaciones.</li>
                  <li>Utilizar credenciales de terceros.</li>
                  <li>Realizar extracción masiva no autorizada.</li>
                  <li>Utilizar la Plataforma para acosar, discriminar o controlar ilegítimamente a trabajadores.</li>
                  <li>Cargar información obtenida ilícitamente.</li>
                  <li>Utilizar los datos para fines distintos de los informados.</li>
                  <li>Copiar, descompilar o realizar ingeniería inversa, salvo autorización legal.</li>
                  <li>Utilizar automatizaciones que afecten la disponibilidad.</li>
                  <li>Generar documentos falsos o adulterados.</li>
                </ul>
                <p className="mt-2 font-medium">La legislación penal argentina contempla, entre otras conductas, el acceso ilegítimo a sistemas o bancos de datos, la revelación ilegítima, la alteración de información, el fraude y el daño informático.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Seguridad de la información</h3>
                <p>El Proveedor adoptará medidas técnicas y organizativas razonables y proporcionales al riesgo para preservar:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Confidencialidad.</li>
                  <li>Integridad.</li>
                  <li>Disponibilidad.</li>
                  <li>Autenticidad.</li>
                  <li>Trazabilidad.</li>
                  <li>Recuperación de la información.</li>
                </ul>
                <p className="mt-2 font-medium">La Ley 25.326 exige medidas destinadas a evitar adulteración, pérdida, consulta o tratamiento no autorizado y prohíbe mantener datos en sistemas que no reúnan condiciones de integridad y seguridad.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Controles que deberán declararse únicamente cuando estén implementados</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Cifrado de las comunicaciones mediante HTTPS/TLS.</li>
                    <li>Cifrado de información almacenada.</li>
                    <li>Contraseñas protegidas mediante algoritmos de hash seguros.</li>
                    <li>Autenticación multifactor.</li>
                    <li>Control de acceso basado en roles.</li>
                    <li>Separación lógica de los datos de cada Cliente.</li>
                    <li>Registro de accesos y modificaciones.</li>
                    <li>Copias de seguridad cifradas.</li>
                    <li>Pruebas periódicas de restauración.</li>
                    <li>Actualización y parcheado de componentes.</li>
                    <li>Gestión de vulnerabilidades.</li>
                    <li>Revisión de dependencias de software.</li>
                    <li>Separación de ambientes de desarrollo, prueba y producción.</li>
                    <li>Monitoreo de eventos.</li>
                    <li>Plan de respuesta a incidentes.</li>
                    <li>Procedimientos de continuidad y recuperación.</li>
                    <li>Capacitación y compromisos de confidencialidad del personal.</li>
                    <li>Eliminación segura de información.</li>
                </ul>
                <p className="mt-2 font-medium">La Resolución AAIP 47/2018 contempla como medidas recomendadas el control de acceso, control de cambios, respaldo, recuperación, gestión de vulnerabilidades y respuesta a incidentes.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Incidentes de seguridad</h3>
                <p>Ante un incidente confirmado que afecte Datos del Cliente, el Proveedor:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Adoptará medidas de contención.</li>
                  <li>Investigará el alcance.</li>
                  <li>Preservará evidencias cuando corresponda.</li>
                  <li>Corregirá o mitigará la vulnerabilidad.</li>
                  <li>Informará al Cliente sin demora indebida cuando exista riesgo relevante.</li>
                  <li>Brindará información razonablemente disponible sobre el incidente.</li>
                  <li>Colaborará con las autoridades cuando exista obligación legal.</li>
                </ul>
                <p className="mt-2">La notificación podrá ser limitada o diferida cuando una autoridad competente así lo disponga o cuando divulgar detalles pueda aumentar el riesgo de seguridad.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Confidencialidad</h3>
                <p>El Proveedor y las personas que intervengan en el tratamiento deberán mantener confidencialidad sobre los Datos del Cliente, incluso después de finalizada la relación contractual.</p>
                <p className="mt-2">La obligación no resultará aplicable cuando:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>La información sea públicamente conocida sin incumplimiento.</li>
                  <li>Haya sido obtenida legítimamente de un tercero.</li>
                  <li>Deba revelarse por orden judicial o autoridad competente.</li>
                  <li>Su divulgación haya sido autorizada por el Cliente.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Rol de las partes en materia de datos personales</h3>
                <p>Respecto de los datos de registro, facturación, contacto y soporte, el Proveedor actuará como responsable de la base o del tratamiento.</p>
                <p className="mt-2">Respecto de la información de trabajadores y terceros cargada por el Cliente:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>El Cliente determinará las finalidades y será responsable del tratamiento.</li>
                  <li>El Proveedor actuará como prestador de servicios informatizados o encargado, tratando los datos por cuenta e instrucciones del Cliente.</li>
                  <li>El Proveedor no utilizará esa información para fines propios incompatibles.</li>
                  <li>No cederá los datos salvo autorización, obligación legal o subcontratación informada.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Servicios de terceros</h3>
                <p>La Plataforma podrá utilizar proveedores de:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Alojamiento en la nube.</li>
                  <li>Bases de datos.</li>
                  <li>Correos electrónicos.</li>
                  <li>Almacenamiento.</li>
                  <li>Monitoreo.</li>
                  <li>Soporte técnico.</li>
                  <li>Analítica.</li>
                  <li>Facturación.</li>
                  <li>Cobros.</li>
                  <li>Firma electrónica.</li>
                  <li>Inteligencia artificial.</li>
                </ul>
                <p className="mt-2">El listado actualizado deberá encontrarse en [PÁGINA DE SUBENCARGADOS] e indicar:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Nombre del proveedor.</li>
                  <li>Servicio prestado.</li>
                  <li>País de tratamiento.</li>
                  <li>Categorías de datos.</li>
                  <li>Salvaguardas aplicadas.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Disponibilidad y mantenimiento</h3>
                <p>El Proveedor procurará mantener la Plataforma disponible, salvo:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Mantenimientos programados.</li>
                  <li>Mantenimientos urgentes.</li>
                  <li>Fallas de proveedores externos.</li>
                  <li>Ataques informáticos.</li>
                  <li>Interrupciones de Internet.</li>
                  <li>Casos fortuitos o fuerza mayor.</li>
                  <li>Medidas necesarias para proteger el sistema.</li>
                </ul>
                <p className="mt-2">Los mantenimientos programados se comunicarán con 1 día de anticipación, cuando resulte razonablemente posible.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Propiedad intelectual</h3>
                <p>La Plataforma, código fuente, diseño, estructura, bases metodológicas, marcas, logotipos, documentación, interfaces y desarrollos pertenecen al Proveedor o a sus licenciantes.</p>
                <p className="mt-2">El Cliente recibe una licencia:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Limitada.</li>
                  <li>No exclusiva.</li>
                  <li>No transferible.</li>
                  <li>Revocable.</li>
                  <li>Restringida a la vigencia de la contratación.</li>
                  <li>Destinada al uso interno autorizado.</li>
                </ul>
                <p className="mt-2">Los Datos del Cliente continuarán perteneciendo al Cliente o a sus respectivos titulares.</p>
                <p className="mt-2">El Cliente concede al Proveedor únicamente la autorización técnica necesaria para alojar, procesar, respaldar y transmitir esos datos con el fin de prestar el servicio.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Resultados, plantillas y documentos</h3>
                <p>Los informes o documentos generados podrán contener:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Datos proporcionados por el Cliente.</li>
                  <li>Plantillas del Proveedor.</li>
                  <li>Reglas de cálculo.</li>
                  <li>Bibliotecas de peligros.</li>
                  <li>Recomendaciones automatizadas.</li>
                  <li>Contenido editado por profesionales.</li>
                </ul>
                <p className="mt-2">El Cliente podrá utilizar los documentos generados para su gestión interna y contractual, sujeto al plan adquirido.</p>
                <p className="mt-2">No podrá comercializar, revender o explotar separadamente las plantillas o bases metodológicas del Proveedor, salvo autorización expresa.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Funciones automatizadas e inteligencia artificial</h3>
                <p>Cuando existan funciones automatizadas:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Los resultados serán recomendaciones preliminares.</li>
                  <li>El sistema deberá mostrar los datos utilizados.</li>
                  <li>El Usuario podrá modificar o rechazar la sugerencia.</li>
                  <li>La decisión final corresponderá a una persona competente.</li>
                  <li>No se deberán adoptar decisiones laborales o médicas exclusivamente automatizadas.</li>
                  <li>El Cliente no deberá ingresar información sensible en proveedores externos de IA no autorizados.</li>
                </ul>
                <p className="mt-2">El Proveedor deberá informar expresamente cuando el contenido haya sido generado o asistido mediante inteligencia artificial.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Contrataciones de consumo</h3>
                <p>Cuando el contratante revista legalmente carácter de consumidor, conservará todos los derechos irrenunciables previstos por la Ley 24.240 y el Código Civil y Comercial.</p>
                <p className="mt-2">En las contrataciones a distancia, el consumidor posee derecho de revocación dentro del plazo legal. Los proveedores que comercializan servicios mediante páginas o aplicaciones web deben disponer, cuando resulte aplicable, un acceso visible y directo al “Botón de Arrepentimiento”.</p>
                <p className="mt-2 font-medium">Esta cláusula podrá excluirse únicamente cuando el servicio sea estrictamente empresarial y no exista relación de consumo.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Suspensión</h3>
                <p>El Proveedor podrá suspender una cuenta cuando:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Exista incumplimiento grave.</li>
                    <li>Se detecte un riesgo de seguridad.</li>
                    <li>Se utilice la cuenta para actividades ilícitas.</li>
                    <li>Exista mora conforme al contrato.</li>
                    <li>Lo ordene una autoridad competente.</li>
                    <li>Sea necesario proteger a otros usuarios.</li>
                    <li>Exista uso abusivo de recursos.</li>
                </ul>
                <p className="mt-2">Salvo urgencia, se comunicará previamente la situación y se otorgará un plazo razonable para corregirla.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Finalización y exportación</h3>
                <p>Al finalizar el servicio:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>El Cliente contará con [30/60] días para exportar sus datos.</li>
                    <li>Transcurrido el plazo, los datos podrán eliminarse de los sistemas activos.</li>
                    <li>Las copias de respaldo se eliminarán conforme a su ciclo de retención.</li>
                    <li>Se conservará únicamente la información exigida por ley o necesaria para reclamos.</li>
                    <li>La eliminación quedará suspendida ante una orden judicial o deber legal.</li>
                </ul>
                <p className="mt-2">El formato de exportación será [PDF/XLSX/CSV/JSON/ZIP], según el plan.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Limitación de responsabilidad</h3>
                <p>La Plataforma no garantiza la eliminación de todos los riesgos laborales ni el cumplimiento automático de todas las obligaciones legales.</p>
                <p className="mt-2">El Proveedor no será responsable por daños originados exclusivamente en:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Datos incorrectos o incompletos cargados por el Cliente.</li>
                    <li>Falta de validación profesional.</li>
                    <li>Incumplimiento de recomendaciones.</li>
                    <li>Uso contrario a estos términos.</li>
                    <li>Acceso concedido por el Cliente a personas no autorizadas.</li>
                    <li>Equipos comprometidos del Cliente.</li>
                    <li>Decisiones tomadas únicamente con resultados automáticos.</li>
                    <li>Fallas imprevisibles de terceros fuera de su control razonable.</li>
                </ul>
                <p className="mt-2">En relaciones exclusivamente empresariales, la responsabilidad contractual total podrá limitarse a [MONTO O ABONOS DE LOS ÚLTIMOS 12 MESES], salvo dolo, culpa grave, afectación a la vida o integridad, incumplimientos de confidencialidad, protección de datos, propiedad intelectual o supuestos en los que la ley prohíba limitarla.</p>
                <p className="mt-2 font-medium">La limitación no resultará aplicable en perjuicio de derechos irrenunciables de consumidores.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Modificaciones</h3>
                <p>Los Términos podrán modificarse por razones:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Legales.</li>
                    <li>Técnicas.</li>
                    <li>De seguridad.</li>
                    <li>Comerciales.</li>
                    <li>Funcionales.</li>
                </ul>
                <p className="mt-2">Los cambios sustanciales se notificarán con una anticipación mínima de [15/30] días, salvo que deban aplicarse inmediatamente por obligación legal o riesgo urgente.</p>
                <p className="mt-2">El sistema conservará el historial de versiones y la evidencia de aceptación.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Comunicaciones</h3>
                <p>Las comunicaciones podrán enviarse al correo registrado, dentro de la Plataforma o mediante notificaciones electrónicas.</p>
                <p className="mt-2">El Cliente deberá mantener actualizados sus datos.</p>
                <p className="mt-2 font-medium">Las notificaciones de seguridad, privacidad o cambios sustanciales no deberán considerarse comunicaciones comerciales.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Ley y jurisdicción</h3>
                <p>Estos Términos se rigen por las leyes de la República Argentina.</p>
                <p className="mt-2">Para relaciones exclusivamente empresariales, las partes se someten a los tribunales ordinarios competentes de MENDOZA, salvo pacto escrito distinto.</p>
                <p className="mt-2">En relaciones de consumo se respetará la jurisdicción que corresponda al domicilio del consumidor y las demás disposiciones de orden público aplicables.</p>
              </section>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Política de Privacidad */}
      {openModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800">Política de Privacidad</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed">
              <p className="font-semibold text-lg text-slate-600">Esta Política se aplica a:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El sitio web.</li>
                <li>La Plataforma.</li>
                <li>Aplicaciones móviles vinculadas.</li>
                <li>Formularios.</li>
                <li>Soporte.</li>
                <li>Comunicaciones.</li>
                <li>Actividades comerciales.</li>
                <li>Datos tratados por cuenta de Clientes.</li>
              </ul>

              <section>
                <h3 className="text-lg font-bold mb-2">Información recolectada</h3>
                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Datos de usuarios</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nombre y apellido.</li>
                  <li>DNI, cuando resulte necesario.</li>
                  <li>Cargo.</li>
                  <li>Empresa.</li>
                  <li>CUIT.</li>
                  <li>Domicilio.</li>
                  <li>Correo electrónico.</li>
                  <li>Teléfono.</li>
                  <li>Credenciales.</li>
                  <li>Firma o aceptación electrónica.</li>
                  <li>Preferencias.</li>
                </ul>

                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Datos técnicos</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dirección IP.</li>
                  <li>Fecha y hora de acceso.</li>
                  <li>Navegador.</li>
                  <li>Sistema operativo.</li>
                  <li>Identificadores del dispositivo.</li>
                  <li>Registros de actividad.</li>
                  <li>Eventos de seguridad.</li>
                  <li>Historial de cambios.</li>
                  <li>Ubicación aproximada derivada de IP.</li>
                </ul>

                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Datos comerciales</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Plan contratado.</li>
                  <li>Estado de pagos.</li>
                  <li>Facturas.</li>
                  <li>Historial de soporte.</li>
                  <li>Comunicaciones contractuales.</li>
                </ul>

                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Datos cargados por los Clientes</h4>
                <p>Según los módulos habilitados:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Datos de empresas y establecimientos.</li>
                  <li>Nóminas de trabajadores.</li>
                  <li>Puestos y tareas.</li>
                  <li>Capacitaciones.</li>
                  <li>Entregas de EPP.</li>
                  <li>Exposición a agentes de riesgo.</li>
                  <li>Accidentes e incidentes.</li>
                  <li>Restricciones funcionales.</li>
                  <li>Fotografías.</li>
                  <li>Planos.</li>
                  <li>Informes.</li>
                  <li>Firmas.</li>
                  <li>Datos de contratistas.</li>
                  <li>Documentación de ART.</li>
                  <li>Mediciones y estudios.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Fuentes</h3>
                <p>Los datos podrán obtenerse:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Directamente del titular.</li>
                  <li>De la empresa empleadora.</li>
                  <li>De usuarios autorizados.</li>
                  <li>De sistemas integrados.</li>
                  <li>De archivos importados.</li>
                  <li>De proveedores de autenticación.</li>
                  <li>De registros técnicos generados por la Plataforma.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Finalidades</h3>
                <p>La información será utilizada para:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Crear y administrar cuentas.</li>
                  <li>Autenticar usuarios.</li>
                  <li>Prestar las funcionalidades.</li>
                  <li>Elaborar informes solicitados.</li>
                  <li>Brindar soporte.</li>
                  <li>Gestionar facturación.</li>
                  <li>Prevenir fraudes.</li>
                  <li>Detectar accesos no autorizados.</li>
                  <li>Mantener auditoría y trazabilidad.</li>
                  <li>Recuperar información.</li>
                  <li>Mejorar la Plataforma.</li>
                  <li>Cumplir obligaciones legales.</li>
                  <li>Atender derechos de titulares.</li>
                  <li>Enviar comunicaciones operativas.</li>
                  <li>Enviar comunicaciones comerciales solamente cuando exista autorización o fundamento válido.</li>
                  <li>Elaborar estadísticas disociadas o anonimizadas.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Fundamento del tratamiento</h3>
                <p>El tratamiento podrá basarse, según el caso, en:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Consentimiento informado.</li>
                  <li>Ejecución de una relación contractual.</li>
                  <li>Cumplimiento de obligaciones legales.</li>
                  <li>Solicitud del titular.</li>
                  <li>Funciones de prevención laboral.</li>
                  <li>Interés legítimo compatible con los derechos del titular.</li>
                  <li>Instrucciones documentadas del Cliente.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Información previa</h3>
                <p>Cuando el Proveedor recolecte directamente datos personales deberá informar de manera clara:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Finalidad.</li>
                  <li>Destinatarios.</li>
                  <li>Existencia de la base.</li>
                  <li>Identidad y domicilio del responsable.</li>
                  <li>Carácter obligatorio o facultativo.</li>
                  <li>Consecuencias de proporcionar o no los datos.</li>
                  <li>Derechos de acceso, rectificación y supresión.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Datos sensibles</h3>
                <p>La Plataforma aplicará controles reforzados sobre datos relativos a:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Salud.</li>
                  <li>Restricciones funcionales.</li>
                  <li>Exámenes relacionados con agentes de riesgo.</li>
                  <li>Accidentes con información médica.</li>
                  <li>Discapacidad.</li>
                  <li>Afiliación sindical, cuando accidentalmente se incorpore.</li>
                  <li>Otros datos sensibles definidos legalmente.</li>
                </ul>
                <p className="mt-2 text-rose-600 font-medium">El Cliente deberá aplicar minimización y cargar únicamente la información estrictamente necesaria.</p>
                <p className="mt-2">El Proveedor no utilizará datos sensibles para:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Publicidad.</li>
                  <li>Perfilado comercial.</li>
                  <li>Venta de bases.</li>
                  <li>Evaluaciones ajenas a la prevención.</li>
                  <li>Entrenamiento general de modelos de IA sin autorización expresa, anonimización adecuada y evaluación jurídica.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Decisiones automatizadas</h3>
                <p>Las matrices, puntajes y recomendaciones automáticas son herramientas de apoyo.</p>
                <p className="mt-2">No se tomarán, por parte del Proveedor, decisiones exclusivamente automatizadas que determinen:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Aptitud médica.</li>
                  <li>Despido.</li>
                  <li>Sanción.</li>
                  <li>Promoción.</li>
                  <li>Remuneración.</li>
                  <li>Discriminación.</li>
                  <li>Acceso a prestaciones.</li>
                  <li>Asignación obligatoria de tareas de alto riesgo.</li>
                </ul>
                <p className="mt-2 font-medium">El Cliente deberá incorporar revisión humana.</p>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Destinatarios</h3>
                <p>Los datos podrán ser tratados por:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Personal autorizado.</li>
                  <li>Proveedores de alojamiento.</li>
                  <li>Proveedores de soporte.</li>
                  <li>Servicios de correo.</li>
                  <li>Servicios de autenticación.</li>
                  <li>Prestadores de respaldo.</li>
                  <li>Procesadores de pagos.</li>
                  <li>Profesionales contratados bajo confidencialidad.</li>
                  <li>Autoridades públicas cuando exista obligación legal.</li>
                </ul>
                <p className="mt-2 font-medium">No se venderán bases de datos personales.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Plazos de conservación</h3>
                <p>Los datos se conservarán únicamente durante el tiempo necesario para las finalidades informadas.</p>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse border border-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="border border-slate-200 p-2 font-semibold">Categoría</th>
                        <th className="border border-slate-200 p-2 font-semibold">Plazo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-2">Cuenta de usuario</td>
                        <td className="border border-slate-200 p-2">Durante la relación y [PLAZO] posterior</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-200 p-2">Datos del Cliente</td>
                        <td className="border border-slate-200 p-2">Durante el contrato y [30/60] días para exportación</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">Copias de respaldo</td>
                        <td className="border border-slate-200 p-2">[30/60/90] días</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-200 p-2">Registros de acceso</td>
                        <td className="border border-slate-200 p-2">[12/24] meses</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">Facturación</td>
                        <td className="border border-slate-200 p-2">Plazo legal aplicable</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-200 p-2">Solicitudes de derechos</td>
                        <td className="border border-slate-200 p-2">[PLAZO]</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">Soporte</td>
                        <td className="border border-slate-200 p-2">[PLAZO]</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-200 p-2">Consentimientos</td>
                        <td className="border border-slate-200 p-2">Mientras resulte necesario acreditar su existencia</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">Datos anonimizados</td>
                        <td className="border border-slate-200 p-2">Podrán conservarse sin identificación personal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">La supresión podrá diferirse cuando exista obligación legal, reclamo pendiente, investigación, litigio o necesidad de preservar evidencia.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Medidas de seguridad</h3>
                <p>El Proveedor aplicará controles adecuados al riesgo, incluyendo los que efectivamente se encuentren implementados:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <li>Cifrado en tránsito.</li>
                  <li>Cifrado en reposo.</li>
                  <li>Autenticación multifactor.</li>
                  <li>Roles y permisos.</li>
                  <li>Registros de auditoría.</li>
                  <li>Monitoreo.</li>
                  <li>Copias de seguridad.</li>
                  <li>Pruebas de recuperación.</li>
                  <li>Gestión de vulnerabilidades.</li>
                  <li>Revisión de accesos.</li>
                  <li>Parches.</li>
                  <li>Protección contra ataques automatizados.</li>
                  <li>Gestión de incidentes.</li>
                  <li>Acuerdos de confidencialidad.</li>
                  <li>Eliminación segura.</li>
                  <li>Separación entre clientes.</li>
                  <li>Desarrollo seguro.</li>
                </ul>
                <p className="mt-2 font-medium">Ningún sistema puede garantizar riesgo cero, pero el Proveedor deberá adoptar medidas razonables, mantenerlas y revisarlas periódicamente.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Derechos de los titulares</h3>
                <p>Los titulares podrán solicitar:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Acceso.</li>
                  <li>Rectificación.</li>
                  <li>Actualización.</li>
                  <li>Supresión, cuando corresponda.</li>
                  <li>Confidencialidad.</li>
                  <li>Información sobre cesiones.</li>
                  <li>Retiro del consentimiento para finalidades opcionales.</li>
                </ul>
                <p className="mt-2 font-medium">Las solicitudes deberán enviarse a mhhigieneyseguridad@gmail.com acompañadas de información suficiente para verificar la identidad.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Autoridad de control</h3>
                <p>La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 y puede recibir denuncias y reclamos vinculados con incumplimientos en materia de protección de datos.</p>
                <div className="bg-slate-50 p-4 rounded-xl mt-2 border border-slate-200 text-slate-700 italic">
                  La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene atribuciones para atender denuncias y reclamos relacionados con el incumplimiento de las normas de protección de datos personales.
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Cookies y tecnologías similares</h3>
                <p>La Plataforma podrá utilizar:</p>
                
                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Cookies esenciales</h4>
                <p>Necesarias para iniciar sesión, mantener sesiones, recordar seguridad, balancear carga, prevenir ataques. No pueden desactivarse sin afectar el funcionamiento.</p>
                
                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Cookies de preferencias</h4>
                <p>Permiten recordar idioma, filtros o configuración.</p>

                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Cookies analíticas</h4>
                <p>Permiten conocer el uso y rendimiento de la Plataforma.</p>

                <h4 className="font-semibold mt-4 mb-2 text-indigo-600">Cookies de marketing</h4>
                <p>Solamente deberán utilizarse con información y consentimiento cuando corresponda.</p>
                
                <p className="mt-4">El banner deberá permitir: Aceptar, Rechazar las no esenciales, Configurar categorías, Modificar la elección posteriormente.</p>
                <p className="mt-2 font-medium">No debe instalar cookies analíticas o publicitarias antes de la selección cuando el sistema haya decidido utilizar un modelo de consentimiento previo.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Comunicaciones comerciales</h3>
                <p>El Usuario podrá solicitar en cualquier momento dejar de recibir comunicaciones promocionales.</p>
                <p className="mt-2">La baja de marketing no afectará:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Alertas de seguridad.</li>
                  <li>Facturas.</li>
                  <li>Recuperación de contraseña.</li>
                  <li>Avisos operativos.</li>
                  <li>Modificaciones legales.</li>
                  <li>Notificaciones contractuales.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-bold mb-2">Menores de edad</h3>
                <p>La Plataforma se encuentra destinada a organizaciones y profesionales y no está dirigida a menores de edad.</p>
                <p className="mt-2">No deberán crearse cuentas de menores sin una función y autorización legalmente válida. La eventual información laboral de adolescentes deberá ser tratada bajo el régimen especial aplicable al trabajo adolescente protegido.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Incidentes</h3>
                <p>Cuando se confirme un incidente que pueda afectar datos personales, el Proveedor evaluará:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Naturaleza del incidente.</li>
                  <li>Sistemas afectados.</li>
                  <li>Categorías de datos.</li>
                  <li>Cantidad aproximada de titulares.</li>
                  <li>Consecuencias posibles.</li>
                  <li>Medidas de contención.</li>
                  <li>Necesidad de comunicación al Cliente, titulares o autoridades.</li>
                </ul>
                <p className="mt-2 font-medium">La comunicación incluirá información útil sin revelar detalles que comprometan la seguridad.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">Cambios</h3>
                <p>Las modificaciones sustanciales se comunicarán mediante correo o aviso dentro de la Plataforma.</p>
                <p className="mt-2">Cuando un cambio introduzca nuevas finalidades incompatibles, se solicitará un nuevo consentimiento cuando corresponda.</p>
              </section>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mt-8">
                <h3 className="text-lg font-black text-indigo-900 mb-2">ANEXO RECOMENDADO: TRATAMIENTO DE DATOS POR CUENTA DEL CLIENTE</h3>
                <p className="text-indigo-800 mb-2">Además de los documentos anteriores, el contrato empresarial debería contener un anexo que establezca:</p>
                <ul className="list-disc pl-5 text-indigo-700 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <li>Objeto y duración del tratamiento.</li>
                  <li>Categorías de titulares.</li>
                  <li>Categorías de datos.</li>
                  <li>Finalidades.</li>
                  <li>Instrucciones documentadas del Cliente.</li>
                  <li>Deber de confidencialidad.</li>
                  <li>Medidas de seguridad.</li>
                  <li>Subcontratación.</li>
                  <li>Transferencias internacionales.</li>
                  <li>Asistencia para responder derechos.</li>
                  <li>Notificación de incidentes.</li>
                  <li>Exportación y devolución.</li>
                  <li>Eliminación al finalizar.</li>
                  <li>Auditorías.</li>
                  <li>Prohibición de utilizar datos para fines propios.</li>
                  <li>Condiciones para utilizar IA.</li>
                  <li>Responsabilidades de cada parte.</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl mt-4">
                <h3 className="text-lg font-black text-emerald-900 mb-2">Verificaciones antes de publicar ✅</h3>
                <p className="text-emerald-800 mb-2">Antes de subir estos documentos al sistema deberá definirse:</p>
                <ul className="list-disc pl-5 text-emerald-700 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <li>Titular legal y CUIT.</li>
                  <li>Dominio y domicilio.</li>
                  <li>Modelo exclusivamente B2B o también consumidores.</li>
                  <li>Proveedor cloud y países de alojamiento.</li>
                  <li>Procesador de pagos.</li>
                  <li>Herramientas de analítica.</li>
                  <li>Servicios de inteligencia artificial.</li>
                  <li>Datos sensibles realmente tratados.</li>
                  <li>Plazos de conservación.</li>
                  <li>Política de copias de seguridad.</li>
                  <li>RTO y RPO.</li>
                  <li>Medidas técnicas efectivamente implementadas.</li>
                  <li>Canal de incidentes.</li>
                  <li>Canal para derechos.</li>
                  <li>Listado de subencargados.</li>
                  <li>Contrato de tratamiento de datos.</li>
                  <li>Procedimiento de eliminación.</li>
                  <li>Registro de aceptación y versiones.</li>
                  <li>Necesidad de inscripción de bases de datos.</li>
                </ul>
              </div>

            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
