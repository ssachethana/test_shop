import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {

    const shopId : number = 2

  try {

    const brand = await prisma.brand.findMany({

      where: {
        shopId: shopId,

      },
      orderBy: {
        name: 'asc',
      },
    });

    // Return the sorted list of units
    return NextResponse.json(brand, { status: 200 });
    
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json(
      { error: 'Error fetching brand' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const shopId: number = 2; // Hardcoded to match your Category logic
    const body = await req.json();
    const { name } = body;

    // 1. Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // 2. Check for unique constraint [name, shopId]
    // This prevents Prisma from throwing a generic error if the brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: {
        name_shopId: {
          name: name.trim(),
          shopId: shopId,
        },
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: 'This brand already exists in your shop' },
        { status: 400 }
      );
    }

    // 3. Create new Brand
    const newBrand = await prisma.brand.create({
      data: {
        name: name.trim(),
        shopId: shopId,
      },
    });

    return NextResponse.json(newBrand, { status: 201 });

  } catch (error) {
    console.error("Post Brand Error:", error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}