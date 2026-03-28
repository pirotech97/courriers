'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login');
    },
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-600/10 border border-blue-600/30 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenue, {session?.user?.name || session?.user?.email}</h2>
          <p className="text-slate-300">Vous êtes connecté en tant qu&apos;administrateur système.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Utilisateurs</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Courriers</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Administrateurs</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-4">À propos de cet espace</h3>
          <p className="text-slate-300 mb-4">
            Cet espace d&apos;administration est protégé par authentification JWT et nécessite des droits admin.
          </p>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>✓ Session sécurisée avec JWT</li>
            <li>✓ Expiration automatique après 24 heures</li>
            <li>✓ Protection par middleware NextAuth</li>
            <li>✓ Application PWA compatible hors ligne</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
