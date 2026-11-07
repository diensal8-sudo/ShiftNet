/**
 * app.js - Controller principale applicazione, routing delle sezioni e impostazioni
 */

// Funzione globale Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  if (type === 'success') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'warning') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  } else if (type === 'danger') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

class App {
  constructor() {
    this.store = appStore;
    this.currentTab = 'badge';

    // Inizializza Moduli
    this.clock = new ClockManager(this.store);
    this.calendar = new CalendarManager(this.store);
    this.finance = new FinanceManager(this.store);
    this.payslip = new PayslipScannerManager(this.store);
    this.reports = new ReportsManager(this.store);
    this.notifications = new NotificationManager(this.store);

    this.initNavigation();
    this.initSettingsView();
    this.initTheme();
    this.registerServiceWorker();
    document.addEventListener('shiftnet:locale-changed', () => {
      this.updateThemeUI(this.store.theme);
      this.clock.render();
      this.calendar.render();
      this.finance.render();
      this.reports.populateMonthOptions();
    });
  }

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Aggiorna classi nav
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Aggiorna sezioni visibili
    document.querySelectorAll('.view-section').forEach(section => {
      if (section.id === `view-${tabName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Se entriamo in finance o calendar o reports eseguiamo un refresh del render
    if (tabName === 'finance') this.finance.render();
    if (tabName === 'calendar') this.calendar.render();
    if (tabName === 'reports') this.reports.populateMonthOptions();
  }

  initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    const updateThemeUI = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      if (themeToggleBtn) {
        if (theme === 'dark') {
          themeToggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          `;
          themeToggleBtn.setAttribute('title', window.shiftNetI18n.t('switchToLightTheme'));
        } else {
          themeToggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <span class="theme-btn-text">${window.shiftNetI18n.t('darkTheme')}</span>
          `;
          themeToggleBtn.setAttribute('title', window.shiftNetI18n.t('switchToDarkTheme'));
        }
      }
    };

    this.updateThemeUI = updateThemeUI;
    updateThemeUI(this.store.theme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const newTheme = this.store.theme === 'dark' ? 'light' : 'dark';
        this.store.setTheme(newTheme);
        updateThemeUI(newTheme);
      });
    }
  }

  initSettingsView() {
    const form = document.getElementById('settingsForm');
    const settings = this.store.settings;

    // Popola input impostazioni
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setCheck = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };

    const initialGross = settings.hourlyGrossRate || 13.50;
    const initialInps = settings.inpsRate || 9.19;
    const initialTax = settings.estimatedTaxRate || 23.0;
    const initialNet = settings.hourlyNetRate || this.store.grossToNet(initialGross, initialInps, initialTax);

    setVal('cfgHourlyGross', initialGross);
    setVal('cfgHourlyNet', initialNet);
    setVal('cfgInpsRate', initialInps);
    setVal('cfgEstimatedTaxRate', initialTax);
    setVal('cfgContractType', settings.contractType);
    setVal('cfgWeeklyHours', settings.weeklyContractHours);
    const formatHoursDuration = (value) => {
      const parsedValue = this.store.parseHoursDuration(value, 8);
      return parsedValue.toFixed(2);
    };
    setVal('cfgDailyHours', formatHoursDuration(settings.dailyStandardHours));
    setVal('cfgDefaultPause', settings.dailyDefaultPauseMinutes || 0);
    setVal('cfgOvertimeDay', settings.overtimeDayRate);
    setVal('cfgOvertimeSunday', settings.overtimeSundayRate);
    setVal('cfgOvertimeNight', settings.overtimeNightRate);
    setVal('cfgOvertimeHoliday', settings.overtimeHolidayRate);
    setVal('cfgMealVoucher', settings.mealVoucherDaily);
    setVal('cfgTravelAllowance', settings.travelDailyAllowance);
    setCheck('cfgSound', settings.soundEnabled);
    setCheck('cfgVibration', settings.vibrationEnabled);

    // Sincronizzazione Live Bidirezionale Lordo <-> Netto
    const inputGross = document.getElementById('cfgHourlyGross');
    const inputNet = document.getElementById('cfgHourlyNet');
    const inputInps = document.getElementById('cfgInpsRate');
    const inputTax = document.getElementById('cfgEstimatedTaxRate');

    if (inputGross && inputNet) {
      // Quando l'utente modifica il lordo -> calcola il netto
      inputGross.addEventListener('input', () => {
        const grossVal = parseFloat(inputGross.value) || 0;
        const inpsVal = parseFloat(inputInps.value) || 9.19;
        const taxVal = parseFloat(inputTax.value) || 23.0;
        const calculatedNet = this.store.grossToNet(grossVal, inpsVal, taxVal);
        inputNet.value = calculatedNet > 0 ? calculatedNet : '';
      });

      // Quando l'utente modifica il netto -> calcola il lordo
      inputNet.addEventListener('input', () => {
        const netVal = parseFloat(inputNet.value) || 0;
        const inpsVal = parseFloat(inputInps.value) || 9.19;
        const taxVal = parseFloat(inputTax.value) || 23.0;
        const calculatedGross = this.store.netToGross(netVal, inpsVal, taxVal);
        inputGross.value = calculatedGross > 0 ? calculatedGross : '';
      });

      // Se cambiano le aliquote INPS o IRPEF -> ricalcola il netto a partire dal lordo
      const recalcFromRates = () => {
        const grossVal = parseFloat(inputGross.value) || 0;
        const inpsVal = parseFloat(inputInps.value) || 9.19;
        const taxVal = parseFloat(inputTax.value) || 23.0;
        const calculatedNet = this.store.grossToNet(grossVal, inpsVal, taxVal);
        inputNet.value = calculatedNet > 0 ? calculatedNet : '';
      };
      if (inputInps) inputInps.addEventListener('input', recalcFromRates);
      if (inputTax) inputTax.addEventListener('input', recalcFromRates);
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const grossVal = parseFloat(document.getElementById('cfgHourlyGross').value) || 12.0;
        const netVal = parseFloat(document.getElementById('cfgHourlyNet').value) || this.store.grossToNet(grossVal);

        const updated = {
          hourlyGrossRate: grossVal,
          hourlyNetRate: netVal,
          inpsRate: parseFloat(document.getElementById('cfgInpsRate').value) || 9.19,
          estimatedTaxRate: parseFloat(document.getElementById('cfgEstimatedTaxRate').value) || 23.0,
          contractType: document.getElementById('cfgContractType').value,
          weeklyContractHours: parseFloat(document.getElementById('cfgWeeklyHours').value) || 40,
          dailyStandardHours: this.store.parseHoursDuration(document.getElementById('cfgDailyHours').value, 8),
          dailyDefaultPauseMinutes: parseFloat(document.getElementById('cfgDefaultPause').value) || 0,
          overtimeDayRate: parseFloat(document.getElementById('cfgOvertimeDay').value) || 15,
          overtimeSundayRate: parseFloat(document.getElementById('cfgOvertimeSunday').value) || 15,
          overtimeNightRate: parseFloat(document.getElementById('cfgOvertimeNight').value) || 30,
          overtimeHolidayRate: parseFloat(document.getElementById('cfgOvertimeHoliday').value) || 30,
          mealVoucherDaily: parseFloat(document.getElementById('cfgMealVoucher').value) || 0,
          travelDailyAllowance: parseFloat(document.getElementById('cfgTravelAllowance').value) || 0,
          soundEnabled: document.getElementById('cfgSound').checked,
          vibrationEnabled: document.getElementById('cfgVibration').checked
        };

        this.store.updateSettings(updated);
        showToast('Impostazioni e tariffe salvate con successo!', 'success');
      });
    }

    const btnRequestNotif = document.getElementById('btnRequestNotif');
    if (btnRequestNotif) {
      btnRequestNotif.addEventListener('click', () => {
        this.notifications.requestPermission();
      });
    }

    // Pulsante Reset Demo Data
    const btnResetDemoData = document.getElementById('btnResetDemoData');
    if (btnResetDemoData) {
      btnResetDemoData.addEventListener('click', () => {
        if (confirm('Vuoi cancellare tutti i dati e ricaricare i dati di esempio?')) {
          const entryChoice = localStorage.getItem('shiftnet_entry_choice_v1');
          const locale = localStorage.getItem('shiftnet_locale_v1');
          localStorage.clear();
          if (entryChoice) localStorage.setItem('shiftnet_entry_choice_v1', entryChoice);
          if (locale) localStorage.setItem('shiftnet_locale_v1', locale);
          location.reload();
        }
      });
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Service Worker registrato con successo:', reg.scope))
          .catch(err => console.warn('Registrazione Service Worker non riuscita:', err));
      });
    }
  }
}

// Inizializza l'app al caricamento della pagina
window.addEventListener('DOMContentLoaded', () => {
  const startApp = () => {
    document.body.classList.remove('auth-required');
    if (!window.app) window.app = new App();
    window.authManager.updateAccountButton();
  };

  window.authManager = new AuthManager(startApp);
  window.authManager.initialize().catch((error) => {
    console.error('Errore inizializzazione accesso:', error);
    window.authManager.setFeedback(window.shiftNetI18n.t('authError'), 'error');
  });
});

