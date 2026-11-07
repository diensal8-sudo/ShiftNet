/**
 * calculator.js - Calcolatore Finanziario Lordo/Netto e Dashboard Statistiche
 */

class FinanceManager {
  constructor(store) {
    this.store = store;
    this.selectedYearMonth = this.getCurrentYearMonth();
    this.hoursChartInstance = null;
    this.earningsChartInstance = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  getCurrentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  initElements() {
    this.financeMonthSelect = document.getElementById('financeMonthSelect');
    
    // Indicatori Principali
    this.financeEstimatedNet = document.getElementById('financeEstimatedNet');
    this.financeTotalGross = document.getElementById('financeTotalGross');
    this.financeInpsDeduction = document.getElementById('financeInpsDeduction');
    this.financeTaxableBase = document.getElementById('financeTaxableBase');
    this.financeIrpefDeduction = document.getElementById('financeIrpefDeduction');
    this.financeAllowances = document.getElementById('financeAllowances');

    // Statistiche Ore
    this.financeWorkedHours = document.getElementById('financeWorkedHours');
    this.financeHourlyAverage = document.getElementById('financeHourlyAverage');
    this.financeOvertimeHours = document.getElementById('financeOvertimeHours');

    // Canvas Grafici
    this.hoursChartCanvas = document.getElementById('hoursChartCanvas');
    this.earningsChartCanvas = document.getElementById('earningsChartCanvas');
  }

  bindEvents() {
    if (this.financeMonthSelect) {
      this.populateMonthOptions();
      this.financeMonthSelect.addEventListener('change', (e) => {
        this.selectedYearMonth = e.target.value;
        this.render();
      });
    }

    this.store.on('shiftsUpdated', () => this.render());
    this.store.on('absencesUpdated', () => this.render());
    this.store.on('settingsChanged', () => this.render());
  }

  populateMonthOptions() {
    if (!this.financeMonthSelect) return;
    this.financeMonthSelect.innerHTML = '';

    const now = new Date();
    // Genera gli ultimi 12 mesi
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString(window.shiftNetI18n.getLocale(), { month: 'long', year: 'numeric' });
      
      const opt = document.createElement('option');
      opt.value = ym;
      opt.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      if (ym === this.selectedYearMonth) opt.selected = true;
      this.financeMonthSelect.appendChild(opt);
    }
  }

  render() {
    const summary = this.store.getMonthSummary(this.selectedYearMonth);
    const settings = this.store.settings;

    const taxable = summary.totalGross - summary.totalInps;
    const avgHourlyNet = summary.totalWorkedHours > 0 ? (summary.totalNet / summary.totalWorkedHours) : 0;

    // Aggiornamento DOM Indicatori
    if (this.financeEstimatedNet) this.financeEstimatedNet.textContent = `€ ${summary.totalNet.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (this.financeTotalGross) this.financeTotalGross.textContent = `€ ${summary.totalGross.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (this.financeInpsDeduction) this.financeInpsDeduction.textContent = `- € ${summary.totalInps.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${settings.inpsRate}%)`;
    if (this.financeTaxableBase) this.financeTaxableBase.textContent = `€ ${Math.max(0, taxable).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (this.financeIrpefDeduction) this.financeIrpefDeduction.textContent = `- € ${summary.totalIrpef.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${settings.estimatedTaxRate}%)`;
    if (this.financeAllowances) this.financeAllowances.textContent = `+ € ${summary.totalAllowances.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (this.financeWorkedHours) this.financeWorkedHours.textContent = `${summary.totalWorkedHours} ore`;
    if (this.financeHourlyAverage) this.financeHourlyAverage.textContent = `€ ${avgHourlyNet.toFixed(2)} /h`;
    if (this.financeOvertimeHours) this.financeOvertimeHours.textContent = `${summary.totalOvertimeHours} ore`;

    // Render Grafici
    this.renderCharts(summary);
  }

  renderCharts(summary) {
    if (typeof Chart === 'undefined') return;

    // Grafico 1: Ripartizione Ore Lavorate & Assenze (Doughnut)
    if (this.hoursChartCanvas) {
      const ctx = this.hoursChartCanvas.getContext('2d');
      if (this.hoursChartInstance) this.hoursChartInstance.destroy();

      const leavesTotal = summary.vacationHours + summary.permitHours + summary.sickHours;

      this.hoursChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Ordinarie', 'Straordinari', 'Notturne', 'Festive', 'Ferie & Assenze'],
          datasets: [{
            data: [
              summary.totalOrdinaryHours,
              summary.totalOvertimeHours,
              summary.totalNightHours,
              summary.totalHolidayHours,
              leavesTotal
            ],
            backgroundColor: [
              '#3b82f6', // blue
              '#f59e0b', // orange
              '#8b5cf6', // purple
              '#ec4899', // pink
              '#10b981'  // green
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94a3b8', boxWidth: 12, padding: 14 }
            }
          },
          cutout: '68%'
        }
      });
    }

    // Grafico 2: Composizione Stipendio Lordo -> Netto (Bar)
    if (this.earningsChartCanvas) {
      const ctx = this.earningsChartCanvas.getContext('2d');
      if (this.earningsChartInstance) this.earningsChartInstance.destroy();

      this.earningsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Lordo Totale', 'INPS (9.19%)', 'IRPEF Stima', 'Buoni/Welfare', 'Netto Stimato'],
          datasets: [{
            label: 'Importo (€)',
            data: [
              summary.totalGross,
              -summary.totalInps,
              -summary.totalIrpef,
              summary.totalAllowances,
              summary.totalNet
            ],
            backgroundColor: [
              '#60a5fa',
              '#f87171',
              '#fb923c',
              '#34d399',
              '#10b981'
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { display: false }
            },
            y: {
              ticks: {
                color: '#94a3b8',
                callback: (v) => '€ ' + v
              },
              grid: { color: 'rgba(255, 255, 255, 0.06)' }
            }
          }
        }
      });
    }
  }
}

