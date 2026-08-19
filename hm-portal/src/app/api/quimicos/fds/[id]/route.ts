import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'product';

  try {
    let fdsUrl = null;

    if (type === 'product') {
      const product = await prisma.chemicalProduct.findUnique({
        where: { id },
        select: { fdsUrl: true }
      });
      fdsUrl = product?.fdsUrl;
    } else {
      const libraryItem = await prisma.sgaLibraryItem.findUnique({
        where: { id },
        select: { fdsUrl: true }
      });
      fdsUrl = libraryItem?.fdsUrl;
    }

    if (!fdsUrl) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // fdsUrl might be a base64 string or a normal URL
    if (fdsUrl.startsWith('data:')) {
      // Parse base64
      const matches = fdsUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new NextResponse("Invalid Base64 Data", { status: 400 });
      }

      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="FDS-${id}.pdf"`
        }
      });
    }

    // If it's a normal URL, redirect to it
    return NextResponse.redirect(fdsUrl);

  } catch (error) {
    console.error("Error fetching FDS:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
