export const riskFactors: Record<string, string> = {
    "A": "Levantamiento y descenso manual de carga sin transporte",
    "B": "Empuje y arrastre manual de cargas",
    "C": "Transporte manual de cargas",
    "D": "Bipedestación",
    "E": "Movimientos repetitivos de miembros superiores",
    "F": "Posturas forzadas",
    "G": "Vibraciones",
    "H": "Confort térmico",
    "I": "Estrés de contacto"
};

export const factorQuestions: Record<string, { paso1: string[], paso2: string[] }> = {
    "A": {
        paso1: [
            "Levantar y/o bajar manualmente cargas de peso superior a 2 Kg. y hasta 25 Kg.",
            "Realizar diariamente y en forma cíclica operaciones de levantamiento / descenso con una frecuencia ≥ 1 por hora o ≤ 360 por hora.",
            "Levantar y/o bajar manualmente cargas de peso superior a 25 Kg."
        ],
        paso2: [
            "El trabajador levanta, sostiene y deposita la carga sobrepasando con sus manos 30 cm. sobre la altura del hombro.",
            "El trabajador levanta, sostiene y deposita la carga sobrepasando con sus manos una distancia horizontal mayor de 80 cm. desde el punto medio entre los tobillos.",
            "Entre la toma y el depósito de la carga, el trabajador gira o inclina la cintura más de 30º a uno u otro lado.",
            "Las cargas poseen formas irregulares, son difíciles de asir, se deforman o hay movimiento en su interior.",
            "El trabajador levanta, sostiene y deposita la carga con un solo brazo.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "B": {
        paso1: [
            "Se realizan diariamente tareas cíclicas, con una frecuencia ≥ 1 movimiento por jornada.",
            "El trabajador se desplaza empujando y/o arrastrando manualmente un objeto recorriendo una distancia mayor a los 60 metros.",
            "En el puesto de trabajo se empujan o arrastran cíclicamente objetos cuyo esfuerzo supera los 34 kgf."
        ],
        paso2: [
            "Para empujar el objeto rodante se requiere un esfuerzo inicial medido con dinamómetro ≥ 12 Kgf para hombres o 10 Kgf para mujeres.",
            "Para arrastrar el objeto rodante se requiere un esfuerzo inicial medido con dinamómetro ≥ 10 Kgf para hombres o mujeres.",
            "El objeto rodante es empujado y/o arrastrado con dificultad (la superficie es despareja, hay rampas, etc).",
            "El objeto rodante no puede ser empujado y/o arrastrado con ambas manos, o el apoyo de las manos se encuentra a una altura incómoda.",
            "En el movimiento de empujar y/o arrastrar, el esfuerzo inicial requerido se mantiene significativamente.",
            "El trabajador empuja o arrastra el objeto rodante asiéndolo con una sola mano.",
            "El trabajador presenta alguna manifestación temprana de enfermedades."
        ]
    },
    "C": {
        paso1: [
            "Transportar manualmente cargas de peso superior a 2 Kg y hasta 25 Kg.",
            "El trabajador se desplaza sosteniendo manualmente la carga recorriendo una distancia mayor a 1 metro.",
            "Realizarla diariamente en forma cíclica.",
            "Se transporta manualmente cargas a una distancia superior a 20 metros.",
            "Se transporta manualmente cargas de peso superior a 25 Kg."
        ],
        paso2: [
            "En condiciones habituales de levantamiento el trabajador transporta la carga entre 1 y 10 metros con una masa acumulada mayor que 10.000 Kg.",
            "En condiciones habituales de levantamiento el trabajador transporta la carga entre 10 y 20 metros con una masa acumulada mayor que 6.000 Kg.",
            "Las cargas poseen formas irregulares, son difíciles de asir, se deforman.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "D": {
        paso1: [
            "El puesto de trabajo se desarrolla en posición de pie, sin posibilidad de sentarse, durante 2 horas seguidas o más."
        ],
        paso2: [
            "En el puesto se realizan tareas donde se permanece de pie durante 3 horas seguidas o más, sin posibilidades de sentarse con escasa deambulación.",
            "En el puesto se realizan tareas donde se permanece de pie durante 2 horas seguidas o más, sin posibilidades de sentarse ni desplazarse o con escasa deambulación, levantando y/o transportando cargas > 2 Kg.",
            "Trabajos efectuados con bipedestación prolongada en ambientes donde la temperatura y la humedad del aire sobrepasan los límites legalmente admisibles.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "E": {
        paso1: [
            "Realizar diariamente, una o más tareas donde se utilizan las extremedidas superiores, durante 4 o más horas en la jornada habitual de trabajo en forma cíclica."
        ],
        paso2: [
            "Las extremidades superiores están activas por más del 40% del tiempo total del ciclo de trabajo.",
            "En el ciclo de trabajo se realiza un esfuerzo superior a moderado a 3 según la Escala de Borg, durante más de 6 segundos y más de una vez por minuto.",
            "Se realiza un esfuerzo superior a 7 según la escala de Borg.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "F": {
        paso1: [
            "Adoptar posturas forzadas en forma habitual durante la jornada de trabajo, con o sin aplicación de fuerza."
        ],
        paso2: [
            "Cuello en extensión, flexión, lateralización y/o rotación.",
            "Brazos por encima de los hombros o con movimientos de supinación, pronación o rotación.",
            "Muñecas y manos en flexión, extensión, desviación cubital o radial.",
            "Cintura en flexión, extensión, lateralización y/o rotación.",
            "Miembros inferiores: trabajo en posición de rodillas o en cuclillas.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "G": {
        paso1: [
            "Trabajar con herramientas que producen vibraciones (martillo neumático, pulidoras, esmeriladoras, otros).",
            "Sujetar piezas con las manos mientras estas son mecanizadas.",
            "Conducir vehículos industriales, camiones, máquinas agrícolas, transporte público y otros."
        ],
        paso2: [
            "El valor de las vibraciones supera los límites establecidos correspondientes al Anexo V, Resolución MTEySS N° 295/03.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    },
    "H": {
        paso1: [
            "En el puesto de trabajo se perciben temperaturas no confortables para la realización de las tareas."
        ],
        paso2: [
            "EL resultado del uso de la Curva de Confort de Fanger, se encuentra por fuera de la zona de confort."
        ]
    },
    "I": {
        paso1: [
            "Mantener apoyada alguna parte del cuerpo ejerciendo una presión, contra una herramienta, plano de trabajo, máquina o material."
        ],
        paso2: [
            "El trabajador mantiene apoyada la muñeca, antebrazo, axila o muslo u otro segmento corporal sobre una superficie aguda o con canto.",
            "El trabajador utiliza herramientas de mano o manipula piezas que presionan sobre sus dedos y/o palma de la mano hábil.",
            "El trabajador realiza movimientos de percusión sobre partes o herramientas.",
            "El trabajador presenta alguna manifestación temprana de las enfermedades."
        ]
    }
};
