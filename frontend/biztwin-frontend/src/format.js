export function money(value, currency = 'USD', compact = true) {
  const n = Number(value || 0);
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (currency === 'INR') {
    if (compact && abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
    if (compact && abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
    if (compact && abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
    return `${sign}₹${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  if (compact && abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (compact && abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (compact && abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function number(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function pct(value, digits = 1) {
  const n = Number(value || 0);
  return `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;
}

export function monthLabel(value) {
  if (!value) return '—';
  const str = String(value);
  if (/^\d{4}-\d{2}$/.test(str)) {
    const [year, month] = str.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleString('en', { month: 'short', year: '2-digit' });
  }
  return str;
}

export function dateRange(from, to) {
  if (!from || !to) return 'Date range unavailable';
  return `${from} → ${to}`;
}

export function downloadCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
