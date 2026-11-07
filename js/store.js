/**
 * store.js - Gestione stato globale, persistenza e calcoli di base
 */

const STORAGE_KEYS = {
  SETTINGS: 'orari_lavoro_settings_v1',
  SHIFTS: 'orari_lavoro_shifts_v1',
  ABSENCES: 'orari_lavoro_absences_v1',
  ACTIVE_SHIFT: 'orari_lavoro_active_shift_v1',
  PAYSLIPS: 'orari_lavoro_payslips_v1',
  THEME: 'orari_lavoro_theme_v1'
};

// Impostazioni predefinite per il mercato e la fiscalità Italiana (CCNL & IRPEF)
const DEFAULT_SETTINGS = {
  contractType: 'variable', // 'variable' (turni variabili), 'fulltime' (40h/sett), 'parttime'
  weeklyContractHours: 40,
  dailyStandardHours: 8,
  dailyDefaultPauseMinutes: 0,
  
  // Parametri Economici
  hourlyGrossRate: 13.50, // Tariffa oraria lorda base (€)
  hourlyNetRate: 9.44, // Tariffa oraria netta base (€/ora stimata)
  inpsRate: 9.19, // % Contributi previdenziali a carico lavoratore (IVS)
  estimatedTaxRate: 23.0, // Aliquota IRPEF media stimata (%) o calcolo a scaglioni
  
  // Maggiorazioni Straordinari e Turni Speciali CCNL Italia
  overtimeDayRate: 15, // Straordinario diurno (+15%)
  overtimeSundayRate: 15, // Straordinario domenicale (+15%)
  overtimeNightRate: 30, // Straordinario notturno (+30%)
  overtimeHolidayRate: 30, // Straordinario festivo (+30%)
  overtimeNightHolidayRate: 60, // Straordinario notturno festivo (+60%)
  nightShiftAllowance: 20, // Turno ordinario notturno (+20%)
  
  // Indennità & Welfare
  mealVoucherDaily: 7.00, // Buono pasto al giorno (€)
  travelDailyAllowance: 15.00, // Indennità giornaliera trasferta (€)
  
  // Notifiche & Promemoria
  soundEnabled: true,
  vibrationEnabled: true,
  autoCheckoutReminderHours: 9
};

class Store {
  constructor() {
    const storedSettings = this.load(STORAGE_KEYS.SETTINGS, {});
    this.settings = { ...DEFAULT_SETTINGS, ...storedSettings };
    if (!Object.prototype.hasOwnProperty.call(storedSettings, 'dailyDefaultPauseMinutes') || !Object.prototype.hasOwnProperty.call(storedSettings, 'overtimeSundayRate') || storedSettings.overtimeHolidayRate === 50) {
      this.settings.dailyDefaultPauseMinutes = storedSettings.dailyDefaultPauseMinutes ?? 0;
      this.settings.overtimeSundayRate = storedSettings.overtimeSundayRate ?? 15;
      this.settings.overtimeHolidayRate = storedSettings.overtimeHolidayRate === 50 ? 30 : this.settings.overtimeHolidayRate;
      this.save(STORAGE_KEYS.SETTINGS, this.settings);
    }
    this.shifts = this.load(STORAGE_KEYS.SHIFTS, []);
    this.migrateShiftDurations();
    this.absences = this.load(STORAGE_KEYS.ABSENCES, []);
    this.activeShift = this.load(STORAGE_KEYS.ACTIVE_SHIFT, null);
    this.payslips = this.load(STORAGE_KEYS.PAYSLIPS, []);
    this.theme = this.load(STORAGE_KEYS.THEME, 'dark');

    // Se non ci sono dati, aggiungiamo dei turni di esempio per rendere l'app subito esplorabile
    if (this.shifts.length === 0 && this.absences.length === 0) {
      this.seedInitialDemoData();
    }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Errore caricamento da storage per ${key}:`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if (window.authManager) window.authManager.scheduleSync();
    } catch (e) {
      console.error(`Errore salvataggio storage per ${key}:`, e);
    }
  }

  getCloudSnapshot() {
    return Object.values(STORAGE_KEYS).reduce((snapshot, key) => {
      snapshot[key] = this.load(key, null);
      return snapshot;
    }, {});
  }

  restoreCloudSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return;

    Object.values(STORAGE_KEYS).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
        localStorage.setItem(key, JSON.stringify(snapshot[key]));
      }
    });

    this.settings = { ...DEFAULT_SETTINGS, ...this.load(STORAGE_KEYS.SETTINGS, {}) };
    this.shifts = this.load(STORAGE_KEYS.SHIFTS, []);
    this.absences = this.load(STORAGE_KEYS.ABSENCES, []);
    this.activeShift = this.load(STORAGE_KEYS.ACTIVE_SHIFT, null);
    this.payslips = this.load(STORAGE_KEYS.PAYSLIPS, []);
    this.theme = this.load(STORAGE_KEYS.THEME, 'dark');
  }

  // Conversioni Bidirezionali Lordo <-> Netto per l'Italia
  grossToNet(gross, inpsRate = this.settings.inpsRate, taxRate = this.settings.estimatedTaxRate) {
    const inps = gross * (inpsRate / 100);
    const taxable = gross - inps;
    const irpef = taxable * (taxRate / 100);
    return Number((taxable - irpef).toFixed(2));
  }

  netToGross(net, inpsRate = this.settings.inpsRate, taxRate = this.settings.estimatedTaxRate) {
    const inpsFactor = 1 - (inpsRate / 100);
    const taxFactor = 1 - (taxRate / 100);
    const denominator = inpsFactor * taxFactor;
    if (denominator <= 0) return net;
    return Number((net / denominator).toFixed(2));
  }

  parseHoursDuration(value, fallback = 8) {
    if (typeof value === 'string') {
      const normalized = value.trim().replace(',', ':');
      const parts = normalized.split(':');
      if (parts.length === 2 && parts[0] !== '' && parts[1] !== '') {
        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);
        if (Number.isFinite(hours) && Number.isFinite(minutes) && minutes >= 0 && minutes < 60) {
          return hours + (minutes / 60);
        }
      }
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0) return fallback;

    const wholeHours = Math.floor(numericValue);
    const decimalPart = numericValue - wholeHours;
    const minutesAsDecimal = Math.round(decimalPart * 100);
    if (decimalPart > 0 && minutesAsDecimal < 60) {
      return wholeHours + (minutesAsDecimal / 60);
    }

    // Compatibilita con il vecchio valore mostrato come 6.67 per 6 ore e 40 minuti.
    if (Math.round(numericValue * 100) === 667) return 6 + (40 / 60);
    return numericValue;
  }

  migrateShiftDurations() {
    let changed = false;
    this.shifts = this.shifts.map((shift) => {
      if (!shift.startTime || !shift.endTime) return shift;

      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return shift;

      const elapsedMinutes = Math.round((end - start) / (1000 * 60));
      const workedMinutes = Math.max(0, elapsedMinutes - Number(shift.totalPauseMinutes || 0));
      const workedHours = workedMinutes / 60;
      const requestedType = shift.type === 'straordinario' && shift.ordinaryHours > 0 ? 'ordinario' : shift.type;
      const classification = this.classifyShift(shift.date, workedHours, requestedType);
      const updatedShift = {
        ...shift,
        type: classification.type,
        totalMinutesWorked: workedMinutes,
        totalHoursWorked: Number(workedHours.toFixed(2)),
        ordinaryHours: classification.ordinaryHours,
        overtimeHours: classification.overtimeHours,
        financials: this.calculateShiftEarnings(workedHours, classification.type, null, classification.ordinaryHours, classification.overtimeHours)
      };

      if (JSON.stringify(updatedShift) !== JSON.stringify(shift)) changed = true;
      return updatedShift;
    });

    if (changed) this.save(STORAGE_KEYS.SHIFTS, this.shifts);
  }

  // --- GESTIONE IMPOSTAZIONI ---
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    this.notify('settingsChanged', this.settings);
  }

  setTheme(theme) {
    this.theme = theme;
    this.save(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- GESTIONE TURNI & TIMBRATRICE ---
  startShift(type = 'ordinario', notes = '', location = null) {
    const now = new Date();
    this.activeShift = {
      id: 'shift_' + Date.now(),
      startTime: now.toISOString(),
      date: now.toISOString().split('T')[0],
      type: type, // 'ordinario', 'straordinario', 'notturno', 'festivo', 'smart', 'trasferta'
      notes: notes,
      location: location,
      isPaused: false,
      pauseStart: null,
      totalPauseMinutes: 0,
      pauseLogs: []
    };
    this.save(STORAGE_KEYS.ACTIVE_SHIFT, this.activeShift);
    this.notify('shiftStarted', this.activeShift);
    return this.activeShift;
  }

  togglePause() {
    if (!this.activeShift) return null;
    const now = new Date();

    if (!this.activeShift.isPaused) {
      // Entra in pausa
      this.activeShift.isPaused = true;
      this.activeShift.pauseStart = now.toISOString();
    } else {
      // Esce dalla pausa
      const startPause = new Date(this.activeShift.pauseStart);
      const pauseDurationMin = Math.round((now - startPause) / (1000 * 60));
      this.activeShift.totalPauseMinutes = (this.activeShift.totalPauseMinutes || 0) + pauseDurationMin;
      this.activeShift.pauseLogs.push({
        start: this.activeShift.pauseStart,
        end: now.toISOString(),
        minutes: pauseDurationMin
      });
      this.activeShift.isPaused = false;
      this.activeShift.pauseStart = null;
    }

    this.save(STORAGE_KEYS.ACTIVE_SHIFT, this.activeShift);
    this.notify('pauseToggled', this.activeShift);
    return this.activeShift;
  }

  endShift() {
    if (!this.activeShift) return null;
    const now = new Date();
    
    // Se era in pausa, chiudiamo l'ultima pausa
    if (this.activeShift.isPaused && this.activeShift.pauseStart) {
      const startPause = new Date(this.activeShift.pauseStart);
      const pauseDurationMin = Math.round((now - startPause) / (1000 * 60));
      this.activeShift.totalPauseMinutes = (this.activeShift.totalPauseMinutes || 0) + pauseDurationMin;
      this.activeShift.isPaused = false;
    }

    const start = new Date(this.activeShift.startTime);
    const totalMinutesElapsed = Math.round((now - start) / (1000 * 60));
    const workedMinutes = Math.max(0, totalMinutesElapsed - (this.activeShift.totalPauseMinutes || 0));
    const workedHours = workedMinutes / 60;

    const shiftClassification = this.classifyShift(this.activeShift.date, workedHours, this.activeShift.type);
    const completedShift = {
      ...this.activeShift,
      type: shiftClassification.type,
      ordinaryHours: shiftClassification.ordinaryHours,
      overtimeHours: shiftClassification.overtimeHours,
      endTime: now.toISOString(),
      totalMinutesWorked: workedMinutes,
      totalHoursWorked: Number(workedHours.toFixed(2)),
      financials: this.calculateShiftEarnings(
        workedHours,
        shiftClassification.type,
        null,
        shiftClassification.ordinaryHours,
        shiftClassification.overtimeHours
      )
    };

    this.shifts.unshift(completedShift);
    this.save(STORAGE_KEYS.SHIFTS, this.shifts);

    this.activeShift = null;
    this.save(STORAGE_KEYS.ACTIVE_SHIFT, null);

    this.notify('shiftEnded', completedShift);
    return completedShift;
  }

  // Aggiunta o modifica manuale di un turno
  saveManualShift(shiftData) {
    // shiftData: { id, date, startTime, endTime, pauseMinutes, type, notes, hourlyRateOverride }
    const start = new Date(`${shiftData.date}T${shiftData.startTime}`);
    let end = new Date(`${shiftData.date}T${shiftData.endTime}`);
    
    // Se l'orario di fine è precedente all'inizio, supponiamo il turno finisca il giorno successivo (turno notturno)
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const totalMinutesElapsed = Math.round((end - start) / (1000 * 60));
    const pauseMin = Number(shiftData.pauseMinutes || 0);
    const workedMinutes = Math.max(0, totalMinutesElapsed - pauseMin);
    const workedHours = workedMinutes / 60;
    const shiftClassification = this.classifyShift(shiftData.date, workedHours, shiftData.type);

    const shift = {
      id: shiftData.id || ('shift_' + Date.now()),
      date: shiftData.date,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      type: shiftClassification.type,
      notes: shiftData.notes || '',
      totalPauseMinutes: pauseMin,
      totalMinutesWorked: workedMinutes,
      totalHoursWorked: Number(workedHours.toFixed(2)),
      ordinaryHours: shiftClassification.ordinaryHours,
      overtimeHours: shiftClassification.overtimeHours,
      financials: this.calculateShiftEarnings(
        workedHours,
        shiftClassification.type,
        shiftData.hourlyRateOverride,
        shiftClassification.ordinaryHours,
        shiftClassification.overtimeHours
      )
    };

    const index = this.shifts.findIndex(s => s.id === shift.id);
    if (index >= 0) {
      this.shifts[index] = shift;
    } else {
      this.shifts.unshift(shift);
    }

    // Ordina per data discendente
    this.shifts.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    this.save(STORAGE_KEYS.SHIFTS, this.shifts);
    this.notify('shiftsUpdated', this.shifts);
    return shift;
  }

  deleteShift(id) {
    this.shifts = this.shifts.filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SHIFTS, this.shifts);
    this.notify('shiftsUpdated', this.shifts);
  }

  // --- GESTIONE ASSENZE (FERIE, PERMESSI / ROL, MALATTIA) ---
  saveAbsence(absenceData) {
    // absenceData: { id, date, type: 'ferie' | 'permesso' | 'malattia' | 'festivita', hours: 8, protocolNumber: '', notes: '' }
    const absence = {
      id: absenceData.id || ('absence_' + Date.now()),
      date: absenceData.date,
      type: absenceData.type,
      hours: Number(absenceData.hours ?? 8),
      protocolNumber: absenceData.protocolNumber || '',
      notes: absenceData.notes || '',
      financials: this.calculateAbsenceEarnings(Number(absenceData.hours ?? 8), absenceData.type)
    };

    const index = this.absences.findIndex(a => a.id === absence.id);
    if (index >= 0) {
      this.absences[index] = absence;
    } else {
      this.absences.unshift(absence);
    }

    this.absences.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.save(STORAGE_KEYS.ABSENCES, this.absences);
    this.notify('absencesUpdated', this.absences);
    return absence;
  }

  deleteAbsence(id) {
    this.absences = this.absences.filter(a => a.id !== id);
    this.save(STORAGE_KEYS.ABSENCES, this.absences);
    this.notify('absencesUpdated', this.absences);
  }

  // --- CALCOLATORE RETRIBUTIVO (LORDO / NETTO / MAGGIORAZIONI) ---
  classifyShift(date, hours, requestedType = 'ordinario') {
    const dayOfWeek = new Date(`${date}T12:00:00`).getDay();
    const dailyStandardHours = this.parseHoursDuration(this.settings.dailyStandardHours, 8);
    const isSunday = dayOfWeek === 0;
    if (requestedType === 'festivo' || requestedType === 'notturno_festivo') {
      return { type: requestedType, ordinaryHours: 0, overtimeHours: hours };
    }

    if (isSunday && ['ordinario', 'straordinario'].includes(requestedType)) {
      return { type: 'straordinario_domenicale', ordinaryHours: 0, overtimeHours: hours };
    }

    if (requestedType === 'ordinario' && hours > dailyStandardHours) {
      return {
        type: 'straordinario',
        ordinaryHours: dailyStandardHours,
        overtimeHours: hours - dailyStandardHours
      };
    }

    if (requestedType === 'straordinario') {
      return { type: requestedType, ordinaryHours: 0, overtimeHours: hours };
    }

    return { type: requestedType || 'ordinario', ordinaryHours: hours, overtimeHours: 0 };
  }

  calculateShiftEarnings(hours, shiftType = 'ordinario', customRate = null, ordinaryHours = null, overtimeHours = null) {
    const baseRate = customRate ? Number(customRate) : Number(this.settings.hourlyGrossRate);
    let multiplier = 1.0;

    switch (shiftType) {
      case 'straordinario':
        multiplier = 1 + (this.settings.overtimeDayRate / 100);
        break;
      case 'straordinario_domenicale':
        multiplier = 1 + (this.settings.overtimeSundayRate / 100);
        break;
      case 'notturno':
        multiplier = 1 + (this.settings.nightShiftAllowance / 100);
        break;
      case 'festivo':
        multiplier = 1 + (this.settings.overtimeHolidayRate / 100);
        break;
      case 'notturno_festivo':
        multiplier = 1 + (this.settings.overtimeNightHolidayRate / 100);
        break;
      case 'trasferta':
        multiplier = 1.0;
        break;
      default:
        multiplier = 1.0;
        break;
    }

    const hasSplitHours = ordinaryHours !== null && overtimeHours !== null;
    const calculatedOrdinaryHours = hasSplitHours ? Number(ordinaryHours) : (shiftType === 'ordinario' ? hours : 0);
    const calculatedOvertimeHours = hasSplitHours ? Number(overtimeHours) : (shiftType === 'ordinario' ? 0 : hours);
    const ordinaryGross = calculatedOrdinaryHours * baseRate;
    const overtimeGross = calculatedOvertimeHours * baseRate * multiplier;
    const grossTotal = ordinaryGross + overtimeGross;
    const effectiveHourlyGross = hours > 0 ? grossTotal / hours : baseRate;
    
    // Calcolo indennità giornaliere (buono pasto e trasferta se turno > 4h)
    let allowances = 0;
    if (hours >= 4) {
      if (this.settings.mealVoucherDaily > 0) {
        allowances += Number(this.settings.mealVoucherDaily);
      }
      if (shiftType === 'trasferta' && this.settings.travelDailyAllowance > 0) {
        allowances += Number(this.settings.travelDailyAllowance);
      }
    }

    // Stima Netto (Detrazione INPS ~9.19% + IRPEF media stimata)
    const inpsDeduction = grossTotal * (this.settings.inpsRate / 100);
    const taxableBase = grossTotal - inpsDeduction;
    const irpefDeduction = taxableBase * (this.settings.estimatedTaxRate / 100);
    const netTotal = (taxableBase - irpefDeduction) + allowances;

    return {
      hours,
      ordinaryHours: Number(calculatedOrdinaryHours.toFixed(2)),
      overtimeHours: Number(calculatedOvertimeHours.toFixed(2)),
      baseRate,
      multiplier,
      effectiveHourlyGross: Number(effectiveHourlyGross.toFixed(2)),
      grossTotal: Number(grossTotal.toFixed(2)),
      inpsDeduction: Number(inpsDeduction.toFixed(2)),
      irpefDeduction: Number(irpefDeduction.toFixed(2)),
      allowances: Number(allowances.toFixed(2)),
      netTotal: Number(netTotal.toFixed(2))
    };
  }

  calculateAbsenceEarnings(hours, absenceType) {
    const baseRate = Number(this.settings.hourlyGrossRate);
    const grossTotal = hours * baseRate;
    const inpsDeduction = grossTotal * (this.settings.inpsRate / 100);
    const taxableBase = grossTotal - inpsDeduction;
    const irpefDeduction = taxableBase * (this.settings.estimatedTaxRate / 100);
    const netTotal = taxableBase - irpefDeduction;

    return {
      hours,
      grossTotal: Number(grossTotal.toFixed(2)),
      netTotal: Number(netTotal.toFixed(2))
    };
  }

  // Calcolo aggregato mensile per un mese/anno specificato (es. '2026-08')
  getMonthSummary(yearMonth) {
    const monthlyShifts = this.shifts.filter(s => s.date.startsWith(yearMonth));
    const monthlyAbsences = this.absences.filter(a => a.date.startsWith(yearMonth));

    let totalOrdinaryHours = 0;
    let totalOvertimeHours = 0;
    let totalNightHours = 0;
    let totalHolidayHours = 0;
    let totalWorkedHours = 0;
    let totalDaysWorked = new Set(monthlyShifts.map(s => s.date)).size;

    let totalGross = 0;
    let totalNet = 0;
    let totalAllowances = 0;
    let totalInps = 0;
    let totalIrpef = 0;

    monthlyShifts.forEach(shift => {
      totalWorkedHours += shift.totalHoursWorked;
      if (shift.type === 'straordinario') {
        totalOvertimeHours += shift.financials?.overtimeHours ?? shift.totalHoursWorked;
        totalOrdinaryHours += shift.financials?.ordinaryHours ?? 0;
      }
      else if (shift.type === 'notturno') totalNightHours += shift.totalHoursWorked;
      else if (shift.type === 'straordinario_domenicale') totalOvertimeHours += shift.totalHoursWorked;
      else if (shift.type === 'festivo') totalHolidayHours += shift.totalHoursWorked;
      else totalOrdinaryHours += shift.totalHoursWorked;

      if (shift.financials) {
        totalGross += shift.financials.grossTotal;
        totalNet += shift.financials.netTotal;
        totalAllowances += shift.financials.allowances || 0;
        totalInps += shift.financials.inpsDeduction;
        totalIrpef += shift.financials.irpefDeduction;
      }
    });

    let vacationHours = 0;
    let permitHours = 0;
    let sickHours = 0;

    monthlyAbsences.forEach(abs => {
      if (abs.type === 'ferie') vacationHours += abs.hours;
      else if (abs.type === 'permesso') permitHours += abs.hours;
      else if (abs.type === 'malattia') sickHours += abs.hours;

      if (abs.financials) {
        totalGross += abs.financials.grossTotal;
        totalNet += abs.financials.netTotal;
      }
    });

    return {
      yearMonth,
      totalDaysWorked,
      totalWorkedHours: Number(totalWorkedHours.toFixed(2)),
      totalOrdinaryHours: Number(totalOrdinaryHours.toFixed(2)),
      totalOvertimeHours: Number(totalOvertimeHours.toFixed(2)),
      totalNightHours: Number(totalNightHours.toFixed(2)),
      totalHolidayHours: Number(totalHolidayHours.toFixed(2)),
      vacationHours: Number(vacationHours.toFixed(2)),
      permitHours: Number(permitHours.toFixed(2)),
      sickHours: Number(sickHours.toFixed(2)),
      totalGross: Number(totalGross.toFixed(2)),
      totalNet: Number(totalNet.toFixed(2)),
      totalAllowances: Number(totalAllowances.toFixed(2)),
      totalInps: Number(totalInps.toFixed(2)),
      totalIrpef: Number(totalIrpef.toFixed(2))
    };
  }

  // --- GESTIONE BUSTE PAGA ARCHIVIATE ---
  savePayslip(payslipData) {
    const payslip = {
      id: payslipData.id || ('payslip_' + Date.now()),
      createdAt: new Date().toISOString(),
      ...payslipData
    };
    const index = this.payslips.findIndex(p => p.id === payslip.id);
    if (index >= 0) {
      this.payslips[index] = payslip;
    } else {
      this.payslips.unshift(payslip);
    }
    this.save(STORAGE_KEYS.PAYSLIPS, this.payslips);
    this.notify('payslipsUpdated', this.payslips);
    return payslip;
  }

  deletePayslip(id) {
    this.payslips = this.payslips.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PAYSLIPS, this.payslips);
    this.notify('payslipsUpdated', this.payslips);
  }

  // --- PUB/SUB NOTIFICHE EVENTI ---
  listeners = {};
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // Genera dati di esempio per il mese corrente per test immediato
  seedInitialDemoData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Crea alcuni turni nei giorni scorsi del mese
    const currentDay = now.getDate();
    const sampleDays = Math.min(currentDay - 1, 15);

    for (let day = 1; day <= Math.max(sampleDays, 5); day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(dateStr).getDay();
      
      // Salta le domeniche (giorno 0) o inseriscile come festivo
      if (dayOfWeek === 0) continue;

      let type = 'ordinario';
      let startHour = 8;
      let endHour = 17;
      let pauseMin = 60;

      if (day % 4 === 0) {
        type = 'straordinario';
        endHour = 19; // 10 ore
      } else if (day === 7) {
        // Ferie
        this.saveAbsence({
          date: dateStr,
          type: 'ferie',
          hours: 8,
          notes: 'Ferie programmate'
        });
        continue;
      }

      this.saveManualShift({
        date: dateStr,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(endHour).padStart(2, '0')}:00`,
        pauseMinutes: pauseMin,
        type: type,
        notes: type === 'straordinario' ? 'Chiusura commessa / straordinario' : 'Turno standard'
      });
    }
  }
}

const appStore = new Store();

