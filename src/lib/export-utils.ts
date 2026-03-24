import { Courrier } from '@/lib/courriers-data';

// Export to CSV
export function exportToCSV(courriers: Courrier[], filename: string = 'courriers') {
  const headers = ['Nom', 'Montant', 'Pays', 'Date de remise', 'Contact', 'Statut'];
  const rows = courriers.map(c => [
    c.nom,
    c.montant,
    c.pays,
    c.dateRemise,
    c.contact,
    c.statut
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Export to PDF (using browser print functionality)
export function exportToPDF(courriers: Courrier[], title: string = 'Rapport des Courriers') {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenêtres pop-up pour exporter en PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #1a1a2e;
        }
        h1 {
          color: #3b82f6;
          margin-bottom: 8px;
        }
        .date {
          color: #64748b;
          margin-bottom: 24px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background: #f1f5f9;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        .status-confirmed { 
          background: #dcfce7; 
          color: #166534; 
          padding: 4px 12px; 
          border-radius: 9999px; 
          font-size: 12px;
          font-weight: 500;
        }
        .status-pending { 
          background: #fef3c7; 
          color: #92400e; 
          padding: 4px 12px; 
          border-radius: 9999px; 
          font-size: 12px;
          font-weight: 500;
        }
        .status-received { 
          background: #dbeafe; 
          color: #1e40af; 
          padding: 4px 12px; 
          border-radius: 9999px; 
          font-size: 12px;
          font-weight: 500;
        }
        .status-relance { 
          background: #fee2e2; 
          color: #991b1b; 
          padding: 4px 12px; 
          border-radius: 9999px; 
          font-size: 12px;
          font-weight: 500;
        }
        .summary {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }
        .summary-item {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
        }
        .summary-label {
          font-size: 12px;
          color: #64748b;
        }
        .summary-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="date">Généré le ${new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      
      <div class="summary">
        <div class="summary-item">
          <div class="summary-label">Total courriers</div>
          <div class="summary-value">${courriers.length}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Confirmés</div>
          <div class="summary-value">${courriers.filter(c => c.statut === 'Confirmé').length}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">En attente</div>
          <div class="summary-value">${courriers.filter(c => c.statut === 'En attente').length}</div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Montant</th>
            <th>Pays</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${courriers.map(c => `
            <tr>
              <td><strong>${c.nom}</strong></td>
              <td>${c.montant}</td>
              <td>${c.pays}</td>
              <td>${c.dateRemise}</td>
              <td><span class="status-${c.statut === 'Confirmé' ? 'confirmed' : c.statut === 'En attente' ? 'pending' : c.statut === 'Reçu' ? 'received' : 'relance'}">${c.statut}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <script class="no-print">
        // Auto-print
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Filter utilities
export interface FilterOptions {
  search: string;
  status: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'nom' | 'date' | 'statut';
  sortOrder: 'asc' | 'desc';
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === '—') return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}

export function filterCourriers(courriers: Courrier[], filters: FilterOptions): Courrier[] {
  return courriers.filter(c => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch = 
        c.nom.toLowerCase().includes(search) ||
        c.pays.toLowerCase().includes(search) ||
        c.contact.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && c.statut !== filters.status) {
      return false;
    }

    // Country filter
    if (filters.country !== 'all' && c.pays !== filters.country) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const courrierDate = parseDate(c.dateRemise);
      if (courrierDate) {
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (courrierDate < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (courrierDate > toDate) return false;
        }
      } else if (filters.dateFrom || filters.dateTo) {
        // If filtering by date and this courrier has no date, exclude it
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sorting
    let comparison = 0;
    
    if (filters.sortBy === 'nom') {
      comparison = a.nom.localeCompare(b.nom);
    } else if (filters.sortBy === 'date') {
      const dateA = parseDate(a.dateRemise);
      const dateB = parseDate(b.dateRemise);
      if (!dateA && !dateB) comparison = 0;
      else if (!dateA) comparison = 1;
      else if (!dateB) comparison = -1;
      else comparison = dateA.getTime() - dateB.getTime();
    } else if (filters.sortBy === 'statut') {
      comparison = a.statut.localeCompare(b.statut);
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });
}
