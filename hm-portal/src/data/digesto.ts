export interface DigestoEntry {
  id: string;
  type: string;
  number: string;
  year: string;
  topic: string;
  description: string;
  link: string;
}

export interface DigestoModule {
  id: string;
  title: string;
  entries: DigestoEntry[];
}

export const digestoData: DigestoModule[] = [
  {
    id: "modulo-1",
    title: "Módulo 1: Convenios Internacionales de la OIT (Jerarquía Superior a las Leyes)",
    entries: [
      {
        id: "m1-1",
        type: "Ley (Convenio OIT 81)",
        number: "14.329",
        year: "1954",
        topic: "Inspección del Trabajo",
        description: "Aprueba el Convenio sobre la Inspección del Trabajo en la industria y el comercio.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/150000-154999/153503/norma.htm"
      },
      {
        id: "m1-2",
        type: "Ley (Convenio OIT 139)",
        number: "21.663",
        year: "1977",
        topic: "Cáncer Profesional",
        description: "Aprueba el Convenio sobre prevención y control de riesgos por agentes cancerígenos.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/17612/norma.htm"
      },
      {
        id: "m1-3",
        type: "Ley (Convenio OIT 184)",
        number: "25.739",
        year: "2003",
        topic: "Seguridad Agrícola",
        description: "Aprueba el Convenio sobre la seguridad y la salud en la agricultura.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/85000-89999/86300/norma.htm"
      },
      {
        id: "m1-4",
        type: "Ley (Convenio OIT 155)",
        number: "26.693",
        year: "2011",
        topic: "Salud y Seguridad",
        description: "Aprueba el Convenio N° 155 y su Protocolo 2002 sobre políticas nacionales de SST.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/185000-189999/186000/norma.htm"
      },
      {
        id: "m1-5",
        type: "Ley (Convenio OIT 187)",
        number: "26.694",
        year: "2011",
        topic: "Marco Promocional SST",
        description: "Aprueba el Convenio N° 187 sobre el marco promocional para la seguridad y salud.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/185000-189999/186001/norma.htm"
      },
      {
        id: "m1-6",
        type: "Ley (Convenio OIT 190)",
        number: "27.580",
        year: "2020",
        topic: "Violencia y Acoso",
        description: "Aprueba el Convenio sobre la eliminación de la violencia y el acoso en el trabajo.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/345000-349999/345330/norma.htm"
      }
    ]
  },
  {
    id: "modulo-2",
    title: "Módulo 2: Marco Legal Nacional (Leyes Marco y Decretos Reglamentarios)",
    entries: [
      {
        id: "m2-1",
        type: "Ley",
        number: "19.587",
        year: "1972",
        topic: "Marco General SST",
        description: "Ley Fundamental de Higiene y Seguridad en el Trabajo en la Argentina.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/17612/norma.htm"
      },
      {
        id: "m2-2",
        type: "Ley",
        number: "24.557",
        year: "1995",
        topic: "Riesgos del Trabajo",
        description: "Ley de Riesgos del Trabajo (LRT), creación del sistema de ART y prevención.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/27971/texact.htm"
      },
      {
        id: "m2-3",
        type: "Ley",
        number: "26.773",
        year: "2012",
        topic: "Reparación de Daños",
        description: "Régimen de ordenamiento de la reparación de daños por accidentes y enfermedades.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/200000-204999/203798/norma.htm"
      },
      {
        id: "m2-4",
        type: "Ley",
        number: "27.348",
        year: "2017",
        topic: "Comisiones Médicas",
        description: "Ley Complementaria de la LRT (trámite obligatorio ante Comisiones Médicas).",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/270000-274999/272119/norma.htm"
      },
      {
        id: "m2-5",
        type: "Decreto",
        number: "351",
        year: "1979",
        topic: "General / Industria",
        description: "Reglamento General de la Ley N° 19.587 (Anexos técnicos de instalaciones).",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/30000-34999/32030/texact.htm"
      },
      {
        id: "m2-6",
        type: "Decreto",
        number: "1338",
        year: "1996",
        topic: "Servicios de SySO",
        description: "Regula la asignación de horas profesional de Higiene y Seguridad y Medicina.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/40574/texact.htm"
      },
      {
        id: "m2-7",
        type: "Decreto",
        number: "911",
        year: "1996",
        topic: "Construcción",
        description: "Reglamento de Higiene y Seguridad específico para la Industria de la Construcción.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/35000-39999/38568/texact.htm"
      },
      {
        id: "m2-8",
        type: "Decreto",
        number: "617",
        year: "1997",
        topic: "Agro",
        description: "Reglamento de Higiene y Seguridad para la Actividad Agraria.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/45000-49999/46162/norma.htm"
      },
      {
        id: "m2-9",
        type: "Decreto",
        number: "249",
        year: "2007",
        topic: "Minería",
        description: "Reglamento de Higiene y Seguridad para la Actividad Minera.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/125000-129999/126284/norma.htm"
      },
      {
        id: "m2-10",
        type: "Decreto",
        number: "658",
        year: "1996",
        topic: "Enfermedades Prof.",
        description: "Listado oficial de Enfermedades Profesionales (mod. por Dec. 1167/03 y 49/14).",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/35000-39999/37586/norma.htm"
      }
    ]
  },
  {
    id: "modulo-3",
    title: "Módulo 3: Resoluciones Técnicas, Protocolos y Reglamentaciones Recientes (SRT / Ministerios)",
    entries: [
      {
        id: "m3-1",
        type: "Resolución (Sec. Ind. y Com.)",
        number: "18",
        year: "2025",
        topic: "Elementos Protección (EPP)",
        description: "Nuevo Reglamento Técnico para Equipos y Elementos de Protección Personal.",
        link: "https://www.argentina.gob.ar/srt/prevencion/normativa/actualizacion-normativa"
      },
      {
        id: "m3-2",
        type: "Resolución (SRT)",
        number: "61",
        year: "2023",
        topic: "Trabajos en Altura",
        description: "Aprueba medidas y especificaciones de seguridad para trabajos en altura.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/390000-394999/394625/norma.htm"
      },
      {
        id: "m3-3",
        type: "Resolución (SRT)",
        number: "30",
        year: "2023",
        topic: "Carga Térmica",
        description: "Especificaciones técnicas sobre Carga Térmica y Estrés por Calor en el trabajo.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/385000-389999/386851/norma.htm"
      },
      {
        id: "m3-4",
        type: "Resolución (SRT)",
        number: "11",
        year: "2022",
        topic: "Riesgo Eléctrico (>1kV)",
        description: "Reglamento para Trabajos con Tensión en instalaciones > 1 kV (Asoc. Electrotécnica).",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/360000-364999/361802/norma.htm"
      },
      {
        id: "m3-5",
        type: "Resolución (SRT)",
        number: "13",
        year: "2020",
        topic: "Manejo de Cargas",
        description: "Asistencia mecánica para traslado de productos cárnicos > 25 kg.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/330000-334999/334208/norma.htm"
      },
      {
        id: "m3-6",
        type: "Resolución (SRT)",
        number: "81",
        year: "2019",
        topic: "Cancerígenos",
        description: "Sistema de Vigilancia y Control de Sustancias y Agentes Cancerígenos.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/325000-329999/328901/norma.htm"
      },
      {
        id: "m3-7",
        type: "Resolución (SRT)",
        number: "42",
        year: "2018",
        topic: "Manejo de Cargas",
        description: "Asistencia mecánica obligatoria para bolsas de cemento > 25 kg en obras.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/310405/norma.htm"
      },
      {
        id: "m3-8",
        type: "Resolución (SRT)",
        number: "25",
        year: "2018",
        topic: "RGRL Digital",
        description: "Sistema electrónico para el Relevamiento General de Riesgos Laborales.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/305000-309999/308821/norma.htm"
      },
      {
        id: "m3-9",
        type: "Resolución (SRT)",
        number: "801",
        year: "2015",
        topic: "Químicos / SGA",
        description: "Sistema Globalmente Armonizado (SGA / GHS) de etiquetado químico.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/245593/norma.htm"
      },
      {
        id: "m3-10",
        type: "Resolución (SRT)",
        number: "886",
        year: "2015",
        topic: "Ergonomía",
        description: "Protocolo de Ergonomía Obligatorio (planillas de evaluación de riesgos).",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/246272/norma.htm"
      },
      {
        id: "m3-11",
        type: "Resolución (SRT)",
        number: "900",
        year: "2015",
        topic: "Puesta a Tierra",
        description: "Protocolo Obligatorio para Medición de Puesta a Tierra y Verificación Eléctrica.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/246513/norma.htm"
      },
      {
        id: "m3-12",
        type: "Resolución (SRT)",
        number: "905",
        year: "2015",
        topic: "Legajos de Salud",
        description: "Funciones y registros obligatorios de Servicios de Higiene, Seguridad y Medicina.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/246509/norma.htm"
      },
      {
        id: "m3-13",
        type: "Resolución (SRT)",
        number: "960",
        year: "2015",
        topic: "Autoelevadores",
        description: "Condiciones de seguridad e instrucción técnica para operación de autoelevadores.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/246702/norma.htm"
      },
      {
        id: "m3-14",
        type: "Resolución (SRT)",
        number: "84",
        year: "2012",
        topic: "Iluminación",
        description: "Protocolo Obligatorio para Medición de Iluminación en Ambientes Laborales.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/190000-194999/193250/norma.htm"
      },
      {
        id: "m3-15",
        type: "Resolución (SRT)",
        number: "85",
        year: "2012",
        topic: "Ruido",
        description: "Protocolo Obligatorio para Medición de Ruido en Ambientes Laborales.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/190000-194999/193251/norma.htm"
      },
      {
        id: "m3-16",
        type: "Resolución (SRT)",
        number: "299",
        year: "2011",
        topic: "Entrega de EPP",
        description: "Formulario Obligatorio de Registro de Entrega de EPP y Ropa de Trabajo.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/180498/norma.htm"
      },
      {
        id: "m3-17",
        type: "Resolución (SRT)",
        number: "550",
        year: "2011",
        topic: "Construcción",
        description: "Programas de Seguridad en Demoliciones y Excavaciones.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/181829/norma.htm"
      },
      {
        id: "m3-18",
        type: "Resolución (SRT)",
        number: "37",
        year: "2010",
        topic: "Exámenes Médicos",
        description: "Exámenes médicos de salud obligatorios en el sistema de riesgos.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/160000-164999/163171/norma.htm"
      },
      {
        id: "m3-19",
        type: "Resolución (SRT)",
        number: "463",
        year: "2009",
        topic: "RGRL / Afiliación",
        description: "Relevamiento General de Riesgos Laborales y contrato tipo de afiliación.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/150000-154999/153503/norma.htm"
      },
      {
        id: "m3-20",
        type: "Resolución (MTEySS)",
        number: "295",
        year: "2003",
        topic: "Ergonomía y Químicos",
        description: "Especificaciones técnicas de Ergonomía, Carga Térmica y Contaminantes.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/90000-94999/90396/norma.htm"
      },
      {
        id: "m3-21",
        type: "Resolución (SRT)",
        number: "51",
        year: "1997",
        topic: "Programas de Seguridad",
        description: "Aviso de Obra y Programas de Seguridad en Obras de Construcción.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/45000-49999/45084/norma.htm"
      }
    ]
  },
  {
    id: "modulo-4",
    title: "Módulo 4: Fiscalización, Inspección de Trabajo y Sanciones",
    entries: [
      {
        id: "m4-1",
        type: "Ley",
        number: "25.212",
        year: "2000",
        topic: "Pacto Federal Trabajo",
        description: "Anexo II: Régimen General de Sanciones por Infracciones Laborales y de SySO.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/61829/norma.htm"
      },
      {
        id: "m4-2",
        type: "Ley",
        number: "25.877",
        year: "2004",
        topic: "Inspección de Trabajo",
        description: "Título III: Sistema Integrado de Inspección del Trabajo y la Seguridad Social.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/90000-94999/93595/norma.htm"
      },
      {
        id: "m4-3",
        type: "Ley",
        number: "26.941",
        year: "2014",
        topic: "Multas / Sanciones",
        description: "Modifica montos y escalas de sanciones del Anexo II del Pacto Federal del Trabajo.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/230000-234999/230003/norma.htm"
      },
      {
        id: "m4-4",
        type: "Resolución (SRT)",
        number: "887",
        year: "2015",
        topic: "Acta Digital Única",
        description: "Crea el Acta Digital Única para la ejecución de inspecciones de higiene y seguridad.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/246273/norma.htm"
      },
      {
        id: "m4-5",
        type: "Resolución (SRT)",
        number: "38",
        year: "2018",
        topic: "Juzgamiento ART",
        description: "Procedimiento de comprobación y juzgamiento de infracciones cometidas por ART.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/310323/norma.htm"
      }
    ]
  },
  {
    id: "modulo-5",
    title: "Módulo 5: Insalubridad y Regímenes Previsionales Diferenciales",
    entries: [
      {
        id: "m5-1",
        type: "Ley",
        number: "11.544",
        year: "1929",
        topic: "Jornada Insalubre",
        description: "Regula la jornada reducida (6 hs diarias / 36 semanales) en tareas insalubres.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/63368/norma.htm"
      },
      {
        id: "m5-2",
        type: "Decreto",
        number: "4.257",
        year: "1968",
        topic: "Jubilaciones Diferenciales",
        description: "Régimen previsional diferencial por tareas penosas, riesgosas o insalubres.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/200000-204999/200158/norma.htm"
      },
      {
        id: "m5-3",
        type: "Resolución (MTEySS)",
        number: "434",
        year: "2002",
        topic: "Competencia Provincial",
        description: "Competencia exclusiva a Administraciones Laborales Provinciales sobre insalubridad.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/75000-79999/75432/norma.htm"
      },
      {
        id: "m5-4",
        type: "Resolución (MTEySS)",
        number: "212",
        year: "2003",
        topic: "Procedimiento Insalubridad",
        description: "Procedimiento administrativo tipo para calificar lugares o tareas como insalubres.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/80000-84999/84883/norma.htm"
      },
      {
        id: "m5-5",
        type: "Resolución (SSS)",
        number: "194",
        year: "2018",
        topic: "Tareas Diferenciales",
        description: "Crea la Comisión Técnica Permanente sobre Tareas Diferenciales en la Sec. de Seg. Social.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/311021/norma.htm"
      }
    ]
  },
  {
    id: "modulo-6",
    title: "Módulo 6: Normativa Específica de la Provincia de Mendoza",
    entries: [
      {
        id: "m6-1",
        type: "Ley Provincial",
        number: "4.974",
        year: "1984",
        topic: "Policía del Trabajo",
        description: "Creación y competencias de la Subsecretaría de Trabajo y Seguridad Social de Mendoza.",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-4974-123456789-0abc-defg-479-4000mvorpyel/actualizacion"
      },
      {
        id: "m6-2",
        type: "Ley Provincial",
        number: "9.017",
        year: "2017",
        topic: "Adhesión Ley 27.348",
        description: "Adhesión de Mendoza al procedimiento de Comisiones Médicas en la provincia.",
        link: "https://www.hcdmza.gob.ar/eweb/E-82000/E-82313/E-82313.pdf"
      },
      {
        id: "m6-3",
        type: "Resolución (SSTySS Mza)",
        number: "4675",
        year: "2002",
        topic: "Registro de Servicios SySO",
        description: "Procedimiento de habilitación y registro de Servicios de Higiene y Seguridad y Medicina Laboral.",
        link: "https://www.ecofield.net/Legales/Mendoza/res8724-11_MZA.htm"
      },
      {
        id: "m6-4",
        type: "Resolución (SSTySS Mza)",
        number: "8724",
        year: "2011",
        topic: "Libro de H&S; Mendoza",
        description: "Obligatoriedad y procedimiento de rúbrica/apertura del Libro de Higiene y Seguridad en el Trabajo.",
        link: "http://copigmza.org.ar/wp-content/uploads/2020/10/Resolucian_8724_2011.pdf"
      },
      {
        id: "m6-5",
        type: "Resolución (SSTyE Mza)",
        number: "5242",
        year: "2024",
        topic: "Trámites y Aranceles",
        description: "Actualización de carátula de presentación, tramitaciones e inspecciones laborales en Mendoza.",
        link: "https://boe.mendoza.gov.ar/publico/pdf_pedido/43681b950ecab83bd940b0ceb9871848b637d6e540"
      }
    ]
  },
  {
    id: "modulo-7",
    title: "Módulo 7: Normativa Municipal de Mendoza (Higiene, Seguridad e Incendios)",
    entries: [
      {
        id: "m7-1",
        type: "Ordenanza Municipal",
        number: "36/1970",
        year: "Luján de Cuyo",
        topic: "Código de Edificación de Luján de Cuyo: Exigencias de medios de escape, ventilación e instalaciones contra incendios.",
        description: "Código de Edificación de Luján de Cuyo: Exigencias de medios de escape, ventilación e instalaciones contra incendios.",
        link: "https://www.copigmza.org.ar/codigo-edificacion-lujan-de-cuyo/"
      },
      {
        id: "m7-2",
        type: "Ordenanza Municipal",
        number: "4862/2005",
        year: "Luján de Cuyo",
        topic: "Prevención y Protección contra Incendios",
        description: "Prevención y Protección contra Incendios: Certificación obligatoria de Bomberos y profesional de Higiene y Seguridad.",
        link: "https://www.bomberosra.org.ar/legislacion-snbv/Municipal/Mendoza/Mendoza%20%20-%20Lujan%20de%20Cuyo%20-%20Ordenanza%204862-2005.pdf"
      },
      {
        id: "m7-3",
        type: "Ordenanza Reglamentaria",
        number: "Vigente (2025/2026)",
        year: "Luján de Cuyo",
        topic: "Tasa de Seguridad e Higiene / Habilitación",
        description: "Tasa de Seguridad e Higiene / Habilitación: Requisitos del Plan de Evacuación/Contingencia comercial e industrial.",
        link: "https://boe.mendoza.gov.ar/publico/verpdf/787173ff9b92c051f1f7c7f76320b3d1dade446f61/anexo"
      },
      {
        id: "m7-4",
        type: "Ordenanza Municipal",
        number: "3263/1995",
        year: "Ciudad de Mendoza",
        topic: "Contaminación Sonora y Ruidos Molestos",
        description: "Contaminación Sonora y Ruidos Molestos: Niveles máximos de dBA e higiene acústica en comercios e industrias.",
        link: "https://ciudaddemendoza.gob.ar/tramites/denuncia-ruidos-molestos-e-higiene-y-seguridad/"
      },
      {
        id: "m7-5",
        type: "Ordenanza Municipal",
        number: "3702/2007 (y Ord. 4085)",
        year: "Ciudad de Mendoza",
        topic: "Habilitación Comercial e Industrial",
        description: "Habilitación Comercial e Industrial: Plano de Incendios, Memoria Descriptiva de Seguridad y Plan de Evacuación.",
        link: "https://ciudaddemendoza.gob.ar/tramites/habilitacion-de-comercios-industrias-servicios-y-actividades-civiles/"
      },
      {
        id: "m7-6",
        type: "Ordenanza Municipal",
        number: "6846/2018 (y Ord. 7508/2025)",
        year: "Godoy Cruz",
        topic: "Gestión Ambiental y Residuos Industriales",
        description: "Gestión Ambiental y Residuos Industriales: Presupuestos de protección en el manejo de residuos comerciales e industriales.",
        link: "https://www.ecofield.net/Legales/Ord/Godoy_Cruz_MZA/or6846-18_HCD_Godoy_Cruz_MZA.htm"
      },
      {
        id: "m7-7",
        type: "Ordenanza Municipal",
        number: "7446/2025",
        year: "Godoy Cruz",
        topic: "Inspección de Higiene y Seguridad",
        description: "Inspección de Higiene y Seguridad: Condiciones de seguridad, inspección periódica y tasa de habilitación comercial.",
        link: "https://boe.mendoza.gov.ar/default/public/publico/verpdf/32270"
      },
      {
        id: "m7-8",
        type: "Ordenanza Reglamentaria",
        number: "Vigente (2024/2025)",
        year: "Guaymallén",
        topic: "Higiene e Inspección Industrial",
        description: "Higiene e Inspección Industrial: Exigencias de seguridad edilicia, salubridad y auditorías laborales y ambientales.",
        link: "https://boe.mendoza.gov.ar/default/public/publico/verpdf/32409"
      }
    ]
  },
  {
    id: "modulo-8",
    title: "Módulo 8: Normativa Específica para la Industria de la Construcción",
    entries: [
      {
        id: "m8-1",
        type: "Decreto",
        number: "911",
        year: "1996",
        topic: "Reglamento H&S Construcción",
        description: "Reglamento de Higiene y Seguridad para la Industria de la Construcción.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/35000-39999/38568/texact.htm"
      },
      {
        id: "m8-2",
        type: "Resolución (SRT)",
        number: "231",
        year: "1996",
        topic: "Reglamentación Dec. 911/96",
        description: "Condiciones básicas de Higiene y Seguridad para inicio de obras.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/35000-39999/39097/norma.htm"
      },
      {
        id: "m8-3",
        type: "Resolución (SRT)",
        number: "51",
        year: "1997",
        topic: "Aviso de Obra y Programas",
        description: "Comunicación de inicio de obra y confección del Programa de Seguridad.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/45000-49999/45084/norma.htm"
      },
      {
        id: "m8-4",
        type: "Resolución (SRT)",
        number: "35",
        year: "1998",
        topic: "Coordinación de Programas",
        description: "Mecanismo para coordinación, verificación y medidas correctivas en Programas de Seguridad.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/50000-54999/50175/norma.htm"
      },
      {
        id: "m8-5",
        type: "Resolución (SRT)",
        number: "319",
        year: "1999",
        topic: "Obras repetitivas y simultáneas",
        description: "Coordinación en actividades simultáneas. Programas para obras repetitivas y corta duración.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/55000-59999/59846/norma.htm"
      },
      {
        id: "m8-6",
        type: "Decreto",
        number: "144",
        year: "2001",
        topic: "Ampliación Facultades SRT",
        description: "Amplía facultades de la SRT para dictar normas complementarias y de actualización tecnológica en construcción.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66008/norma.htm"
      },
      {
        id: "m8-7",
        type: "Resolución (SRT)",
        number: "1642",
        year: "2009",
        topic: "Comisión Alta Siniestralidad",
        description: "Créase la Comisión de Trabajo para Empresas con Establecimientos que Registren Alta Siniestralidad en Construcción.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/155000-159999/160682/norma.htm"
      },
      {
        id: "m8-8",
        type: "Resolución (SRT)",
        number: "550",
        year: "2011",
        topic: "Demolición y Excavación",
        description: "Mecanismo de intervención en etapas de demolición de edificaciones, excavación para subsuelos y submuraciones.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/181829/norma.htm"
      },
      {
        id: "m8-9",
        type: "Disposición (SRT)",
        number: "1",
        year: "2011",
        topic: "Avisos de Obra a SRT",
        description: "Disposición de la Gerencia de Prevención. Indicaciones a las ART para comunicar los Avisos de Obra a la SRT.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/183769/norma.htm"
      },
      {
        id: "m8-10",
        type: "Resolución (SRT)",
        number: "503",
        year: "2014",
        topic: "Excavaciones a cielo abierto",
        description: "Medidas de prevención para trabajos de movimiento de suelos y excavaciones a cielo abierto superiores a 1,20m.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/225000-229999/227918/norma.htm"
      },
      {
        id: "m8-11",
        type: "Resolución (SRT)",
        number: "42",
        year: "2018",
        topic: "Manipulación bolsas cemento",
        description: "Manipulación y desplazamiento de bolsas de cemento superiores a 25 Kg mediante asistencia de medios mecánicos.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/310405/norma.htm"
      },
      {
        id: "m8-12",
        type: "Resolución (SRT)",
        number: "61",
        year: "2023",
        topic: "Trabajos en Altura",
        description: "Aprueba medidas de seguridad para trabajos en altura.",
        link: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/390000-394999/394625/norma.htm"
      }
    ]
  }
];
