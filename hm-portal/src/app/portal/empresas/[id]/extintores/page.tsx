import { requireAuth } from "@/lib/auth";
import { getExtintores } from "@/app/actions/extintores";
import ExtintoresClient from "./ExtintoresClient";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Protección Contra Incendios | MH Portal",
    description: "Gestión de extintores y protección contra incendios",
};

export default async function ExtintoresPage({ params }: { params: { id: string } }) {
    await requireAuth(params.id);

    const company = await prisma.company.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, taxId: true }
    });

    if (!company) notFound();

    const extintores = await getExtintores(params.id);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <ExtintoresClient company={company} extintores={extintores} />
        </div>
    );
}
