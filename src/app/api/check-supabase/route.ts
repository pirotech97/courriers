import { NextResponse } from 'next/server';
import { checkConnection } from '@/lib/supabase';

export async function GET() {
  const result = await checkConnection();
  return NextResponse.json(result);
}
