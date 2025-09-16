import { NextResponse } from 'next/server';
import { classes } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(classes);
}
