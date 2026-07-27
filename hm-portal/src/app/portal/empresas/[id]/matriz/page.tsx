import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MatrizClient from "./MatrizClient";

export default async function MatrizGlobalPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const company = await prisma.company.findUnique({
        where: { id: resolvedParams.id },
        include: {
            establishments: {
                include: {
                    sectors: {
                        include: {
                            processes: {
                                include: {
                                    jobRoles: {
                                        include: {
                                            tasks: {
                                                include: {
                                                    hazards: {
                                                        include: {
                                                            evaluations: {
                                                                include: {
                                                                    improvementActions: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!company) {
        notFound();
    }

    return <MatrizClient company={company} />;
}
