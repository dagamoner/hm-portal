
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad del piloto | Agente IA Inmobiliario",
  description:
    "Información sobre el tratamiento de datos personales durante las pruebas del Agente IA Inmobiliario.",
};

export default function PrivacidadAgenteIA() {
  const email = "mhhigieneyseguridad@gmail.com";

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide">
          Proyecto piloto de inteligencia artificial
        </p>

        <h1 className="mb-5 text-3xl font-bold md:text-4xl">
          Política de Privacidad — Agente IA Inmobiliario
        </h1>

        <p className="text-sm opacity-70">
          Última actualización: 20 de octubre de 2026
        </p>
      </header>

      <div className="space-y-9 leading-7">
        <section>
          <h2 className="mb-3 text-xl font-semibold">
            1. Responsable del entorno de pruebas
          </h2>
          <p>
            MH Higiene y Seguridad administra un entorno piloto
            destinado a evaluar el funcionamiento de un asistente
            virtual basado en inteligencia artificial.
          </p>
          <p className="mt-3">
            El proyecto se desarrolla como una prueba tecnológica
            para una futura implementación independiente en el
            sector inmobiliario. MH Higiene y Seguridad no ofrece
            servicios de intermediación inmobiliaria mediante
            este piloto.
          </p>
          <p className="mt-3">
            Contacto para consultas de privacidad:{" "}
            <a
              href={`mailto:${email}`}
              className="underline"
            >
              {email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            2. Finalidad del tratamiento
          </h2>
          <p>
            El piloto tiene como finalidad evaluar la recepción
            y clasificación de consultas realizadas mediante
            Instagram, la generación de respuestas asistidas
            por inteligencia artificial y el funcionamiento
            de los controles técnicos del sistema.
          </p>
          <p className="mt-3">
            También se realizan pruebas de consulta de una
            base de propiedades y, cuando existe una
            autorización expresa, del registro de datos
            de contacto para seguimiento.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            3. Datos que pueden tratarse
          </h2>
          <p>
            Según el tipo de interacción, el sistema puede
            procesar identificadores técnicos de Instagram,
            contenido de mensajes, fechas y horas, consultas
            realizadas y estados de procesamiento.
          </p>
          <p className="mt-3">
            Solamente cuando la persona lo autorice
            expresamente podrán registrarse los datos de
            contacto que proporcione voluntariamente.
            No se requiere compartir información sensible
            para participar en las pruebas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            4. Tecnologías utilizadas
          </h2>
          <p>
            El entorno piloto utiliza servicios de Meta e
            Instagram para la mensajería, n8n para la
            automatización, servicios de OpenAI para el
            procesamiento asistido por inteligencia
            artificial y Google Sheets como parte de las
            bases de datos de prueba.
          </p>
          <p className="mt-3">
            El contenido de las consultas puede transmitirse
            a los proveedores tecnológicos que intervienen
            en su procesamiento, de acuerdo con la
            configuración del sistema y las condiciones
            aplicables a cada servicio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            5. Uso de inteligencia artificial
          </h2>
          <p>
            Las respuestas del asistente se generan
            automáticamente y pueden contener errores
            o información incompleta.
          </p>
          <p className="mt-3">
            Los datos comerciales, precios, disponibilidad
            y condiciones de las propiedades requieren
            confirmación por una persona responsable.
            El piloto no toma decisiones contractuales
            ni realiza operaciones inmobiliarias.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            6. Conservación de datos
          </h2>
          <p>
            El plazo de conservación previsto para los
            datos personales incorporados al entorno
            piloto es de un máximo de 30 días.
          </p>
          <p className="mt-3">
            Los datos podrán eliminarse antes de ese
            plazo cuando su titular lo solicite,
            salvo que exista una obligación legal
            que requiera conservar información específica.
          </p>
          <p className="mt-3">
            Los plazos y controles de conservación propios
            de plataformas externas, como Instagram,
            también pueden estar sujetos a sus políticas
            y condiciones de servicio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            7. Solicitudes de acceso y eliminación
          </h2>
          <p>
            Las personas que participen en las pruebas
            pueden solicitar información sobre sus datos,
            su corrección o eliminación escribiendo a:
          </p>
          <p className="mt-3">
            <a
              href={`mailto:${email}?subject=Privacidad%20Agente%20IA%20Inmobiliario`}
              className="font-semibold underline"
            >
              {email}
            </a>
          </p>
          <p className="mt-3">
            Para localizar los registros correspondientes,
            podrá solicitarse información suficiente para
            verificar la titularidad de la cuenta o de los
            datos, sin requerir contraseñas.
          </p>
          <p className="mt-3">
            Cuando corresponda, la eliminación comprenderá
            los registros bajo control del proyecto en n8n
            y Google Sheets, sin perjuicio de los datos
            conservados independientemente por proveedores
            externos conforme a sus propias políticas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            8. Participación en el piloto
          </h2>
          <p>
            La participación en las pruebas es voluntaria.
            Las consultas se utilizan exclusivamente
            para evaluar el funcionamiento del sistema.
          </p>
          <p className="mt-3">
            Los datos personales obtenidos durante el
            piloto no se transferirán automáticamente al
            futuro cliente inmobiliario.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            9. Cambios en esta política
          </h2>
          <p>
            Esta política podrá actualizarse cuando
            cambien las características del piloto,
            sus proveedores o las modalidades de
            tratamiento de datos.
          </p>
        </section>
      </div>
    </section>
  );
}
