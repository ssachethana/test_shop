import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {

    const shopId : number = 2

  try {

    const category = await prisma.category.findMany({

      where: {
        shopId: shopId,

      },
      orderBy: {
        name: 'asc',
      },
    });
    console.log(category)

    // Return the sorted list of units
    return NextResponse.json(category, { status: 200 });
    
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json(
      { error: 'Error fetching category' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Hardcoded shopId as per your current setup
    const shopId: number = 2;

    const body = await req.json();
    const { name } = body;

    // 1. Validation: Ensure name exists
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // 2. Check for duplicates: 
    // Your schema has @@unique([name, shopId]), so Prisma would throw an error anyway, 
    // but checking manually allows for a cleaner error message.
    const existingCategory = await prisma.category.findUnique({
      where: {
        name_shopId: {
          name: name,
          shopId: shopId,
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists in this shop' },
        { status: 400 }
      );
    }

    // 3. Create the category
    const newCategory = await prisma.category.create({
      data: {
        name: name,
        shopId: shopId,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });

  } catch (error: any) {
    console.error("Post Category Error:", error);
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}