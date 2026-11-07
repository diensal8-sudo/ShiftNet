/**
 * calendar.js - Vista Calendario Mensile, Gestione Turni, Ferie, Permessi e Malattia
 */

class CalendarManager {
  constructor(store) {
    this.store = store;
    this.currentDate = new Date();
    this.selectedDateStr = null;
    this.activeFilter = 'all';

    this.initElements();
    this.bindEvents();
    this.render();
  }

  formatHours(value) {
    return `${Number(value || 0).toFixed(2)}h`;
  }

  initElements() {
    this.calendarGrid = document.getElementById('calendarGrid');
    this.calendarMonthTitle = document.getElementById('calendarMonthTitle');
    this.prevMonthBtn = document.getElementById('prevMonthBtn');
    this.nextMonthBtn = document.getElementById('nextMonthBtn');
    this.todayBtn = document.getElementById('todayBtn');

    this.timelineList = document.getElementById('timelineList');
    this.timelineFilterSelect = document.getElementById('timelineFilterSelect');

    // Modali
    this.dayModal = document.getElementById('dayModal');
    this.dayModalTitle = document.getElementById('dayModalTitle');
    this.dayModalEventsList = document.getElementById('dayModalEventsList');
    this.closeDayModalBtn = document.getElementById('closeDayModalBtn');

    // Modale Aggiunta Turno Manuale
    this.shiftModal = document.getElementById('shiftModal');
    this.shiftModalForm = document.getElementById('shiftModalForm');
    this.closeShiftModalBtn = document.getElementById('closeShiftModalBtn');

    // Modale Aggiunta Assenza (Ferie/Malattia)
    this.absenceModal = document.getElementById('absenceModal');
    this.absenceModalForm = document.getElementById('absenceModalForm');
    this.closeAbsenceModalBtn = document.getElementById('closeAbsenceModalBtn');

    this.btnOpenAddShift = document.getElementById('btnOpenAddShift');
    this.btnOpenAddAbsence = document.getElementById('btnOpenAddAbsence');
  }

  bindEvents() {
    if (this.prevMonthBtn) {
      this.prevMonthBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      });
    }

    if (this.nextMonthBtn) {
      this.nextMonthBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      });
    }

    if (this.todayBtn) {
      this.todayBtn.addEventListener('click', () => {
        this.currentDate = new Date();
        this.render();
      });
    }

    if (this.timelineFilterSelect) {
      this.timelineFilterSelect.addEventListener('change', (e) => {
        this.activeFilter = e.target.value;
        this.renderTimeline();
      });
    }

    // Chiusura Modali
    if (this.closeDayModalBtn) {
      this.closeDayModalBtn.addEventListener('click', () => this.closeModal(this.dayModal));
    }
    if (this.closeShiftModalBtn) {
      this.closeShiftModalBtn.addEventListener('click', () => this.closeModal(this.shiftModal));
    }
    if (this.closeAbsenceModalBtn) {
      this.closeAbsenceModalBtn.addEventListener('click', () => this.closeModal(this.absenceModal));
    }

    // Apertura Form da Day Modal
    if (this.btnOpenAddShift) {
      this.btnOpenAddShift.addEventListener('click', () => {
        this.closeModal(this.dayModal);
        this.openShiftModal(this.selectedDateStr);
      });
    }

    if (this.btnOpenAddAbsence) {
      this.btnOpenAddAbsence.addEventListener('click', () => {
        this.closeModal(this.dayModal);
        this.openAbsenceModal(this.selectedDateStr);
      });
    }

    // Submit Form Turno Manuale
    if (this.shiftModalForm) {
      this.shiftModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveManualShift();
      });
    }

    // Submit Form Assenza
    if (this.absenceModalForm) {
      this.absenceModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveAbsence();
      });
    }

    // Listener Store
    this.store.on('shiftsUpdated', () => this.render());
    this.store.on('absencesUpdated', () => this.render());
    this.store.on('shiftEnded', () => this.render());
  }

  render() {
    this.renderCalendarGrid();
    this.renderTimeline();
    this.renderMonthStats();
  }

  renderCalendarGrid() {
    if (!this.calendarGrid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Aggiorna titolo mese
    if (this.calendarMonthTitle) {
      this.calendarMonthTitle.textContent = this.currentDate.toLocaleDateString(window.shiftNetI18n.getLocale(), {
        month: 'long',
        year: 'numeric'
      });
    }

    this.calendarGrid.innerHTML = '';

    // Intestazione giorni settimana (LUN - DOM)
    const locale = window.shiftNetI18n.getLocale();
    const weekDays = Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, index + 1))
    );
    weekDays.forEach(day => {
      const el = document.createElement('div');
      el.className = 'calendar-day-header';
      el.textContent = day;
      this.calendarGrid.appendChild(el);
    });

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Converti 0 (Dom) in 6
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Giorni mese precedente per completare la prima riga
    for (let i = firstDayIndex; i > 0; i--) {
      const dayNum = prevMonthDays - i + 1;
      const el = document.createElement('div');
      el.className = 'calendar-day other-month';
      el.innerHTML = `<span class="calendar-day-number">${dayNum}</span>`;
      this.calendarGrid.appendChild(el);
    }

    // Giorni del mese corrente
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayShifts = this.store.shifts.filter(s => s.date === dateStr);
      const dayAbsences = this.store.absences.filter(a => a.date === dateStr);

      const el = document.createElement('div');
      el.className = 'calendar-day';
      if (dateStr === todayStr) el.classList.add('today');

      let badgesHtml = '';
      
      // Badges turni
      dayShifts.forEach(shift => {
        const ordinaryHours = shift.ordinaryHours ?? shift.financials?.ordinaryHours;
        const overtimeHours = shift.overtimeHours ?? shift.financials?.overtimeHours;
        if (ordinaryHours > 0 && overtimeHours > 0) {
          badgesHtml += `<span class="day-badge badge-work">${this.formatHours(ordinaryHours)}</span>`;
          badgesHtml += `<span class="day-badge badge-overtime">⚡ +${this.formatHours(overtimeHours)} straordinario</span>`;
          return;
        }

        let badgeClass = 'badge-work';
        let label = this.formatHours(shift.totalHoursWorked);
        if (shift.type === 'straordinario' || shift.type === 'straordinario_domenicale') {
          badgeClass = 'badge-overtime';
          label = shift.type === 'straordinario_domenicale' ? `☀️ ${this.formatHours(shift.totalHoursWorked)}` : `⚡ ${this.formatHours(shift.totalHoursWorked)}`;
        } else if (shift.type === 'notturno') {
          badgeClass = 'badge-permit';
          label = `🌙 ${this.formatHours(shift.totalHoursWorked)}`;
        } else if (shift.type === 'festivo') {
          badgeClass = 'badge-holiday';
          label = `🎉 ${this.formatHours(shift.totalHoursWorked)}`;
        }
        badgesHtml += `<span class="day-badge ${badgeClass}">${label}</span>`;
      });

      // Badges assenze
      dayAbsences.forEach(abs => {
        let badgeClass = 'badge-vacation';
        let label = `${abs.type.toUpperCase()}`;
        if (abs.type === 'ferie') {
          badgeClass = 'badge-vacation';
          label = `🏖️ Ferie`;
        } else if (abs.type === 'permesso') {
          badgeClass = 'badge-permit';
          label = `⏱️ ROL`;
        } else if (abs.type === 'malattia') {
          badgeClass = 'badge-sick';
          label = `🩺 Malattia`;
        } else if (abs.type === 'giorno_libero') {
          badgeClass = 'badge-permit';
          label = `🏠 Giorno libero`;
        }
        badgesHtml += `<span class="day-badge ${badgeClass}">${label}</span>`;
      });

      el.innerHTML = `
        <span class="calendar-day-number">${day}</span>
        <div class="calendar-day-badges">${badgesHtml}</div>
      `;

      el.addEventListener('click', () => this.openDayModal(dateStr));
      this.calendarGrid.appendChild(el);
    }

    // Giorni mese successivo per completare la griglia
    const totalCells = firstDayIndex + totalDaysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const el = document.createElement('div');
      el.className = 'calendar-day other-month';
      el.innerHTML = `<span class="calendar-day-number">${i}</span>`;
      this.calendarGrid.appendChild(el);
    }
  }

  renderTimeline() {
    if (!this.timelineList) return;

    const yearMonth = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}`;
    let items = [];

    // Raccoglie tutti i turni del mese corrente
    this.store.shifts
      .filter(s => s.date.startsWith(yearMonth))
      .forEach(s => items.push({ type: 'shift', data: s, date: s.date, sortTime: new Date(s.startTime).getTime() }));

    // Raccoglie tutte le assenze del mese corrente
    this.store.absences
      .filter(a => a.date.startsWith(yearMonth))
      .forEach(a => items.push({ type: 'absence', data: a, date: a.date, sortTime: new Date(a.date).getTime() }));

    // Filtra in base al filtro attivo
    if (this.activeFilter === 'overtime') {
      items = items.filter(i => i.type === 'shift' && ['straordinario', 'straordinario_domenicale'].includes(i.data.type));
    } else if (this.activeFilter === 'leaves') {
      items = items.filter(i => i.type === 'absence');
    } else if (this.activeFilter === 'work') {
      items = items.filter(i => i.type === 'shift');
    }

    // Ordina per data decrescente
    items.sort((a, b) => b.sortTime - a.sortTime);

    if (items.length === 0) {
      this.timelineList.innerHTML = `
        <div style="text-align:center; padding: 30px; color: var(--text-muted);">
          Nessun evento o turno registrato per questo mese con i filtri selezionati.
        </div>
      `;
      return;
    }

    this.timelineList.innerHTML = items.map(item => {
      const dateObj = new Date(item.date);
      const dayNum = dateObj.getDate();
      const monthName = dateObj.toLocaleDateString(window.shiftNetI18n.getLocale(), { month: 'short' });

      if (item.type === 'shift') {
        const s = item.data;
        const startStr = new Date(s.startTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' });
        const endStr = s.endTime ? new Date(s.endTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }) : window.shiftNetI18n.t('inProgress');
        const typeLabel = s.type === 'straordinario_domenicale' ? 'Straordinario domenicale' : s.type.charAt(0).toUpperCase() + s.type.slice(1);
        const earningsStr = s.financials ? `€ ${s.financials.netTotal.toFixed(2)} netto` : '';
        const splitHours = s.ordinaryHours > 0 && s.overtimeHours > 0
          ? `${this.formatHours(s.ordinaryHours)} ordinarie + ${this.formatHours(s.overtimeHours)} straordinario`
          : `${this.formatHours(s.totalHoursWorked)} totali`;

        return `
          <div class="timeline-item">
            <div class="timeline-left">
              <div class="timeline-date-badge">
                <span class="timeline-date-day">${dayNum}</span>
                <span class="timeline-date-month">${monthName}</span>
              </div>
              <div class="timeline-info">
                <h4>Turno ${typeLabel}</h4>
                <p>${startStr} - ${endStr} ${s.totalPauseMinutes > 0 ? `(Pausa: ${s.totalPauseMinutes}m)` : ''}</p>
                ${s.notes ? `<p style="color:var(--text-muted); font-size:0.75rem;">📝 ${s.notes}</p>` : ''}
              </div>
            </div>
            <div class="timeline-right">
              <div class="timeline-hours">${splitHours}</div>
              <div class="timeline-earnings">${earningsStr}</div>
              <div style="margin-top: 4px;">
                <button class="btn-icon" style="display:inline-flex; width:28px; height:28px;" onclick="window.app.calendar.deleteShiftItem('${s.id}')" title="Elimina">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        const a = item.data;
        const typeLabel = a.type === 'ferie' ? '🏖️ Ferie' : a.type === 'permesso' ? '⏱️ Permesso / ROL' : a.type === 'giorno_libero' ? '🏠 Giorno libero' : '🩺 Malattia';
        return `
          <div class="timeline-item">
            <div class="timeline-left">
              <div class="timeline-date-badge" style="background: rgba(139, 92, 246, 0.15); color: #c084fc;">
                <span class="timeline-date-day">${dayNum}</span>
                <span class="timeline-date-month">${monthName}</span>
              </div>
              <div class="timeline-info">
                <h4>${typeLabel}</h4>
                <p>${a.hours} ore ${a.protocolNumber ? `| N° Prot. ${a.protocolNumber}` : ''}</p>
                ${a.notes ? `<p style="color:var(--text-muted); font-size:0.75rem;">📝 ${a.notes}</p>` : ''}
              </div>
            </div>
            <div class="timeline-right">
              <div class="timeline-hours" style="color: #c084fc;">${a.hours} ore</div>
              <div style="margin-top: 4px;">
                <button class="btn-icon" style="display:inline-flex; width:28px; height:28px;" onclick="window.app.calendar.deleteAbsenceItem('${a.id}')" title="Elimina">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }).join('');
  }

  renderMonthStats() {
    const yearMonth = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}`;
    const summary = this.store.getMonthSummary(yearMonth);

    const elTotalHours = document.getElementById('monthStatTotalHours');
    const elOvertime = document.getElementById('monthStatOvertime');
    const elLeaves = document.getElementById('monthStatLeaves');
    const elDays = document.getElementById('monthStatDays');

    if (elTotalHours) elTotalHours.textContent = `${summary.totalWorkedHours}h`;
    if (elOvertime) elOvertime.textContent = `${summary.totalOvertimeHours}h`;
    if (elLeaves) elLeaves.textContent = `${summary.vacationHours + summary.permitHours + summary.sickHours}h`;
    if (elDays) elDays.textContent = `${summary.totalDaysWorked} gg`;
  }

  // Modale Dettaglio Giorno
  openDayModal(dateStr) {
    this.selectedDateStr = dateStr;
    const dateObj = new Date(dateStr);
    
    if (this.dayModalTitle) {
      this.dayModalTitle.textContent = dateObj.toLocaleDateString(window.shiftNetI18n.getLocale(), {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    const dayShifts = this.store.shifts.filter(s => s.date === dateStr);
    const dayAbsences = this.store.absences.filter(a => a.date === dateStr);

    if (this.dayModalEventsList) {
      if (dayShifts.length === 0 && dayAbsences.length === 0) {
        this.dayModalEventsList.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:16px;">Nessun turno o evento registrato in questa data.</p>';
      } else {
        let html = '';
        dayShifts.forEach(s => {
          const start = new Date(s.startTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' });
          const end = s.endTime ? new Date(s.endTime).toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour: '2-digit', minute: '2-digit' }) : window.shiftNetI18n.t('inProgress');
          html += `
            <div style="background:var(--bg-input); padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>Turno ${s.type}</strong> (${this.formatHours(s.totalHoursWorked)})
                <div style="font-size:0.8rem; color:var(--text-secondary);">${start} - ${end}</div>
              </div>
              <button class="btn btn-outline" style="padding:6px 10px; font-size:0.8rem; color:var(--danger);" onclick="window.app.calendar.deleteShiftItem('${s.id}')">Elimina</button>
            </div>
          `;
        });

        dayAbsences.forEach(a => {
          html += `
            <div style="background:var(--bg-input); padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${a.type.toUpperCase()}</strong> (${a.hours} ore)
                ${a.protocolNumber ? `<div style="font-size:0.8rem; color:var(--text-secondary);">Prot. ${a.protocolNumber}</div>` : ''}
              </div>
              <button class="btn btn-outline" style="padding:6px 10px; font-size:0.8rem; color:var(--danger);" onclick="window.app.calendar.deleteAbsenceItem('${a.id}')">Elimina</button>
            </div>
          `;
        });

        this.dayModalEventsList.innerHTML = html;
      }
    }

    this.openModal(this.dayModal);
  }

  // Modale Aggiunta Turno Manuale
  openShiftModal(dateStr = null) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    document.getElementById('manualShiftDate').value = targetDate;
    document.getElementById('manualShiftStartTime').value = '08:00';
    document.getElementById('manualShiftEndTime').value = '17:00';
    document.getElementById('manualShiftPause').value = String(this.store.settings.dailyDefaultPauseMinutes || 0);
    document.getElementById('manualShiftType').value = 'ordinario';
    document.getElementById('manualShiftNotes').value = '';

    this.openModal(this.shiftModal);
  }

  handleSaveManualShift() {
    const shiftData = {
      date: document.getElementById('manualShiftDate').value,
      startTime: document.getElementById('manualShiftStartTime').value,
      endTime: document.getElementById('manualShiftEndTime').value,
      pauseMinutes: Number(document.getElementById('manualShiftPause').value || 0),
      type: document.getElementById('manualShiftType').value,
      notes: document.getElementById('manualShiftNotes').value
    };

    this.store.saveManualShift(shiftData);
    this.closeModal(this.shiftModal);
    showToast('Turno salvato con successo!', 'success');
  }

  // Modale Assenza
  openAbsenceModal(dateStr = null) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    document.getElementById('absenceDate').value = targetDate;
    document.getElementById('absenceType').value = 'ferie';
    document.getElementById('absenceHours').value = '8';
    document.getElementById('absenceProtocol').value = '';
    document.getElementById('absenceNotes').value = '';

    const absenceType = document.getElementById('absenceType');
    const absenceHours = document.getElementById('absenceHours');
    absenceType.onchange = () => {
      absenceHours.value = absenceType.value === 'giorno_libero' ? '0' : '8';
    };

    this.openModal(this.absenceModal);
  }

  handleSaveAbsence() {
    const absenceData = {
      date: document.getElementById('absenceDate').value,
      type: document.getElementById('absenceType').value,
      hours: Number(document.getElementById('absenceHours').value || 0),
      protocolNumber: document.getElementById('absenceProtocol').value,
      notes: document.getElementById('absenceNotes').value
    };

    this.store.saveAbsence(absenceData);
    this.closeModal(this.absenceModal);
    showToast('Assenza registrata con successo!', 'success');
  }

  deleteShiftItem(id) {
    if (confirm('Sei sicuro di voler eliminare questo turno?')) {
      this.store.deleteShift(id);
      this.closeModal(this.dayModal);
      showToast('Turno eliminato.', 'warning');
    }
  }

  deleteAbsenceItem(id) {
    if (confirm('Sei sicuro di voler eliminare questa assenza?')) {
      this.store.deleteAbsence(id);
      this.closeModal(this.dayModal);
      showToast('Assenza eliminata.', 'warning');
    }
  }

  openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }
}

