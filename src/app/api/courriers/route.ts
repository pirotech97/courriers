import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase directement dans l'API route
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Variables Supabase manquantes:', {
      url: supabaseUrl ? 'définie' : 'manquante',
      key: supabaseAnonKey ? 'définie' : 'manquante'
    });
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET - Récupérer tous les courriers
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }
    
    const { data, error } = await supabase
      .from('courriers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courriers:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des courriers', details: error.message },
        { status: 500 }
      );
    }

    // Transform data to match frontend format (date_remise -> dateRemise)
    const transformedData = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      nom: item.nom,
      montant: item.montant,
      pays: item.pays,
      dateRemise: item.date_remise,
      contact: item.contact,
      statut: item.statut,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau courrier
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    
    const newCourrier = {
      nom: body.nom,
      montant: body.montant || '—',
      pays: body.pays || '—',
      date_remise: body.dateRemise || '—',
      contact: body.contact || '',
      statut: body.statut || 'En attente',
    };

    const { data, error } = await supabase
      .from('courriers')
      .insert([newCourrier])
      .select()
      .single();

    if (error) {
      console.error('Error creating courrier:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du courrier', details: error.message },
        { status: 500 }
      );
    }

    // Transform response
    const transformedData = {
      id: data.id,
      nom: data.nom,
      montant: data.montant,
      pays: data.pays,
      dateRemise: data.date_remise,
      contact: data.contact,
      statut: data.statut,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(transformedData, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}
