/**
 * reports.js - Esportazione Excel (CSV/XLSX), PDF e Gestione Backup JSON
 */

class ReportsManager {
  constructor(store) {
    this.store = store;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.exportMonthSelect = document.getElementById('exportMonthSelect');
    this.btnExportExcel = document.getElementById('btnExportExcel');
    this.btnExportCsv = document.getElementById('btnExportCsv');
    this.btnPrintPdf = document.getElementById('btnPrintPdf');
    this.btnBackupJson = document.getElementById('btnBackupJson');
    this.btnRestoreJson = document.getElementById('btnRestoreJson');
    this.restoreFileInput = document.getElementById('restoreFileInput');
  }

  bindEvents() {
    if (this.exportMonthSelect) {
      this.populateMonthOptions();
    }

    if (this.btnExportExcel) {
      this.btnExportExcel.addEventListener('click', () => this.exportToExcel());
    }

    if (this.btnExportCsv) {
      this.btnExportCsv.addEventListener('click', () => this.exportToCsv());
    }

    if (this.btnPrintPdf) {
      this.btnPrintPdf.addEventListener('click', () => this.printPdfReport());
    }

    if (this.btnBackupJson) {
      this.btnBackupJson.addEventListener('click', () => this.backupToJson());
    }

    if (this.btnRestoreJson && this.restoreFileInput) {
      this.btnRestoreJson.addEventListener('click', () => this.restoreFileInput.click());
      this.restoreFileInput.addEventListener('change', (e) => this.handleRestoreFile(e));
    }
  }

  populateMonthOptions() {
    if (!this.exportMonthSelect) return;
    this.exportMonthSelect.innerHTML = '';
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString(window.shiftNetI18n.getLocale(), { month: 'long', year: 'numeric' });
      
      const opt = document.createElement('option');
      opt.value = ym;
      opt.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      this.exportMonthSelect.appendChild(opt);
    }
  }

  getTargetShiftsAndAbsences() {
    const yearMonth = this.exportMonthSelect ? this.exportMonthSelect.value : '';
    const shifts = this.store.shifts.filter(s => s.date.startsWith(yearMonth));
    const absences = this.store.absences.filter(a => a.date.startsWith(yearMonth));
    return { yearMonth, shifts, absences };
  }

  exportToCsv() {
    const { yearMonth, shifts, absences } = this.getTargetShiftsAndAbsences();
    if (shifts.length === 0 && absences.length === 0) {
      showToast('Nessun dato registrato nel mese selezionato da esportare.', 'warning');
      return;
    }

    let csvContent = '\uFEFF'; // BOM per supporto caratteri speciali in Excel
    csvContent += 'Data;Giorno;Tipologia;Inizio;Fine;Pausa (min);Ore Totali;Tariffa/Magg.;Lordo (€);Netto Stimato (€);Note\n';

    // Raccoglie tutti gli eventi ordinati per data
    const allEvents = [];
    shifts.forEach(s => allEvents.push({ type: 'shift', data: s, date: s.date }));
    absences.forEach(a => allEvents.push({ type: 'absence', data: a, date: a.date }));
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    allEvents.forEach(item => {
      const d = new Date(item.date);
      const dayName = d.toLocaleDateString(window.shiftNetI18n.getLocale(), { weekday: 'short' });

      if (item.type === 'shift') {
        const s = item.data;
        const start = new Date(s.startTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' });
        const end = s.endTime ? new Date(s.endTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }) : '';
        const gross = s.financials ? s.financials.grossTotal.toFixed(2) : '';
        const net = s.financials ? s.financials.netTotal.toFixed(2) : '';
        const mult = s.financials ? `x${s.financials.multiplier}` : '';

        csvContent += `"${s.date}";"${dayName}";"Turno ${s.type}";"${start}";"${end}";"${s.totalPauseMinutes || 0}";"${s.totalHoursWorked}";"${mult}";"${gross}";"${net}";"${(s.notes || '').replace(/"/g, '""')}"\n`;
      } else {
        const a = item.data;
        const gross = a.financials ? a.financials.grossTotal.toFixed(2) : '';
        const net = a.financials ? a.financials.netTotal.toFixed(2) : '';
        csvContent += `"${a.date}";"${dayName}";"${a.type.toUpperCase()}";"-";"-";"-";"${a.hours}";"1.0";"${gross}";"${net}";"${(a.notes || '').replace(/"/g, '""')}"\n`;
      }
    });

    const summary = this.store.getMonthSummary(yearMonth);
    csvContent += `\n"RIEPILOGO MESE ${yearMonth}";"";"";"";"";"";"";"";"";"";""\n`;
    csvContent += `"Ore Ordinarie Totali";"${summary.totalOrdinaryHours} h";"";"";"";"";"";"";"";"";""\n`;
    csvContent += `"Ore Straordinari Totali";"${summary.totalOvertimeHours} h";"";"";"";"";"";"";"";"";""\n`;
    csvContent += `"Ferie / Assenze Totali";"${summary.vacationHours + summary.permitHours + summary.sickHours} h";"";"";"";"";"";"";"";"";""\n`;
    csvContent += `"Totale Lordo Stimato";"€ ${summary.totalGross.toFixed(2)}";"";"";"";"";"";"";"";"";""\n`;
    csvContent += `"Totale Netto Stimato";"€ ${summary.totalNet.toFixed(2)}";"";"";"";"";"";"";"";"";""\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Foglio_Presenze_${yearMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File CSV scaricato con successo!', 'success');
  }

  exportToExcel() {
    // Se SheetJS (XLSX) è caricato lo usiamo per generare un vero file .xlsx con stili, altrimenti usiamo il formato CSV avanzato
    if (typeof XLSX !== 'undefined') {
      const { yearMonth, shifts, absences } = this.getTargetShiftsAndAbsences();
      const rows = [];

      shifts.forEach(s => {
        rows.push({
          'Data': s.date,
          'Tipo': `Turno ${s.type}`,
          'Inizio': new Date(s.startTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }),
          'Fine': s.endTime ? new Date(s.endTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }) : '',
          'Pausa (min)': s.totalPauseMinutes || 0,
          'Ore Lavorate': s.totalHoursWorked,
          'Lordo (€)': s.financials ? s.financials.grossTotal : 0,
          'Netto (€)': s.financials ? s.financials.netTotal : 0,
          'Note': s.notes || ''
        });
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Presenze');
      XLSX.writeFile(wb, `Presenze_Lavoro_${yearMonth}.xlsx`);
      showToast('File Excel XLSX scaricato con successo!', 'success');
    } else {
      this.exportToCsv();
    }
  }

  printPdfReport() {
    const { yearMonth, shifts, absences } = this.getTargetShiftsAndAbsences();
    const summary = this.store.getMonthSummary(yearMonth);

    let rowsHtml = '';
    shifts.forEach(s => {
      const start = new Date(s.startTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' });
      const end = s.endTime ? new Date(s.endTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }) : '';
      rowsHtml += `
        <tr>
          <td>${s.date}</td>
          <td>Turno ${s.type}</td>
          <td>${start}</td>
          <td>${end}</td>
          <td>${s.totalPauseMinutes || 0}m</td>
          <td><strong>${s.totalHoursWorked}h</strong></td>
          <td>€ ${s.financials ? s.financials.netTotal.toFixed(2) : '-'}</td>
          <td>${s.notes || ''}</td>
        </tr>
      `;
    });

    absences.forEach(a => {
      rowsHtml += `
        <tr style="background:#f8fafc;">
          <td>${a.date}</td>
          <td><strong>${a.type.toUpperCase()}</strong></td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td><strong>${a.hours}h</strong></td>
          <td>-</td>
          <td>${a.notes || ''} ${a.protocolNumber ? `(Prot. ${a.protocolNumber})` : ''}</td>
        </tr>
      `;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Presenze ${yearMonth}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .summary-box { margin-top: 24px; display: flex; gap: 16px; font-size: 13px; }
          .summary-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; flex: 1; background: #f8fafc; }
          .summary-card h4 { margin: 0 0 6px; color: #475569; }
          .summary-card p { margin: 2px 0; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">REGISTRO PRESENZE E ORE LAVORATE</div>
            <div>Mese di riferimento: <strong>${yearMonth}</strong></div>
          </div>
          <div style="text-align:right;">
            <div>Generato il: ${new Date().toLocaleDateString(window.shiftNetI18n.getLocale())}</div>
            <div style="font-size:11px; color:#64748b;">OrariLavoro App</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipologia</th>
              <th>Inizio</th>
              <th>Fine</th>
              <th>Pausa</th>
              <th>Ore</th>
              <th>Netto Stim.</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="8" style="text-align:center;">Nessun dato registrato.</td></tr>'}
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-card">
            <h4>Riepilogo Ore</h4>
            <p>Ore Ordinarie: ${summary.totalOrdinaryHours} h</p>
            <p>Ore Straordinari: ${summary.totalOvertimeHours} h</p>
            <p>Ferie & Permessi: ${summary.vacationHours + summary.permitHours + summary.sickHours} h</p>
            <p>Giorni Lavorati: ${summary.totalDaysWorked} gg</p>
          </div>
          <div class="summary-card">
            <h4>Riepilogo Economico Stimato</h4>
            <p>Totale Lordo: € ${summary.totalGross.toFixed(2)}</p>
            <p>Trattenute INPS (stima): - € ${summary.totalInps.toFixed(2)}</p>
            <p>Trattenute IRPEF (stima): - € ${summary.totalIrpef.toFixed(2)}</p>
            <p style="color:#059669; font-size:15px; margin-top:6px;">Netto Stimato: € ${summary.totalNet.toFixed(2)}</p>
          </div>
        </div>

        <div style="margin-top:40px; display:flex; justify-content:space-between; font-size:12px;">
          <div>Firma del Lavoratore: __________________________</div>
          <div>Firma del Datore di Lavoro: __________________________</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }

  backupToJson() {
    const fullBackup = {
      version: 1,
      createdAt: new Date().toISOString(),
      settings: this.store.settings,
      shifts: this.store.shifts,
      absences: this.store.absences,
      payslips: this.store.payslips
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `OrariLavoro_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();

    showToast('Backup JSON esportato con successo!', 'success');
  }

  handleRestoreFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.shifts && Array.isArray(data.shifts)) {
          this.store.shifts = data.shifts;
          this.store.save(STORAGE_KEYS.SHIFTS, data.shifts);
        }
        if (data.absences && Array.isArray(data.absences)) {
          this.store.absences = data.absences;
          this.store.save(STORAGE_KEYS.ABSENCES, data.absences);
        }
        if (data.settings) {
          this.store.settings = { ...this.store.settings, ...data.settings };
          this.store.save(STORAGE_KEYS.SETTINGS, this.store.settings);
        }
        if (data.payslips) {
          this.store.payslips = data.payslips;
          this.store.save(STORAGE_KEYS.PAYSLIPS, data.payslips);
        }

        this.store.notify('shiftsUpdated', this.store.shifts);
        this.store.notify('absencesUpdated', this.store.absences);
        this.store.notify('settingsChanged', this.store.settings);
        showToast('Dati ripristinati con successo!', 'success');
      } catch (err) {
        showToast('File di backup non valido o corrotto.', 'danger');
      }
    };
    reader.readAsText(file);
  }
}

