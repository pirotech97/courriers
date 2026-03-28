import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Suivi des Courriers',
  description: 'Espace d\'administration pour le suivi des courriers',
  robots: 'noindex,nofollow', // Prevent indexing of admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
