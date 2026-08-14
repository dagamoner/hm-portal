import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ImageRun, SectionType, PageBreak, PageOrientation } from "docx";
import { saveAs } from "file-saver";

export const generateWordReport = async (company: any, establecimiento: any, sectors: any[]) => {
    // Basic setup for the document
    const doc = new Document({
        creator: "Portal MH",
        title: "Proyecto de Instalaciones PCI",
        description: "Informe Integral de Protección Contra Incendios",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 22, // 11pt
                    },
                    paragraph: {
                        spacing: {
                            line: 276, // 1.15 line spacing
                            before: 120,
                            after: 120,
                        },
                    },
                },
                heading1: {
                    run: {
                        size: 32,
                        bold: true,
                        color: "1e293b",
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                    },
                },
                heading2: {
                    run: {
                        size: 28,
                        bold: true,
                        color: "334155",
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    type: SectionType.NEXT_PAGE,
                },
                children: [
                    new Paragraph({
                        text: "PROYECTO DE INSTALACIONES DE PROTECCIÓN CONTRA INCENDIOS",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 2000, after: 400 },
                    }),
                    new Paragraph({
                        text: establecimiento?.nombre || "Establecimiento",
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 800 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Empresa: ", bold: true }),
                            new TextRun(company?.nombre || "N/A"),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Ubicación: ", bold: true }),
                            new TextRun(establecimiento?.domicilio || "N/A"),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Actividad: ", bold: true }),
                            new TextRun(establecimiento?.actividad || "N/A"),
                        ],
                    }),
                    new Paragraph({ children: [new PageBreak()] }),
                    new Paragraph({
                        text: "1. Generalidades",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Superficie Total: ", bold: true }),
                            new TextRun(`${establecimiento?.superficieTotal || 0} m²`),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Pisos Superiores: ", bold: true }),
                            new TextRun(establecimiento?.pisosSuperiores || "0"),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Subsuelos: ", bold: true }),
                            new TextRun(establecimiento?.subsuelos || "0"),
                        ],
                    }),
                    new Paragraph({
                        text: "2. Sectores de Incendio",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 400 }
                    }),
                    ...sectors.map((s, i) => {
                        const totalArea = s.subsectors?.reduce((acc: number, sub: any) => acc + (Number(sub.areaBruta) || 0), 0) || 0;
                        return new Paragraph({
                            children: [
                                new TextRun({ text: `Sector ${i+1}: ${s.name} - `, bold: true }),
                                new TextRun(`${totalArea.toLocaleString('es-AR')} m² (Subsectores: ${s.subsectors?.map((sub:any)=>sub.nombre).join(', ')})`)
                            ]
                        });
                    }),
                    new Paragraph({ children: [new PageBreak()] }),
                    new Paragraph({ text: "El informe detallado de cada sector se incluye en el PDF o en versiones más avanzadas del reporte.", italics: true })
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Informe_PCI_${establecimiento?.nombre || 'General'}.docx`);
};
