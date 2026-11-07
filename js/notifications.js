/**
 * notifications.js - Gestione notifiche promemoria timbratura e allarmi
 */

class NotificationManager {
  constructor(store) {
    this.store = store;
    this.checkInterval = null;
    this.init();
  }

  init() {
    // Controlla ogni 5 minuti se c'è un turno aperto da molte ore per ricordare il check-out
    this.checkInterval = setInterval(() => this.checkOpenShiftReminder(), 5 * 60 * 1000);
  }

  requestPermission() {
    if (!('Notification' in window)) {
      showToast('Il tuo browser non supporta le notifiche di sistema.', 'warning');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showToast('Notifiche promemoria abilitate!', 'success');
        this.sendNotification('OrariLavoro', 'Promemoria attivi per le tue timbrature.');
      } else {
        showToast('Notifiche non autorizzate.', 'warning');
      }
    });
  }

  sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'assets/icons/icon.svg'
      });
    } else {
      showToast(body, 'info');
    }
  }

  checkOpenShiftReminder() {
    const active = this.store.activeShift;
    if (!active || active.isPaused) return;

    const start = new Date(active.startTime);
    const now = new Date();
    const hoursElapsed = (now - start) / (1000 * 60 * 60);

    const maxHours = this.store.settings.autoCheckoutReminderHours || 9;
    if (hoursElapsed >= maxHours) {
      this.sendNotification(
        'Promemoria Timbratura Uscita',
        `Sei al lavoro da oltre ${Math.floor(hoursElapsed)} ore. Ricordati di effettuare il Check-out!`
      );
    }
  }
}

