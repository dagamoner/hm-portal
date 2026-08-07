const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const map = {
  "1-PROPANOL": { fds: "FDS_1-PROPANOL.pdf", label: "1-PROPANOL.pdf", pictograms: ["SGA02", "SGA05", "SGA07"] },
  "2-BUTANONA": { fds: "FDS_2-BUTANONA.pdf", label: "2-BUTANONA.pdf", pictograms: ["SGA02", "SGA07"] },
  "2-METIL-1-PROPANOL": { fds: "FDS_2-METIL-1-PROPANOL.pdf", label: "2-METIL-1-PROPANOL.pdf", pictograms: ["SGA02", "SGA05", "SGA07"] },
  "2-PROPANOL": { fds: "FDS_2 PROPANOL.pdf", label: "2-PROPANOL.pdf", pictograms: ["SGA02", "SGA07"] },
  "ACETATO DE ETILO": { fds: "FDS_ACETATO DE ETILO.pdf", label: "ACETATO DE ETILO.pdf", pictograms: ["SGA02", "SGA07"] },
  "ACETONA": { fds: "FDS_2-PROPANONA.pdf", label: "ACETONA.pdf", pictograms: ["SGA02", "SGA07"] },
  "ACIDO ACETICO": { fds: "FDS_ACIDO ACETICO.pdf", label: "ACIDO ACETICO.pdf", pictograms: ["SGA02", "SGA05"] },
  "ACIDO CLORHIDRICO": { fds: "FDS_ACIDO CLORHIDRICO.pdf", label: "ACIDO CLORHIDRICO.pdf", pictograms: ["SGA05", "SGA07"] },
  "ACIDO SULFHIDRICO": { fds: "FDS_ACIDO SULFHIDRICO.pdf", label: "ACIDO SULFHIDRICO.pdf", pictograms: ["SGA02", "SGA04", "SGA06", "SGA09"] },
  "ACIDO SULFURICO": { fds: "FDS_ACIDO SULFURICO.pdf", label: "ACIDO SULFURICO.pdf", pictograms: ["SGA05"] },
  "AMONIACO": { fds: "FDS_AMONIACO.pdf", label: "AMONIACO.pdf", pictograms: ["SGA04", "SGA05", "SGA06", "SGA09"] },
  "BENCENO": { fds: "FDS_BENCENO.pdf", label: "BENCENO.pdf", pictograms: ["SGA02", "SGA07", "SGA08"] },
  "CLORO": { fds: "FDS_CLORO.pdf", label: "CLORO.pdf", pictograms: ["SGA03", "SGA04", "SGA06", "SGA09"] },
  "CLOROBENCENO": { fds: "FDS_CLOROBENCENO.pdf", label: "CLOROBENCENO.pdf", pictograms: ["SGA02", "SGA07", "SGA09"] },
  "CLORURO DE PLATA": { fds: "FDS_CLORURO DE PLATA.pdf", label: "CLORURO DE PLATA.pdf", pictograms: ["SGA09"] },
  "CLORURO DE PLOMO (II)": { fds: "FDS_CLORURO DE PLOMO.pdf", label: "CLORURO DE PLOMO (II).pdf", pictograms: ["SGA07", "SGA08", "SGA09"] },
  "DIOXIDO DE AZUFRE": { fds: "FDS_DIOXIDO DE AZUFRE.pdf", label: "DIOXIDO DE AZUFRE.pdf", pictograms: ["SGA04", "SGA05", "SGA06"] },
  "DIOXIDO DE CARBONO": { fds: "FDS_DIOXIDO DE CARBONO.pdf", label: "DIOXIDO DE CARBONO.pdf", pictograms: ["SGA04"] },
  "DIOXIDO DE SILICIO": { fds: "FDS_DIOXIDO DE SILICIO.pdf", label: "DIOXIDO DE SILICIO.pdf", pictograms: [] },
  "ETANOL": { fds: "FDS_ETANOL.pdf", label: "ETANOL.pdf", pictograms: ["SGA02", "SGA07"] },
  "ETILBENCENO": { fds: "FDS_ETILBENCENO.pdf", label: "ETILBENCENO.pdf", pictograms: ["SGA02", "SGA07", "SGA08"] },
  "ETINO": { fds: "FDS_ETINO.pdf", label: "ETINO.pdf", pictograms: ["SGA02", "SGA04"] },
  "METANAL": { fds: "FDS_METANAL.pdf", label: "METANAL.pdf", pictograms: ["SGA05", "SGA06", "SGA08"] },
  "METANOL": { fds: "FDS_METANOL.pdf", label: "METANOL.pdf", pictograms: ["SGA02", "SGA06", "SGA08"] },
  "MONOXIDO DE CARBONO": { fds: "FDS_MONOXIDO DE CARBONO.pdf", label: "MONOXIDO DE CARBONO.pdf", pictograms: ["SGA02", "SGA04", "SGA06", "SGA08"] },
  "o-XILENO": { fds: "FDS_O XILENO.pdf", label: "o-XILENO.pdf", pictograms: ["SGA02", "SGA07", "SGA08"] },
  "OXIDO DE CROMO (IV)": { fds: "FDS_OXIDO DE CROMO.pdf", label: "OXIDO DE CROMO (IV).pdf", pictograms: ["SGA07"] },
  "OXIDO DE ETILENO": { fds: "FDS_OXIDO DE ETILENO.pdf", label: "OXIDO DE ETILENO.pdf", pictograms: ["SGA02", "SGA04", "SGA06", "SGA08"] },
  "OZONO": { fds: "FDS_OZONO.pdf", label: "OZONO.pdf", pictograms: ["SGA03", "SGA04", "SGA06"] },
  "TOLUENO": { fds: "FDS_TOLUENO.pdf", label: "TOLUENO.pdf", pictograms: ["SGA02", "SGA07", "SGA08"] },
  "TRICLOROMETANO": { fds: "FDS_TRICLOROMETANO.pdf", label: "TRICLOROMETANO.pdf", pictograms: ["SGA06", "SGA08"] },
  "n-HEXANO": { fds: "FDS_n-HEXANO.pdf", label: "n-HEXANO.pdf", pictograms: ["SGA02", "SGA07", "SGA08", "SGA09"] }
};

async function main() {
  console.log("Seeding SGA Library Items...");
  for (const name of Object.keys(map)) {
    const data = map[name];
    
    await prisma.sgaLibraryItem.upsert({
      where: { name: name },
      update: {
        fdsUrl: `/sga/fds/${data.fds}`,
        labelUrl: `/sga/etiquetas/${data.label}`,
        pictograms: JSON.stringify(data.pictograms)
      },
      create: {
        name: name,
        pictograms: JSON.stringify(data.pictograms),
        fdsUrl: `/sga/fds/${data.fds}`,
        labelUrl: `/sga/etiquetas/${data.label}`
      }
    });
  }
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
