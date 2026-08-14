export const getSectorTotalSuperficie = (sector: any) => {
    return sector.subsectors?.reduce((acc: number, sub: any) => acc + (Number(sub.areaBruta) || 0), 0) || 0;
};

export const MATERIALES = [
    "Riesgo 1 (Explosivo)",
    "Riesgo 2 (Inflamable)",
    "Riesgo 3 (Muy Combustible)",
    "Riesgo 4 (Combustible)",
    "Riesgo 5 (Poco Combustible)",
    "Riesgo 6 (Incombustible)",
    "Riesgo 7 (Refractarios)"
];

export const calcularRiesgo = (actividad: string, material: string) => {
    if (!actividad || !material) return "";
    
    const matIndex = MATERIALES.indexOf(material);
    if (matIndex === -1) return "";
    const r = `R${matIndex + 1}`;
    
    const restringidas = ["Residencial", "Administrativo", "Espectáculos", "Cultura"];
    if (restringidas.some(res => actividad.includes(res))) {
        if (matIndex === 0 || matIndex === 1) return "NP";
        if (matIndex === 2) return "R3";
        if (matIndex === 3) return "R4";
        return "";
    }
    
    return r;
};

export const calcularCargaFuego = (sector: any) => {
    const totalSuperficie = getSectorTotalSuperficie(sector);
    const materiales = sector.materialesCargaFuego || [];
    
    let totalAcumuladoKcal = 0;
    materiales.forEach((m: any) => {
        const pq = Number(m.pqUnitario) || 0;
        const kg = Number(m.cantidadKg) || 0;
        totalAcumuladoKcal += (pq * kg);
    });

    const pm = totalAcumuladoKcal / 4400; // Peso en Kg madera
    const qf = totalSuperficie > 0 ? pm / totalSuperficie : 0; // Kg madera / m2

    return { totalAcumuladoKcal, qf, pm };
};

export const getResistenciaRequerida = (qf: number, riesgoStr: string, isForzada: boolean = false) => {
    const riesgoNum = parseInt((riesgoStr || "").replace("R", "")) || 0;
    if (!riesgoNum || qf <= 0) return "-";
    
    // Natural
    if (!isForzada) {
        if (qf <= 15) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F60";
            if (riesgoNum === 4 || riesgoNum === 5) return "F30";
        }
        if (qf >= 16 && qf <= 30) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F90";
            if (riesgoNum === 4) return "F60";
            if (riesgoNum === 5) return "F30";
        }
        if (qf >= 31 && qf <= 60) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F120";
            if (riesgoNum === 4) return "F90";
            if (riesgoNum === 5) return "F60";
        }
        if (qf >= 61 && qf <= 100) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F180";
            if (riesgoNum === 4) return "F120";
            if (riesgoNum === 5) return "F90";
        }
        if (qf > 100) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F180";
            if (riesgoNum === 4) return "F180";
            if (riesgoNum === 5) return "F120";
        }
    } else {
        // Forzada
        if (qf <= 15) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3 || riesgoNum === 4) return "F60";
            if (riesgoNum === 5) return "F30";
        }
        if (qf >= 16 && qf <= 30) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F90";
            if (riesgoNum === 4 || riesgoNum === 5) return "F60";
        }
        if (qf >= 31 && qf <= 60) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F120";
            if (riesgoNum === 4) return "F90";
            if (riesgoNum === 5) return "F60";
        }
        if (qf >= 61 && qf <= 100) {
            if (riesgoNum === 1 || riesgoNum === 2) return "NP";
            if (riesgoNum === 3) return "F180";
            if (riesgoNum === 4) return "F120";
            if (riesgoNum === 5) return "F90";
        }
        if (qf > 100) {
            if (riesgoNum === 1 || riesgoNum === 2 || riesgoNum === 3) return "NP";
            if (riesgoNum === 4) return "F180";
            if (riesgoNum === 5) return "F120";
        }
    }
    return "-";
};

export const getPotencialRequeridoA = (qf: number, riesgoStr: string) => {
    const riesgoNum = parseInt((riesgoStr || "").replace("R", "")) || 0;
    if (!riesgoNum || qf <= 0) return "-";
    
    if (qf <= 15) {
        if (riesgoNum === 3 || riesgoNum === 4 || riesgoNum === 5) return "1A";
    }
    if (qf >= 16 && qf <= 30) {
        if (riesgoNum === 3) return "2A";
        if (riesgoNum === 4 || riesgoNum === 5) return "1A";
    }
    if (qf >= 31 && qf <= 60) {
        if (riesgoNum === 3) return "3A";
        if (riesgoNum === 4) return "2A";
        if (riesgoNum === 5) return "1A";
    }
    if (qf >= 61 && qf <= 100) {
        if (riesgoNum === 3) return "6A";
        if (riesgoNum === 4) return "4A";
        if (riesgoNum === 5) return "3A";
    }
    if (qf > 100) {
        return "a determinar";
    }
    return "-";
};

export const getPotencialRequeridoB = (qf: number, riesgoStr: string) => {
    const riesgoNum = parseInt((riesgoStr || "").replace("R", "")) || 0;
    if (!riesgoNum || qf <= 0) return "-";
    
    if (qf <= 15) {
        if (riesgoNum === 2) return "6B";
        if (riesgoNum === 3) return "4B";
    }
    if (qf >= 16 && qf <= 30) {
        if (riesgoNum === 2) return "8B";
        if (riesgoNum === 3) return "6B";
    }
    if (qf >= 31 && qf <= 60) {
        if (riesgoNum === 2) return "10B";
        if (riesgoNum === 3) return "8B";
    }
    if (qf >= 61 && qf <= 100) {
        if (riesgoNum === 2) return "20B";
        if (riesgoNum === 3) return "10B";
    }
    if (qf > 100) {
        return "a determinar";
    }
    return "-";
};

export const TIPOS_USO_ESCAPE = [
    { id: 'a', x: 1, label: 'Sitios de asamblea, auditorios, etc.' },
    { id: 'b', x: 2, label: 'Edificios educacionales, templos, etc.' },
    { id: 'c', x: 3, label: 'Lugares de trabajo, comerciales, etc.' },
    { id: 'd', x: 5, label: 'Mercados, ferias, etc. Planta baja.' },
    { id: 'e', x: 8, label: 'Mercados, ferias, etc. Pisos superiores.' },
    { id: 'f', x: 12, label: 'Hoteles, residencias, oficinas, etc.' },
    { id: 'g', x: 16, label: 'Industrias, fábricas, talleres, etc.' },
    { id: 'h', x: 2, label: 'Salas de baile, discotecas, etc.' },
    { id: 'i', x: 3, label: 'Gimnasios, clubes, etc.' },
    { id: 'j', x: 8, label: 'Hospitales, clínicas, etc.' },
    { id: 'k', x: 3, label: 'Restaurantes, bares, etc.' },
    { id: 'l', x: 20, label: 'Museos, bibliotecas, etc.' },
    { id: 'm', x: 30, label: 'Depósitos, archivos, etc.' }
];

export const calcularMetrosUAS = (nUas: number, esExistente: boolean) => {
    if (nUas <= 0) return 0;
    if (nUas <= 2) {
        return esExistente ? 0.96 : 1.10;
    }
    const base = esExistente ? 0.96 : 1.10;
    const extra = (nUas - 2) * 0.45;
    return base + extra;
};
