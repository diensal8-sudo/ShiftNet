/**
 * clock.js - Badge Digitale e Timbratrice Virtuale in tempo reale
 */

class ClockManager {
  constructor(store) {
    this.store = store;
    this.timerInterval = null;
    this.selectedShiftType = 'ordinario';
    this.currentLocation = null;

    this.initElements();
    this.bindEvents();
    this.startClockTick();
    this.render();
  }

  initElements() {
    this.currentTimeDisplay = document.getElementById('currentTimeDisplay');
    this.currentDateDisplay = document.getElementById('currentDateDisplay');
    this.punchBtn = document.getElementById('punchBtn');
    this.punchContainer = document.getElementById('punchContainer');
    this.punchActionLabel = document.getElementById('punchActionLabel');
    this.punchSubLabel = document.getElementById('punchSubLabel');
    this.punchIcon = document.getElementById('punchIcon');

    this.pauseBtn = document.getElementById('pauseBtn');
    this.quickNotesInput = document.getElementById('quickNotesInput');
    this.locationBtn = document.getElementById('locationBtn');
    this.locationStatus = document.getElementById('locationStatus');

    // Statistiche Live
    this.liveWorkedTime = document.getElementById('liveWorkedTime');
    this.livePauseTime = document.getElementById('livePauseTime');
    this.liveEarnings = document.getElementById('liveEarnings');

    // Chips selettori tipo turno
    this.shiftChips = document.querySelectorAll('.shift-chip');
  }

  bindEvents() {
    // Pulsante Principale Timbratrice
    if (this.punchBtn) {
      this.punchBtn.addEventListener('click', () => this.handleMainPunch());
    }

    // Pulsante Pausa
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.handlePauseToggle());
    }

    // Selettore Tipologia Turno
    this.shiftChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const type = chip.dataset.type;
        this.selectedShiftType = type;
        this.shiftChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        
        // Se c'è un turno attivo, aggiorna il tipo
        if (this.store.activeShift) {
          this.store.activeShift.type = type;
          this.store.save(STORAGE_KEYS.ACTIVE_SHIFT, this.store.activeShift);
          this.render();
        }
      });
    });

    // Geolocalizzazione opzionale
    if (this.locationBtn) {
      this.locationBtn.addEventListener('click', () => this.requestLocation());
    }

    // Listener Store
    this.store.on('shiftStarted', () => this.render());
    this.store.on('pauseToggled', () => this.render());
    this.store.on('shiftEnded', () => this.render());
    this.store.on('settingsChanged', () => this.render());
  }

  // Orologio in tempo reale e contatore sessione
  startClockTick() {
    const updateTime = () => {
      const now = new Date();
      
      // Aggiorna Orologio Principale (HH:MM:SS)
      if (this.currentTimeDisplay) {
        this.currentTimeDisplay.textContent = now.toLocaleTimeString(window.shiftNetI18n.getLocale(), { hour12: false });
      }
      
      // Aggiorna Data (Es: Lunedì, 24 Agosto 2026)
      if (this.currentDateDisplay) {
        this.currentDateDisplay.textContent = now.toLocaleDateString(window.shiftNetI18n.getLocale(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      // Se c'è un turno attivo, aggiorna i timer live della sessione
      if (this.store.activeShift) {
        this.updateLiveSessionCounters(now);
      }
    };

    updateTime();
    this.timerInterval = setInterval(updateTime, 1000);
  }

  updateLiveSessionCounters(now) {
    const active = this.store.activeShift;
    const startTime = new Date(active.startTime);
    
    let currentPauseMinutes = active.totalPauseMinutes || 0;
    if (active.isPaused && active.pauseStart) {
      const pauseStart = new Date(active.pauseStart);
      currentPauseMinutes += (now - pauseStart) / (1000 * 60);
    }

    const totalElapsedMs = now - startTime;
    const totalElapsedMinutes = totalElapsedMs / (1000 * 60);
    const workedMinutes = Math.max(0, totalElapsedMinutes - currentPauseMinutes);
    const workedHours = workedMinutes / 60;

    // Formatta tempo lavorato (HH:MM:SS)
    const hours = Math.floor(workedMinutes / 60);
    const minutes = Math.floor(workedMinutes % 60);
    const seconds = Math.floor((workedMinutes * 60) % 60);

    const formattedWorked = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Formatta tempo di pausa (MM:SS)
    const pauseMinInt = Math.floor(currentPauseMinutes);
    const pauseSecInt = Math.floor((currentPauseMinutes * 60) % 60);
    const formattedPause = `${String(pauseMinInt).padStart(2, '0')}:${String(pauseSecInt).padStart(2, '0')}`;

    if (this.liveWorkedTime) this.liveWorkedTime.textContent = formattedWorked;
    if (this.livePauseTime) this.livePauseTime.textContent = formattedPause;

    // Calcolo guadagno live stimato in tempo reale
    const earnings = this.store.calculateShiftEarnings(workedHours, active.type);
    if (this.liveEarnings) {
      this.liveEarnings.textContent = `€ ${earnings.netTotal.toFixed(2)}`;
    }
  }

  handleMainPunch() {
    this.playFeedback();

    if (!this.store.activeShift) {
      // CHECK-IN (Inizio Turno)
      const notes = this.quickNotesInput ? this.quickNotesInput.value.trim() : '';
      this.store.startShift(this.selectedShiftType, notes, this.currentLocation);
      showToast(window.shiftNetI18n.t('clockInSuccess'), 'success');
      if (this.quickNotesInput) this.quickNotesInput.value = '';
    } else {
      // CHECK-OUT (Fine Turno)
      const completed = this.store.endShift();
      if (completed) {
        showToast(window.shiftNetI18n.t('shiftCompleted', { hours: completed.totalHoursWorked, net: completed.financials.netTotal }), 'success');
      }
    }
  }

  handlePauseToggle() {
    this.playFeedback();
    if (!this.store.activeShift) return;

    const shift = this.store.togglePause();
    if (shift.isPaused) {
      showToast(window.shiftNetI18n.t('pauseStarted'), 'warning');
    } else {
      showToast(window.shiftNetI18n.t('pauseEnded'), 'success');
    }
  }

  requestLocation() {
    if (!navigator.geolocation) {
      showToast(window.shiftNetI18n.t('locationUnsupported'), 'danger');
      return;
    }

    if (this.locationStatus) this.locationStatus.textContent = window.shiftNetI18n.t('locationDetecting');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currentLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        if (this.locationStatus) {
          this.locationStatus.textContent = window.shiftNetI18n.t('locationDetected', { accuracy: Math.round(pos.coords.accuracy) });
        }
        showToast(window.shiftNetI18n.t('locationSaved'), 'success');
      },
      (err) => {
        if (this.locationStatus) this.locationStatus.textContent = window.shiftNetI18n.t('locationUnavailable');
        showToast(window.shiftNetI18n.t('locationFailed'), 'warning');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  playFeedback() {
    // Vibrazione tattile se supportata
    if (this.store.settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }
    // Suono timbratura sintetizzato con Web Audio API (senza bisogno di file esterni)
    if (this.store.settings.soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {
        // Silently catch audio restrictions
      }
    }
  }

  render() {
    const active = this.store.activeShift;

    if (!active) {
      // STATO INATTIVO (Pronto per Check-in)
      this.punchBtn.className = 'punch-btn';
      this.punchContainer.classList.remove('active-pulse');
      this.punchActionLabel.textContent = window.shiftNetI18n.t('clockIn');
      this.punchSubLabel.textContent = window.shiftNetI18n.t('tapToStart');
      this.punchIcon.innerHTML = `
        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/>
        <polyline points="12 6 12 12 16 14" stroke="currentColor" fill="none"/>
      `;

      if (this.pauseBtn) {
        this.pauseBtn.style.display = 'none';
        this.pauseBtn.classList.remove('pause-active');
      }

      if (this.liveWorkedTime) this.liveWorkedTime.textContent = '00:00:00';
      if (this.livePauseTime) this.livePauseTime.textContent = '00:00';
      if (this.liveEarnings) this.liveEarnings.textContent = '€ 0.00';

    } else if (active.isPaused) {
      // STATO IN PAUSA
      this.punchBtn.className = 'punch-btn paused';
      this.punchContainer.classList.remove('active-pulse');
      this.punchActionLabel.textContent = window.shiftNetI18n.t('clockOut');
      this.punchSubLabel.textContent = window.shiftNetI18n.t('pausedTapToResume');
      
      if (this.pauseBtn) {
        this.pauseBtn.style.display = 'inline-flex';
        this.pauseBtn.classList.add('pause-active');
        this.pauseBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Riprendi Turno
        `;
      }
    } else {
      // STATO IN LAVORO ATTIVO
      this.punchBtn.className = 'punch-btn working';
      this.punchContainer.classList.add('active-pulse');
      this.punchActionLabel.textContent = window.shiftNetI18n.t('clockOut');
      this.punchSubLabel.textContent = window.shiftNetI18n.t('workingTapToClockOut');
      this.punchIcon.innerHTML = `
        <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
      `;

      if (this.pauseBtn) {
        this.pauseBtn.style.display = 'inline-flex';
        this.pauseBtn.classList.remove('pause-active');
        this.pauseBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          Metti in Pausa
        `;
      }

      // Seleziona il chip del turno attivo
      if (active.type) {
        this.selectedShiftType = active.type;
        this.shiftChips.forEach(c => {
          if (c.dataset.type === active.type) c.classList.add('selected');
          else c.classList.remove('selected');
        });
      }
    }
  }
}

