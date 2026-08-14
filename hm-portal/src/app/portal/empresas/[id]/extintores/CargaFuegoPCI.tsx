"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Plus, Trash2, Building2 } from "lucide-react";

type Subsector = {
    id: string;
    nombre: string;
    uso: string;
    areaBruta: number;
    circulaciones: number;
    usoComun: number;
};

type MaterialCarga = {
    id: string;
    nombre: string;
    pqUnitario: number | "";
    cantidadKg: number | "";
};

type Sector = {
    id: string;
    establecimientoId?: string;
    name: string;
    uso?: string;
    tipoMateriales?: string;
    tipoActividad?: string;
    subsectors: Subsector[];
    materialesCargaFuego?: MaterialCarga[];
};

// Extraídos de "Poderes Caloríficos para el cálculo de la Carga de Fuego" (Mcal/kg * 1000 = Kcal/kg)
const MATERIALES_DB = [
    {
        "nombre": "Aceite de algodón",
        "kcal": 8885
    },
    {
        "nombre": "Aceite de alquitrán",
        "kcal": 10987
    },
    {
        "nombre": "Aceite de colza",
        "kcal": 10008
    },
    {
        "nombre": "Aceite de creosota",
        "kcal": 8885
    },
    {
        "nombre": "Aceite de hígado",
        "kcal": 8957
    },
    {
        "nombre": "Aceite de lino",
        "kcal": 8885
    },
    {
        "nombre": "Aceite de nabo sivestre",
        "kcal": 10008
    },
    {
        "nombre": "Aceite de oliva",
        "kcal": 10032
    },
    {
        "nombre": "Aceite de parafina",
        "kcal": 10032
    },
    {
        "nombre": "Aceite de parafina",
        "kcal": 10008
    },
    {
        "nombre": "Aceite de pino",
        "kcal": 10008
    },
    {
        "nombre": "Aceite de ricino",
        "kcal": 10008
    },
    {
        "nombre": "Aceite de semillas de algodón",
        "kcal": 8957
    },
    {
        "nombre": "Aceite de soja",
        "kcal": 10008
    },
    {
        "nombre": "Aceite diesel",
        "kcal": 10987
    },
    {
        "nombre": "Aceite mineral",
        "kcal": 10032
    },
    {
        "nombre": "Aceite pesado de petróleo",
        "kcal": 10199
    },
    {
        "nombre": "Acenilacetona",
        "kcal": 5995
    },
    {
        "nombre": "Acetaldehído",
        "kcal": 5995
    },
    {
        "nombre": "Acetamida",
        "kcal": 5016
    },
    {
        "nombre": "Acetanilida",
        "kcal": 8001
    },
    {
        "nombre": "Acetato de amilo",
        "kcal": 8001
    },
    {
        "nombre": "Acetato de metilo",
        "kcal": 6091
    },
    {
        "nombre": "Acetato de polivinilo",
        "kcal": 5016
    },
    {
        "nombre": "Acetileno",
        "kcal": 11990
    },
    {
        "nombre": "Acetileno disuelto",
        "kcal": 3989
    },
    {
        "nombre": "Acetofenona",
        "kcal": 8001
    },
    {
        "nombre": "Acetona",
        "kcal": 6998
    },
    {
        "nombre": "Acetonitrilo",
        "kcal": 6998
    },
    {
        "nombre": "Acido acético",
        "kcal": 3989
    },
    {
        "nombre": "Acido acrílico",
        "kcal": 4299
    },
    {
        "nombre": "Acido acroleico",
        "kcal": 4013
    },
    {
        "nombre": "Acido adípico",
        "kcal": 5326
    },
    {
        "nombre": "Acido benzoico",
        "kcal": 5995
    },
    {
        "nombre": "Acido butírico, n-",
        "kcal": 5995
    },
    {
        "nombre": "Acido caprónico",
        "kcal": 6998
    },
    {
        "nombre": "Acido cianocético",
        "kcal": 4013
    },
    {
        "nombre": "Acido cítrico",
        "kcal": 5995
    },
    {
        "nombre": "Acido de canela",
        "kcal": 6998
    },
    {
        "nombre": "Acido dietilaético",
        "kcal": 6998
    },
    {
        "nombre": "Acido etilbutírico",
        "kcal": 6998
    },
    {
        "nombre": "Acido fórmico",
        "kcal": 1409
    },
    {
        "nombre": "Acido oleico",
        "kcal": 8837
    },
    {
        "nombre": "Acido oxálico, n-",
        "kcal": 6998
    },
    {
        "nombre": "Acido tartárico",
        "kcal": 1600
    },
    {
        "nombre": "Acroleína",
        "kcal": 6998
    },
    {
        "nombre": "Aguarrás",
        "kcal": 10032
    },
    {
        "nombre": "Alanina",
        "kcal": 4013
    },
    {
        "nombre": "Albúmina vegetal",
        "kcal": 5995
    },
    {
        "nombre": "Alcanfor",
        "kcal": 8885
    },
    {
        "nombre": "Alcohol alílico",
        "kcal": 8001
    },
    {
        "nombre": "Alcohol amílico",
        "kcal": 10032
    },
    {
        "nombre": "Alcohol butílico",
        "kcal": 8001
    },
    {
        "nombre": "Alcohol cetílico",
        "kcal": 10032
    },
    {
        "nombre": "Alcohol de benzilo",
        "kcal": 8001
    },
    {
        "nombre": "Alcohol etílico",
        "kcal": 5995
    },
    {
        "nombre": "Alcohol hexadehílico",
        "kcal": 10008
    },
    {
        "nombre": "Alcohol isopropílico",
        "kcal": 7213
    },
    {
        "nombre": "Alcohol metílico",
        "kcal": 5016
    },
    {
        "nombre": "Alcohol n-butílico",
        "kcal": 8025
    },
    {
        "nombre": "Alcohol propílico",
        "kcal": 7333
    },
    {
        "nombre": "Aldehido de canela",
        "kcal": 8001
    },
    {
        "nombre": "Aldehido fórmico",
        "kcal": 7118
    },
    {
        "nombre": "Aldehido propílico",
        "kcal": 6927
    },
    {
        "nombre": "Aldol",
        "kcal": 5995
    },
    {
        "nombre": "Algodón",
        "kcal": 4013
    },
    {
        "nombre": "Almendra",
        "kcal": 4013
    },
    {
        "nombre": "Almidón",
        "kcal": 3989
    },
    {
        "nombre": "Alquitrán de hulla",
        "kcal": 8885
    },
    {
        "nombre": "Anhídrido acético",
        "kcal": 3989
    },
    {
        "nombre": "Anhídrido de ácido acético",
        "kcal": 4013
    },
    {
        "nombre": "Anhídrido de ácido benzoico",
        "kcal": 6998
    },
    {
        "nombre": "Anhídrido ftálico",
        "kcal": 5111
    },
    {
        "nombre": "Anhídrido propiónico",
        "kcal": 5326
    },
    {
        "nombre": "Anilina",
        "kcal": 8885
    },
    {
        "nombre": "Anisol",
        "kcal": 8001
    },
    {
        "nombre": "Antraceno",
        "kcal": 10032
    },
    {
        "nombre": "Antracita",
        "kcal": 8001
    },
    {
        "nombre": "Antraquinona",
        "kcal": 6998
    },
    {
        "nombre": "Arabinosa",
        "kcal": 4013
    },
    {
        "nombre": "Asfalto",
        "kcal": 9649
    },
    {
        "nombre": "Avellanas",
        "kcal": 4013
    },
    {
        "nombre": "Azobenzol",
        "kcal": 8001
    },
    {
        "nombre": "Azoxibenzol",
        "kcal": 8001
    },
    {
        "nombre": "Azúcar",
        "kcal": 3989
    },
    {
        "nombre": "Azufre",
        "kcal": 2006
    },
    {
        "nombre": "Bambú, caña de",
        "kcal": 4013
    },
    {
        "nombre": "Benceno",
        "kcal": 10008
    },
    {
        "nombre": "Bencilo",
        "kcal": 8001
    },
    {
        "nombre": "Bencina",
        "kcal": 10032
    },
    {
        "nombre": "Benzacetona",
        "kcal": 8001
    },
    {
        "nombre": "Benzaldehído",
        "kcal": 8001
    },
    {
        "nombre": "Benzidina",
        "kcal": 8001
    },
    {
        "nombre": "Benzil",
        "kcal": 8001
    },
    {
        "nombre": "Benzilamina",
        "kcal": 8957
    },
    {
        "nombre": "Benzofena",
        "kcal": 8073
    },
    {
        "nombre": "Benzofenona",
        "kcal": 8001
    },
    {
        "nombre": "Benzoina",
        "kcal": 8001
    },
    {
        "nombre": "Benzol",
        "kcal": 10032
    },
    {
        "nombre": "Bromuro de etilo",
        "kcal": 2914
    },
    {
        "nombre": "Bromuro de metilo",
        "kcal": 1815
    },
    {
        "nombre": "Butano",
        "kcal": 10987
    },
    {
        "nombre": "Butanol",
        "kcal": 8001
    },
    {
        "nombre": "Butanol (alcohol butílico)",
        "kcal": 8001
    },
    {
        "nombre": "Cacao en polvo",
        "kcal": 3989
    },
    {
        "nombre": "Café",
        "kcal": 3989
    },
    {
        "nombre": "Cafeína",
        "kcal": 5016
    },
    {
        "nombre": "Calcio",
        "kcal": 1003
    },
    {
        "nombre": "Carbón",
        "kcal": 7500
    },
    {
        "nombre": "Carbón coke de hulla",
        "kcal": 6998
    },
    {
        "nombre": "Carbón hulla",
        "kcal": 8001
    },
    {
        "nombre": "Carbón lignita",
        "kcal": 4992
    },
    {
        "nombre": "Carbón mineral",
        "kcal": 5995
    },
    {
        "nombre": "Carbono",
        "kcal": 8001
    },
    {
        "nombre": "Carburo de alúmina",
        "kcal": 4013
    },
    {
        "nombre": "Carburo de aluminio",
        "kcal": 4013
    },
    {
        "nombre": "Carne seca (charqui)",
        "kcal": 5995
    },
    {
        "nombre": "Cartón",
        "kcal": 3989
    },
    {
        "nombre": "Cartón asfáltico",
        "kcal": 5016
    },
    {
        "nombre": "Cartones bituminosos",
        "kcal": 5995
    },
    {
        "nombre": "Caucho",
        "kcal": 10032
    },
    {
        "nombre": "Celuloide",
        "kcal": 3989
    },
    {
        "nombre": "Celulosa",
        "kcal": 3989
    },
    {
        "nombre": "Cera de parafina",
        "kcal": 10008
    },
    {
        "nombre": "Cera mineral",
        "kcal": 10008
    },
    {
        "nombre": "Ceras",
        "kcal": 9458
    },
    {
        "nombre": "Cereales",
        "kcal": 3989
    },
    {
        "nombre": "Cetanol",
        "kcal": 10008
    },
    {
        "nombre": "Chocolate",
        "kcal": 5995
    },
    {
        "nombre": "Cicloheptano",
        "kcal": 10987
    },
    {
        "nombre": "Ciclohexano",
        "kcal": 10987
    },
    {
        "nombre": "Ciclohexanol",
        "kcal": 8001
    },
    {
        "nombre": "Ciclopentano",
        "kcal": 10987
    },
    {
        "nombre": "Ciclopropano",
        "kcal": 11990
    },
    {
        "nombre": "Cloroformo",
        "kcal": 740
    },
    {
        "nombre": "Cloropeno",
        "kcal": 10533
    },
    {
        "nombre": "Cloruro de bencilo",
        "kcal": 5422
    },
    {
        "nombre": "Cloruro de etilo",
        "kcal": 4514
    },
    {
        "nombre": "Cloruro de metilo",
        "kcal": 3201
    },
    {
        "nombre": "Cloruro de n-propilo",
        "kcal": 5708
    },
    {
        "nombre": "Cloruro de polivinilo",
        "kcal": 5016
    },
    {
        "nombre": "Coke",
        "kcal": 8001
    },
    {
        "nombre": "Cola celulósica",
        "kcal": 8885
    },
    {
        "nombre": "Cola, engrudo",
        "kcal": 8957
    },
    {
        "nombre": "Colodión",
        "kcal": 4013
    },
    {
        "nombre": "Coque de hulla",
        "kcal": 6998
    },
    {
        "nombre": "Corcho",
        "kcal": 4013
    },
    {
        "nombre": "Corteza de roble",
        "kcal": 4013
    },
    {
        "nombre": "Cresol",
        "kcal": 8001
    },
    {
        "nombre": "Crotonaldehido",
        "kcal": 8001
    },
    {
        "nombre": "Cuero",
        "kcal": 5016
    },
    {
        "nombre": "Desechos de turba",
        "kcal": 4013
    },
    {
        "nombre": "Diamitoléter",
        "kcal": 10008
    },
    {
        "nombre": "Dicianuro",
        "kcal": 4992
    },
    {
        "nombre": "Diclorobenzol",
        "kcal": 4013
    },
    {
        "nombre": "Dietilamina",
        "kcal": 10032
    },
    {
        "nombre": "Dietilcarbonato",
        "kcal": 4992
    },
    {
        "nombre": "Dietilcetona",
        "kcal": 8001
    },
    {
        "nombre": "Dietilester de ácido carbónico",
        "kcal": 4992
    },
    {
        "nombre": "Dietilester de ácido malónico",
        "kcal": 4992
    },
    {
        "nombre": "Dietileter",
        "kcal": 8885
    },
    {
        "nombre": "Dietileter de ácido oxálico",
        "kcal": 4992
    },
    {
        "nombre": "Dietilmalonato",
        "kcal": 4992
    },
    {
        "nombre": "Difenil",
        "kcal": 10032
    },
    {
        "nombre": "Difenilamina",
        "kcal": 9028
    },
    {
        "nombre": "Difeniletano",
        "kcal": 10008
    },
    {
        "nombre": "Difenilo",
        "kcal": 9530
    },
    {
        "nombre": "Dimetil glicol",
        "kcal": 4013
    },
    {
        "nombre": "Dimetilamina",
        "kcal": 4419
    },
    {
        "nombre": "Dinamita (75 %)",
        "kcal": 1003
    },
    {
        "nombre": "Dinitro benceno",
        "kcal": 4013
    },
    {
        "nombre": "Dipentano",
        "kcal": 10987
    },
    {
        "nombre": "Dipenteno",
        "kcal": 10987
    },
    {
        "nombre": "Ebonita",
        "kcal": 8001
    },
    {
        "nombre": "Estearina",
        "kcal": 10008
    },
    {
        "nombre": "Estireno",
        "kcal": 10008
    },
    {
        "nombre": "Etano",
        "kcal": 11990
    },
    {
        "nombre": "Eter amílico",
        "kcal": 10032
    },
    {
        "nombre": "Eter de petróleo",
        "kcal": 10008
    },
    {
        "nombre": "Eter etilénico",
        "kcal": 8001
    },
    {
        "nombre": "Eter etílico",
        "kcal": 8001
    },
    {
        "nombre": "Eter metílico",
        "kcal": 7165
    },
    {
        "nombre": "Etil amina",
        "kcal": 8216
    },
    {
        "nombre": "Etil benceno",
        "kcal": 9840
    },
    {
        "nombre": "Etilenglicol",
        "kcal": 4013
    },
    {
        "nombre": "Etileno",
        "kcal": 11990
    },
    {
        "nombre": "Extracto de malta",
        "kcal": 3009
    },
    {
        "nombre": "Fenilhidracina",
        "kcal": 7476
    },
    {
        "nombre": "Fenol",
        "kcal": 8001
    },
    {
        "nombre": "Fenol, resina de",
        "kcal": 5995
    },
    {
        "nombre": "Fenolacroleína",
        "kcal": 8001
    },
    {
        "nombre": "Fibra de coco",
        "kcal": 5995
    },
    {
        "nombre": "Fibras de rafia, heno",
        "kcal": 4013
    },
    {
        "nombre": "Fibras naturales (madejas, ovillos, fardos)",
        "kcal": 4013
    },
    {
        "nombre": "Fósforo",
        "kcal": 5995
    },
    {
        "nombre": "Furano",
        "kcal": 5995
    },
    {
        "nombre": "Furfural",
        "kcal": 5613
    },
    {
        "nombre": "Gasóleo",
        "kcal": 10032
    },
    {
        "nombre": "Gasolina",
        "kcal": 11297
    },
    {
        "nombre": "Glicerina",
        "kcal": 3989
    },
    {
        "nombre": "Goma dura (ebonita)",
        "kcal": 8025
    },
    {
        "nombre": "Grafito",
        "kcal": 7524
    },
    {
        "nombre": "Granos o gajos de uva",
        "kcal": 4013
    },
    {
        "nombre": "Grasas",
        "kcal": 10032
    },
    {
        "nombre": "Gutapercha",
        "kcal": 10987
    },
    {
        "nombre": "Harina",
        "kcal": 4013
    },
    {
        "nombre": "Harina de trigo",
        "kcal": 3989
    },
    {
        "nombre": "Hemetileno",
        "kcal": 10987
    },
    {
        "nombre": "Heno comprimido",
        "kcal": 4013
    },
    {
        "nombre": "Heno libre",
        "kcal": 4013
    },
    {
        "nombre": "Heptano",
        "kcal": 10987
    },
    {
        "nombre": "Hexametileno",
        "kcal": 10987
    },
    {
        "nombre": "Hexano",
        "kcal": 10987
    },
    {
        "nombre": "Hidrógeno",
        "kcal": 33916
    },
    {
        "nombre": "Hidroquinona",
        "kcal": 5923
    },
    {
        "nombre": "Hidróxido de magnesic",
        "kcal": 4013
    },
    {
        "nombre": "Hidróxido de sodio",
        "kcal": 2006
    },
    {
        "nombre": "Hidruro de aluminio",
        "kcal": 4992
    },
    {
        "nombre": "Hidruro de magnesio",
        "kcal": 3989
    },
    {
        "nombre": "Hidruro de sodio",
        "kcal": 2006
    },
    {
        "nombre": "Isobutano",
        "kcal": 10939
    },
    {
        "nombre": "Isopentano",
        "kcal": 10844
    },
    {
        "nombre": "Lana",
        "kcal": 5016
    },
    {
        "nombre": "Lana de madera",
        "kcal": 4013
    },
    {
        "nombre": "Leche en polvo",
        "kcal": 3989
    },
    {
        "nombre": "Libros y carpetas",
        "kcal": 4013
    },
    {
        "nombre": "Lignito",
        "kcal": 5804
    },
    {
        "nombre": "Lino",
        "kcal": 3989
    },
    {
        "nombre": "Linóleo",
        "kcal": 4992
    },
    { "nombre": "Madera", "kcal": 4400 },
    {
        "nombre": "Madera de haya (helecho)",
        "kcal": 4992
    },
    {
        "nombre": "Magnesio",
        "kcal": 5995
    },
    {
        "nombre": "Maicena",
        "kcal": 4013
    },
    {
        "nombre": "Malta",
        "kcal": 3989
    },
    {
        "nombre": "Mantequilla",
        "kcal": 8885
    },
    {
        "nombre": "Metacrilato de metilo",
        "kcal": 6091
    },
    {
        "nombre": "Metano",
        "kcal": 11990
    },
    {
        "nombre": "Metanol",
        "kcal": 4992
    },
    {
        "nombre": "Metanol (alcohol metílico)",
        "kcal": 4992
    },
    {
        "nombre": "Metil butil cetona",
        "kcal": 8336
    },
    {
        "nombre": "Metil etil cetona",
        "kcal": 7524
    },
    {
        "nombre": "Metil propil cetona",
        "kcal": 7930
    },
    {
        "nombre": "Metilamina",
        "kcal": 9625
    },
    {
        "nombre": "Monóxido de carbono",
        "kcal": 2006
    },
    {
        "nombre": "Naftaleno",
        "kcal": 9339
    },
    {
        "nombre": "Naftalina en cristales",
        "kcal": 9602
    },
    {
        "nombre": "Nitrito de acetona",
        "kcal": 6998
    },
    {
        "nombre": "Nitrobenceno",
        "kcal": 5828
    },
    {
        "nombre": "Nitrocelulosa",
        "kcal": 2006
    },
    {
        "nombre": "Nitroetano",
        "kcal": 3917
    },
    {
        "nombre": "Nitrometano",
        "kcal": 2508
    },
    {
        "nombre": "Nueces, avellanas",
        "kcal": 4013
    },
    {
        "nombre": "Nuez de coco (sacos)",
        "kcal": 4992
    },
    {
        "nombre": "Octano",
        "kcal": 10987
    },
    {
        "nombre": "Oxido de carbono",
        "kcal": 2197
    },
    {
        "nombre": "Oxido de etileno",
        "kcal": 6425
    },
    {
        "nombre": "Paja de madera",
        "kcal": 4013
    },
    {
        "nombre": "Paja natural",
        "kcal": 3344
    },
    {
        "nombre": "Papel",
        "kcal": 3989
    },
    {
        "nombre": "Parafina",
        "kcal": 10987
    },
    {
        "nombre": "Pentano",
        "kcal": 11990
    },
    {
        "nombre": "Pescado seco",
        "kcal": 3009
    },
    {
        "nombre": "Petróleo",
        "kcal": 10032
    },
    {
        "nombre": "Piperidina",
        "kcal": 9028
    },
    {
        "nombre": "Placa de aglomerado de madera",
        "kcal": 4013
    },
    {
        "nombre": "Poliamida",
        "kcal": 6998
    },
    {
        "nombre": "Policarbonato",
        "kcal": 6998
    },
    {
        "nombre": "Poliéster",
        "kcal": 5995
    },
    {
        "nombre": "Poliestireno",
        "kcal": 10032
    },
    {
        "nombre": "Poliestireno (estirol) en espuma",
        "kcal": 10008
    },
    {
        "nombre": "Polietileno",
        "kcal": 10032
    },
    {
        "nombre": "Poliisobutileno",
        "kcal": 10987
    },
    {
        "nombre": "Poliisopreno (goma natural sin vulcanizar)",
        "kcal": 10796
    },
    {
        "nombre": "Polipropileno",
        "kcal": 10987
    },
    {
        "nombre": "Politetrafluoretileno",
        "kcal": 1003
    },
    {
        "nombre": "Poliuretano",
        "kcal": 5995
    },
    {
        "nombre": "Polivinilo acetato",
        "kcal": 4992
    },
    {
        "nombre": "Polyamida",
        "kcal": 6998
    },
    {
        "nombre": "Propano",
        "kcal": 10987
    },
    {
        "nombre": "Propileno",
        "kcal": 10939
    },
    {
        "nombre": "Rayón",
        "kcal": 3989
    },
    {
        "nombre": "Resina de cresol",
        "kcal": 5995
    },
    {
        "nombre": "Resina de fenol",
        "kcal": 5995
    },
    {
        "nombre": "Resina de pino",
        "kcal": 10032
    },
    {
        "nombre": "Resina de urea",
        "kcal": 5016
    },
    {
        "nombre": "Resina sintética",
        "kcal": 10008
    },
    {
        "nombre": "Ron 75%",
        "kcal": 4992
    },
    {
        "nombre": "Seda",
        "kcal": 5016
    },
    {
        "nombre": "Seda de acetato",
        "kcal": 4013
    },
    {
        "nombre": "Sisal",
        "kcal": 3989
    },
    {
        "nombre": "Sodio",
        "kcal": 1003
    },
    {
        "nombre": "Sulfito de carbonilo",
        "kcal": 2006
    },
    {
        "nombre": "Sulfuro de carbono",
        "kcal": 2986
    },
    {
        "nombre": "Tabaco",
        "kcal": 3989
    },
    {
        "nombre": "Té",
        "kcal": 3989
    },
    {
        "nombre": "Tejido de algodón",
        "kcal": 3989
    },
    {
        "nombre": "Tetrahidrobenzol",
        "kcal": 10987
    },
    {
        "nombre": "Tetralina",
        "kcal": 10987
    },
    {
        "nombre": "Tolueno",
        "kcal": 10103
    },
    {
        "nombre": "Toluol",
        "kcal": 10032
    },
    {
        "nombre": "Triacetato",
        "kcal": 3989
    },
    {
        "nombre": "Tributilamina",
        "kcal": 9625
    },
    {
        "nombre": "Trietilamina",
        "kcal": 9530
    },
    {
        "nombre": "Trimetil amina",
        "kcal": 9028
    },
    {
        "nombre": "Turba",
        "kcal": 8001
    },
    {
        "nombre": "Urea",
        "kcal": 2006
    },
    {
        "nombre": "Viscosa",
        "kcal": 3989
    },
    {
        "nombre": "Xilol",
        "kcal": 10008
    }
].sort((a, b) => a.nombre.localeCompare(b.nombre));

export default function CargaFuegoPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Parse establecimientos from pciGeneralities
    const rawGen = company.pciGeneralities ? (typeof company.pciGeneralities === 'string' ? JSON.parse(company.pciGeneralities) : company.pciGeneralities) : null;
    let establecimientos: any[] = [];
    if (rawGen) {
        if (Array.isArray(rawGen)) {
            establecimientos = rawGen;
        } else {
            establecimientos = [{ id: "default", nombre: "Establecimiento Principal" }];
        }
    }

    const [selectedEstId, setSelectedEstId] = useState<string>(establecimientos[0]?.id || "");

    // Initialize sectors from DB
    const initialSectors: Sector[] = company.pciSectors 
        ? (typeof company.pciSectors === 'string' ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<Sector[]>(initialSectors);

    // Filter sectors by the selected establecimiento
    const filteredSectors = sectors.filter(s => {
        if (s.establecimientoId) return s.establecimientoId === selectedEstId;
        // Legacy sector without ID
        return establecimientos.length > 0 && selectedEstId === establecimientos[0].id;
    });

    const handleSave = () => {
        setSaveStatus("idle");
        startTransition(async () => {
            const result = await updateCompanyPciSectors(company.id, sectors);
            if (result.success) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        });
    };

    const addMaterial = (sectorId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                const newMaterial: MaterialCarga = {
                    id: crypto.randomUUID(),
                    nombre: "",
                    pqUnitario: "",
                    cantidadKg: ""
                };
                return { ...s, materialesCargaFuego: [...(s.materialesCargaFuego || []), newMaterial] };
            }
            return s;
        }));
    };

    const deleteMaterial = (sectorId: string, materialId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return { ...s, materialesCargaFuego: (s.materialesCargaFuego || []).filter(m => m.id !== materialId) };
            }
            return s;
        }));
    };

    const updateMaterial = (sectorId: string, materialId: string, field: keyof MaterialCarga, value: string | number) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return {
                    ...s,
                    materialesCargaFuego: (s.materialesCargaFuego || []).map(m => {
                        if (m.id === materialId) {
                            const updated = { ...m, [field]: value };
                            // Si el usuario cambia el nombre desde el datalist, podemos auto-completar el Kcal
                            if (field === "nombre") {
                                const found = MATERIALES_DB.find(db => db.nombre === value);
                                if (found) {
                                    updated.pqUnitario = found.kcal;
                                }
                            }
                            return updated;
                        }
                        return m;
                    })
                };
            }
            return s;
        }));
    };

    const getSectorTotalSuperficie = (sector: Sector) => {
        return sector.subsectors.reduce((acc, sub) => {
            const bruta = Number(sub.areaBruta) || 0;
            return acc + bruta;
        }, 0);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Carga de Fuego por Sector</h2>
                    <p className="text-sm text-slate-500">Cálculo de QF (Kg madera / m²) según poder calorífico.</p>
                </div>
                <div className="flex items-center gap-4">
                    {saveStatus === "success" && (
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Guardado exitosamente
                        </span>
                    )}
                    {saveStatus === "error" && (
                        <span className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle className="w-4 h-4" /> Error al guardar
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                    </button>
                </div>
            </div>

            {/* Datalist for autocomplete */}
            <datalist id="materiales-db">
                {MATERIALES_DB.map((mat, i) => (
                    <option key={i} value={mat.nombre} />
                ))}
            </datalist>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <Building2 className="w-5 h-5 text-slate-400" />
                <select 
                    value={selectedEstId}
                    onChange={(e) => setSelectedEstId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    {establecimientos.length === 0 && <option value="" disabled>No hay establecimientos (Ve a Generalidades)</option>}
                    {establecimientos.map(est => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                </select>
            </div>

            {!selectedEstId ? (
                <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-bold text-lg mb-2">Selecciona un Establecimiento</h3>
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para gestionar la carga de fuego de sus sectores.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores configurados en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Debes crear los sectores de incendio en la pestaña "Sectores de Incendio" antes de poder calcular su carga de fuego.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredSectors.map(sector => {
                        const totalSuperficie = getSectorTotalSuperficie(sector);
                        const materiales = sector.materialesCargaFuego || [];
                        
                        let totalAcumuladoKcal = 0;
                        materiales.forEach(m => {
                            const pq = Number(m.pqUnitario) || 0;
                            const kg = Number(m.cantidadKg) || 0;
                            totalAcumuladoKcal += (pq * kg);
                        });

                        const pm = totalAcumuladoKcal / 4400; // Peso en Kg madera
                        const qf = totalSuperficie > 0 ? pm / totalSuperficie : 0; // Kg madera / m2

                        return (
                            <div key={sector.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{sector.name || "Sector Sin Nombre"}</h3>
                                        <p className="text-sm text-slate-300">{sector.uso || "Sin Uso Definido"}</p>
                                    </div>
                                    <button 
                                        onClick={() => addMaterial(sector.id)}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Agregar Material
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto w-full custom-scrollbar pb-2 p-6">
                                    <table className="w-full text-left min-w-[800px] border-collapse mb-6">
                                        <thead>
                                            <tr className="bg-[#4caf50] text-white">
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40]">MATERIALES</th>
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40] text-right">PQ UNITARIO (Kcal/Kg)</th>
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40] text-right">Material Existente (Kg)</th>
                                                <th className="p-3 text-sm font-bold text-right">PQ Acumulado (Kcal)</th>
                                                <th className="w-12 border-l border-[#3d8c40]"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materiales.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-slate-400 italic bg-slate-50">
                                                        No hay materiales cargados en este sector.
                                                    </td>
                                                </tr>
                                            ) : materiales.map((mat) => {
                                                const pq = Number(mat.pqUnitario) || 0;
                                                const kg = Number(mat.cantidadKg) || 0;
                                                const acumulado = pq * kg;

                                                return (
                                                    <tr key={mat.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="text" 
                                                                list="materiales-db"
                                                                value={mat.nombre} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'nombre', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm outline-none"
                                                                placeholder="Ej: Madera, Papel..."
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="number" 
                                                                value={mat.pqUnitario} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'pqUnitario', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm text-right outline-none font-mono"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="number" 
                                                                value={mat.cantidadKg} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'cantidadKg', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm text-right outline-none font-mono"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-right font-mono font-bold text-slate-700 bg-slate-50/50">
                                                            {acumulado > 0 ? acumulado.toLocaleString('es-AR') : "0"}
                                                        </td>
                                                        <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => deleteMaterial(sector.id, mat.id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                                title="Eliminar Material"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        {materiales.length > 0 && (
                                            <tfoot className="bg-slate-100">
                                                <tr>
                                                    <td colSpan={3} className="p-3 text-right font-bold text-slate-800 border-r border-slate-200">
                                                        Total Acumulado =
                                                    </td>
                                                    <td className="p-3 text-right font-bold font-mono text-slate-900 border-r border-slate-200">
                                                        {totalAcumuladoKcal > 0 ? totalAcumuladoKcal.toLocaleString('es-AR') : "0"}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>

                                    {/* Summary Table */}
                                    <div className="flex justify-end pr-12">
                                        <table className="border-collapse bg-slate-50 border border-slate-200 rounded-xl overflow-hidden w-96 text-sm">
                                            <tbody>
                                                <tr className="border-b border-slate-200">
                                                    <td className="p-3 text-right font-bold text-slate-600 border-r border-slate-200 bg-white">Pm =</td>
                                                    <td className="p-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                                                        {pm.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                                    </td>
                                                    <td className="p-3 text-slate-500 font-mono text-xs w-24">Kg madera</td>
                                                </tr>
                                                <tr className="border-b border-slate-200">
                                                    <td className="p-3 text-right font-bold text-slate-600 border-r border-slate-200 bg-white">Sup. =</td>
                                                    <td className="p-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                                                        {totalSuperficie.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="p-3 text-slate-500 font-mono text-xs">m²</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 text-right font-black text-indigo-700 border-r border-slate-200 bg-indigo-50/50">QF =</td>
                                                    <td className="p-3 text-right font-mono font-black text-indigo-700 border-r border-slate-200 bg-indigo-50/50 text-base">
                                                        {qf.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                                    </td>
                                                    <td className="p-3 text-indigo-500 font-mono text-xs bg-indigo-50/50 font-bold">Kg mad / m²</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
