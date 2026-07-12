// app/api/analytics/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(
  
) {
  const shopId = 2;

  if (isNaN(shopId)) {
    return NextResponse.json({ error: "Invalid shop ID" }, { status: 400 });
  }

  const analytics = await prisma.shopAnalytics.findUnique({
    where: { shopId },
  });

  if (!analytics) {
    return NextResponse.json(
      { error: "Analytics not found for this shop" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: analytics }, { status: 200 });
}
