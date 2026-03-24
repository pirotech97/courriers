import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase directement dans l'API route
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET - Récupérer un courrier par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }
    
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('courriers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching courrier:', error);
      return NextResponse.json(
        { error: 'Courrier non trouvé', details: error.message },
        { status: 404 }
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un courrier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {};
    
    if (body.nom !== undefined) updateData.nom = body.nom;
    if (body.montant !== undefined) updateData.montant = body.montant;
    if (body.pays !== undefined) updateData.pays = body.pays;
    if (body.dateRemise !== undefined) updateData.date_remise = body.dateRemise;
    if (body.contact !== undefined) updateData.contact = body.contact;
    if (body.statut !== undefined) updateData.statut = body.statut;

    const { data, error } = await supabase
      .from('courriers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating courrier:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du courrier', details: error.message },
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un courrier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }
    
    const { id } = await params;
    
    const { error } = await supabase
      .from('courriers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting courrier:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du courrier', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Courrier supprimé avec succès' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}
