(() => {
	const messages = {
		it: {
			language: 'Lingua', welcome: 'Bentornato', createTitle: 'Crea il tuo account',
			subtitle: 'Accedi per ritrovare i tuoi turni su tutti i dispositivi.',
			login: 'Accedi', register: 'Registrati', name: 'Nome', email: 'Email', password: 'Password',
			createAccount: 'Crea account', continueOffline: 'Continua senza account',
			notConfigured: 'Accesso cloud non configurato. Inserisci URL e chiave anonima Supabase in js/supabase-config.js.',
			signOut: 'Esci', signIn: 'Accedi', loading: 'Caricamento dei tuoi dati...',
			verifyEmail: 'Controlla la tua email per confermare la registrazione.', inProgress: 'In corso',
			cloudError: 'Impossibile caricare i dati cloud. Controlla la tabella Supabase e la connessione.',
			authError: 'Accesso non riuscito. Verifica email e password.',
			registerError: 'Registrazione non riuscita. Controlla i dati inseriti.',
			syncError: 'Sincronizzazione non riuscita. I dati restano salvati su questo dispositivo.',
			syncing: 'Sincronizzazione in corso...', clockIn: 'CHECK-IN', clockOut: 'CHECK-OUT', tapToStart: 'Tocca per iniziare il turno',
			pausedTapToResume: 'In Pausa (Tocca per terminare)', workingTapToClockOut: 'In corso (Tocca per timbrare uscita)',
			clockInSuccess: 'Timbratura di ENTRATA registrata con successo!', shiftCompleted: 'Turno concluso! Ore lavorate: {hours}h | Guadagno netto stimato: €{net}',
			pauseStarted: 'Pausa iniziata. Il conteggio ore è sospeso.', pauseEnded: 'Pausa terminata. Conteggio ore ripreso.',
			locationUnsupported: 'Geolocalizzazione non supportata dal browser.', locationDetecting: 'Rilevamento posizione...',
			locationDetected: 'Posizione rilevata (±{accuracy}m)', locationSaved: 'Posizione GPS salvata per la timbratura.',
			locationUnavailable: 'Posizione non disponibile', locationFailed: 'Impossibile ottenere la posizione GPS.',
			darkTheme: 'Tema Scuro', switchToLightTheme: 'Passa al Tema Chiaro', switchToDarkTheme: 'Passa al Tema Scuro'
		},
		en: {
			language: 'Language', welcome: 'Welcome back', createTitle: 'Create your account',
			subtitle: 'Sign in to access your shifts on all your devices.',
			login: 'Sign in', register: 'Sign up', name: 'Name', email: 'Email', password: 'Password',
			createAccount: 'Create account', continueOffline: 'Continue without an account',
			notConfigured: 'Cloud access is not configured. Add your Supabase URL and anon key in js/supabase-config.js.',
			signOut: 'Sign out', signIn: 'Sign in', loading: 'Loading your data...',
			verifyEmail: 'Check your email to confirm your registration.', inProgress: 'In progress',
			cloudError: 'Could not load cloud data. Check the Supabase table and your connection.',
			authError: 'Sign-in failed. Check your email and password.',
			registerError: 'Sign-up failed. Check the information you entered.',
			syncError: 'Sync failed. Your data is still saved on this device.',
			syncing: 'Syncing...', clockIn: 'CLOCK IN', clockOut: 'CLOCK OUT', tapToStart: 'Tap to start your shift',
			pausedTapToResume: 'On break (tap to resume)', workingTapToClockOut: 'In progress (tap to clock out)',
			clockInSuccess: 'Clock-in recorded successfully!', shiftCompleted: 'Shift complete! Hours worked: {hours}h | Estimated net pay: €{net}',
			pauseStarted: 'Break started. Work time is paused.', pauseEnded: 'Break ended. Work time has resumed.',
			locationUnsupported: 'Geolocation is not supported by this browser.', locationDetecting: 'Finding your location...',
			locationDetected: 'Location found (±{accuracy}m)', locationSaved: 'GPS location saved for this shift.',
			locationUnavailable: 'Location unavailable', locationFailed: 'Could not get your GPS location.',
			darkTheme: 'Dark theme', switchToLightTheme: 'Switch to light theme', switchToDarkTheme: 'Switch to dark theme'
		},
		es: {
			language: 'Idioma', welcome: 'Te damos la bienvenida', createTitle: 'Crea tu cuenta',
			subtitle: 'Inicia sesión para consultar tus turnos en todos tus dispositivos.',
			login: 'Iniciar sesión', register: 'Registrarse', name: 'Nombre', email: 'Correo electrónico', password: 'Contraseña',
			createAccount: 'Crear cuenta', continueOffline: 'Continuar sin cuenta',
			notConfigured: 'El acceso en la nube no está configurado. Añade la URL y la clave anon de Supabase en js/supabase-config.js.',
			signOut: 'Cerrar sesión', signIn: 'Iniciar sesión', loading: 'Cargando tus datos...',
			verifyEmail: 'Revisa tu correo para confirmar el registro.', inProgress: 'En curso',
			cloudError: 'No se pudieron cargar los datos. Comprueba la tabla de Supabase y la conexión.',
			authError: 'No se pudo iniciar sesión. Comprueba el correo y la contraseña.',
			registerError: 'No se pudo completar el registro. Comprueba los datos.',
			syncError: 'No se pudo sincronizar. Tus datos siguen guardados en este dispositivo.',
			syncing: 'Sincronizando...', clockIn: 'ENTRADA', clockOut: 'SALIDA', tapToStart: 'Toca para iniciar el turno',
			pausedTapToResume: 'En pausa (toca para reanudar)', workingTapToClockOut: 'En curso (toca para salir)',
			clockInSuccess: '¡Entrada registrada correctamente!', shiftCompleted: '¡Turno finalizado! Horas trabajadas: {hours}h | Salario neto estimado: €{net}',
			pauseStarted: 'Pausa iniciada. El contador está detenido.', pauseEnded: 'Pausa finalizada. El contador continúa.',
			locationUnsupported: 'Este navegador no admite geolocalización.', locationDetecting: 'Buscando ubicación...',
			locationDetected: 'Ubicación detectada (±{accuracy}m)', locationSaved: 'Ubicación GPS guardada para el fichaje.',
			locationUnavailable: 'Ubicación no disponible', locationFailed: 'No se pudo obtener la ubicación GPS.',
			darkTheme: 'Tema oscuro', switchToLightTheme: 'Cambiar al tema claro', switchToDarkTheme: 'Cambiar al tema oscuro'
		},
		fr: {
			language: 'Langue', welcome: 'Bon retour', createTitle: 'Créez votre compte',
			subtitle: 'Connectez-vous pour retrouver vos horaires sur tous vos appareils.',
			login: 'Connexion', register: 'Créer un compte', name: 'Nom', email: 'E-mail', password: 'Mot de passe',
			createAccount: 'Créer un compte', continueOffline: 'Continuer sans compte',
			notConfigured: 'L’accès cloud n’est pas configuré. Ajoutez l’URL et la clé anon Supabase dans js/supabase-config.js.',
			signOut: 'Déconnexion', signIn: 'Connexion', loading: 'Chargement de vos données...',
			verifyEmail: 'Consultez votre e-mail pour confirmer votre inscription.', inProgress: 'En cours',
			cloudError: 'Impossible de charger les données cloud. Vérifiez la table Supabase et la connexion.',
			authError: 'Connexion impossible. Vérifiez votre e-mail et votre mot de passe.',
			registerError: 'Inscription impossible. Vérifiez les informations saisies.',
			syncError: 'Échec de la synchronisation. Vos données restent enregistrées sur cet appareil.',
			syncing: 'Synchronisation...', clockIn: 'ARRIVÉE', clockOut: 'DÉPART', tapToStart: 'Touchez pour commencer le poste',
			pausedTapToResume: 'En pause (touchez pour reprendre)', workingTapToClockOut: 'En cours (touchez pour pointer la sortie)',
			clockInSuccess: 'Pointage d’arrivée enregistré !', shiftCompleted: 'Poste terminé ! Heures travaillées : {hours}h | Net estimé : €{net}',
			pauseStarted: 'Pause commencée. Le temps de travail est suspendu.', pauseEnded: 'Pause terminée. Le temps de travail reprend.',
			locationUnsupported: 'La géolocalisation n’est pas prise en charge par ce navigateur.', locationDetecting: 'Localisation en cours...',
			locationDetected: 'Position détectée (±{accuracy}m)', locationSaved: 'Position GPS enregistrée pour le pointage.',
			locationUnavailable: 'Position indisponible', locationFailed: 'Impossible d’obtenir la position GPS.',
			darkTheme: 'Thème sombre', switchToLightTheme: 'Passer au thème clair', switchToDarkTheme: 'Passer au thème sombre'
		},
		de: {
			language: 'Sprache', welcome: 'Willkommen zurück', createTitle: 'Konto erstellen',
			subtitle: 'Melde dich an, um deine Schichten auf allen Geräten zu sehen.',
			login: 'Anmelden', register: 'Registrieren', name: 'Name', email: 'E-Mail', password: 'Passwort',
			createAccount: 'Konto erstellen', continueOffline: 'Ohne Konto fortfahren',
			notConfigured: 'Der Cloud-Zugang ist nicht eingerichtet. Trage die Supabase-URL und den anon-Schlüssel in js/supabase-config.js ein.',
			signOut: 'Abmelden', signIn: 'Anmelden', loading: 'Deine Daten werden geladen...',
			verifyEmail: 'Bitte bestätige deine Registrierung über den Link in deiner E-Mail.', inProgress: 'Läuft',
			cloudError: 'Cloud-Daten konnten nicht geladen werden. Prüfe die Supabase-Tabelle und Verbindung.',
			authError: 'Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort.',
			registerError: 'Registrierung fehlgeschlagen. Prüfe deine Angaben.',
			syncError: 'Synchronisierung fehlgeschlagen. Deine Daten bleiben auf diesem Gerät gespeichert.',
			syncing: 'Synchronisierung...', clockIn: 'KOMMEN', clockOut: 'GEHEN', tapToStart: 'Tippen, um die Schicht zu starten',
			pausedTapToResume: 'In Pause (tippen zum Fortsetzen)', workingTapToClockOut: 'Läuft (tippen zum Ausstempeln)',
			clockInSuccess: 'Einstempeln erfolgreich erfasst!', shiftCompleted: 'Schicht beendet! Arbeitsstunden: {hours}h | Geschätztes Nettogehalt: €{net}',
			pauseStarted: 'Pause begonnen. Die Arbeitszeit ist angehalten.', pauseEnded: 'Pause beendet. Die Arbeitszeit läuft weiter.',
			locationUnsupported: 'Dieser Browser unterstützt keine Geolokalisierung.', locationDetecting: 'Standort wird ermittelt...',
			locationDetected: 'Standort ermittelt (±{accuracy}m)', locationSaved: 'GPS-Standort für die Zeiterfassung gespeichert.',
			locationUnavailable: 'Standort nicht verfügbar', locationFailed: 'GPS-Standort konnte nicht ermittelt werden.',
			darkTheme: 'Dunkles Design', switchToLightTheme: 'Zum hellen Design wechseln', switchToDarkTheme: 'Zum dunklen Design wechseln'
		}
	};

	const uiTranslations = {
		en: {
			'Lingua': 'Language', 'Badge': 'Clock', 'Calendario': 'Calendar', 'Stipendio': 'Pay', 'Busta Paga': 'Payslip', 'Report': 'Reports', 'Impostazioni': 'Settings',
			'Caricamento data...': 'Loading date...', 'Pausa': 'Pause', 'Posizione GPS': 'GPS location', 'Ore Lavorate': 'Hours worked', 'Tempo Pausa': 'Break time', 'Guadagno Stim.': 'Estimated earnings',
			'Tipologia Turno & Annotazioni': 'Shift type & notes', 'Ordinario': 'Regular', 'Straordinario (+15%)': 'Overtime (+15%)', 'Notturno (+20%)': 'Night shift (+20%)', 'Festivo (+50%)': 'Holiday (+50%)', 'Trasferta': 'Business trip', 'Smart Working': 'Remote work',
			'Oggi': 'Today', 'Ore Lavorate': 'Hours worked', 'Straordinari': 'Overtime', 'Ferie & Assenze': 'Leave & absences', 'Giorni Totali': 'Total days', 'Storico Dettagliato Mese': 'Monthly details',
			'Tutti gli eventi': 'All events', 'Solo Turni di Lavoro': 'Work shifts only', 'Solo Straordinari': 'Overtime only', 'Solo Ferie & Malattie': 'Leave & sick days only', 'Nessun evento o turno registrato per questo mese con i filtri selezionati.': 'No events or shifts recorded this month with the selected filters.',
			'Riepilogo Stipendio & Imposte Italia': 'Pay & tax summary', 'STIPENDIO NETTO STIMATO NEL MESE': 'ESTIMATED MONTHLY NET PAY', 'Include straordinari, maggiorazioni e buoni pasto esenti': 'Includes overtime, premiums and tax-free meal vouchers',
			'Totale Competenze Lorde:': 'Total gross earnings:', 'Contributi INPS Dipendente:': 'Employee social contributions:', 'Imponibile Fiscale IRPEF:': 'Taxable income:', 'Trattenuta IRPEF Stimata:': 'Estimated income tax:', 'Buoni Pasto & Indennità:': 'Meal vouchers & allowances:', 'Statistiche Retributive': 'Pay statistics', 'Media Oraria Netta': 'Average net hourly pay', 'Composizione Finanziaria (Lordo, Trattenute e Netto)': 'Pay breakdown (gross, deductions and net)',
			'Scanner OCR Busta Paga & Controllo Discrepanze': 'Payslip scanner & discrepancy check', 'Trascina qui il file PDF o l\'immagine della busta paga': 'Drop your payslip PDF or image here', 'oppure tocca per selezionare dal dispositivo o scattare una foto': 'or tap to select a file or take a photo', 'Elaborazione documento in corso...': 'Processing document...',
			'Esportazione Registro Presenze & Report': 'Export attendance & reports', 'Seleziona il Mese da Esportare': 'Select month to export', 'Scarica Excel (.xlsx)': 'Download Excel (.xlsx)', 'Scarica CSV': 'Download CSV', 'Stampa / Esporta PDF': 'Print / export PDF', 'Sicurezza & Backup Dati': 'Security & data backup', 'Esporta Backup Completo (JSON)': 'Export full backup (JSON)', 'Ripristina Dati da Backup': 'Restore from backup',
			'Parametri Contrattuali & Fiscalità (Italia)': 'Contract & tax settings', 'Tariffa & Contratto (Lordo & Netto in Mano)': 'Pay rate & contract (gross and net)', 'Tipo Contratto': 'Contract type', 'Monte Ore Settimanale': 'Weekly hours', 'Ore Standard Giornaliere': 'Standard daily hours', 'Pausa Giornaliera Predefinita (Minuti)': 'Default daily break (minutes)', 'Salva Impostazioni': 'Save settings', 'Azzera & Ricarica Demo': 'Reset & reload demo',
			'Data del Turno': 'Shift date', 'Orario Inizio': 'Start time', 'Orario Fine': 'End time', 'Pausa (Minuti)': 'Break (minutes)', 'Tipologia Turno': 'Shift type', 'Note / Commessa': 'Notes / project', 'Aggiungi / Modifica Turno': 'Add / edit shift', 'Salva Turno': 'Save shift', 'Registra Assenza (Ferie / Malattia)': 'Record absence (leave / sick)', 'Tipologia Assenza': 'Absence type', 'Ore da Scalare': 'Hours to deduct', 'Registra Assenza': 'Record absence', 'Ferie': 'Leave', 'Malattia': 'Sick leave', 'Giorno libero': 'Day off', 'Permesso / ROL': 'Time off', 'Elimina': 'Delete', 'Nessun turno o evento registrato in questa data.': 'No shifts or events recorded on this date.'
		},
		es: {
			'Lingua': 'Idioma', 'Badge': 'Fichaje', 'Calendario': 'Calendario', 'Stipendio': 'Salario', 'Busta Paga': 'Nómina', 'Report': 'Informes', 'Impostazioni': 'Ajustes',
			'Caricamento data...': 'Cargando fecha...', 'Pausa': 'Pausa', 'Posizione GPS': 'Ubicación GPS', 'Ore Lavorate': 'Horas trabajadas', 'Tempo Pausa': 'Tiempo de pausa', 'Guadagno Stim.': 'Ingreso estimado',
			'Tipologia Turno & Annotazioni': 'Tipo de turno y notas', 'Ordinario': 'Ordinario', 'Straordinario (+15%)': 'Horas extra (+15%)', 'Notturno (+20%)': 'Turno nocturno (+20%)', 'Festivo (+50%)': 'Festivo (+50%)', 'Trasferta': 'Desplazamiento', 'Smart Working': 'Teletrabajo',
			'Oggi': 'Hoy', 'Straordinari': 'Horas extra', 'Ferie & Assenze': 'Vacaciones y ausencias', 'Giorni Totali': 'Días totales', 'Storico Dettagliato Mese': 'Detalle mensual',
			'Tutti gli eventi': 'Todos los eventos', 'Solo Turni di Lavoro': 'Solo turnos de trabajo', 'Solo Straordinari': 'Solo horas extra', 'Solo Ferie & Malattie': 'Solo vacaciones y bajas', 'Nessun evento o turno registrato per questo mese con i filtri selezionati.': 'No hay eventos ni turnos este mes con los filtros seleccionados.',
			'Riepilogo Stipendio & Imposte Italia': 'Resumen de salario e impuestos', 'STIPENDIO NETTO STIMATO NEL MESE': 'SALARIO NETO MENSUAL ESTIMADO', 'Include straordinari, maggiorazioni e buoni pasto esenti': 'Incluye horas extra, complementos y vales de comida exentos',
			'Totale Competenze Lorde:': 'Total bruto:', 'Contributi INPS Dipendente:': 'Cotizaciones del trabajador:', 'Imponibile Fiscale IRPEF:': 'Base imponible:', 'Trattenuta IRPEF Stimata:': 'Retención fiscal estimada:', 'Buoni Pasto & Indennità:': 'Vales de comida y dietas:', 'Statistiche Retributive': 'Estadísticas salariales', 'Media Oraria Netta': 'Media neta por hora', 'Composizione Finanziaria (Lordo, Trattenute e Netto)': 'Desglose salarial (bruto, deducciones y neto)',
			'Scanner OCR Busta Paga & Controllo Discrepanze': 'Escáner de nóminas y control de diferencias', 'Trascina qui il file PDF o l\'immagine della busta paga': 'Arrastra aquí el PDF o la imagen de tu nómina', 'oppure tocca per selezionare dal dispositivo o scattare una foto': 'o toca para elegir un archivo o hacer una foto', 'Elaborazione documento in corso...': 'Procesando documento...',
			'Esportazione Registro Presenze & Report': 'Exportar registro de asistencia e informes', 'Seleziona il Mese da Esportare': 'Selecciona el mes que quieres exportar', 'Scarica Excel (.xlsx)': 'Descargar Excel (.xlsx)', 'Scarica CSV': 'Descargar CSV', 'Stampa / Esporta PDF': 'Imprimir / exportar PDF', 'Sicurezza & Backup Dati': 'Seguridad y copia de datos', 'Esporta Backup Completo (JSON)': 'Exportar copia completa (JSON)', 'Ripristina Dati da Backup': 'Restaurar copia de seguridad',
			'Parametri Contrattuali & Fiscalità (Italia)': 'Contrato e configuración fiscal', 'Tariffa & Contratto (Lordo & Netto in Mano)': 'Tarifa y contrato (bruto y neto)', 'Tipo Contratto': 'Tipo de contrato', 'Monte Ore Settimanale': 'Horas semanales', 'Ore Standard Giornaliere': 'Horas diarias estándar', 'Pausa Giornaliera Predefinita (Minuti)': 'Pausa diaria predeterminada (minutos)', 'Salva Impostazioni': 'Guardar ajustes', 'Azzera & Ricarica Demo': 'Restablecer y cargar demo',
			'Data del Turno': 'Fecha del turno', 'Orario Inizio': 'Hora de inicio', 'Orario Fine': 'Hora de fin', 'Pausa (Minuti)': 'Pausa (minutos)', 'Tipologia Turno': 'Tipo de turno', 'Note / Commessa': 'Notas / proyecto', 'Aggiungi / Modifica Turno': 'Añadir / editar turno', 'Salva Turno': 'Guardar turno', 'Registra Assenza (Ferie / Malattia)': 'Registrar ausencia (vacaciones / baja)', 'Tipologia Assenza': 'Tipo de ausencia', 'Ore da Scalare': 'Horas que descontar', 'Registra Assenza': 'Registrar ausencia', 'Ferie': 'Vacaciones', 'Malattia': 'Baja médica', 'Giorno libero': 'Día libre', 'Permesso / ROL': 'Permiso', 'Elimina': 'Eliminar', 'Nessun turno o evento registrato in questa data.': 'No hay turnos ni eventos registrados en esta fecha.'
		},
		fr: {
			'Lingua': 'Langue', 'Badge': 'Pointage', 'Calendario': 'Calendrier', 'Stipendio': 'Salaire', 'Busta Paga': 'Bulletin de paie', 'Report': 'Rapports', 'Impostazioni': 'Paramètres',
			'Caricamento data...': 'Chargement de la date...', 'Pausa': 'Pause', 'Posizione GPS': 'Position GPS', 'Ore Lavorate': 'Heures travaillées', 'Tempo Pausa': 'Temps de pause', 'Guadagno Stim.': 'Gain estimé',
			'Tipologia Turno & Annotazioni': 'Type de poste et notes', 'Ordinario': 'Normal', 'Straordinario (+15%)': 'Heures supplémentaires (+15%)', 'Notturno (+20%)': 'Travail de nuit (+20%)', 'Festivo (+50%)': 'Jour férié (+50%)', 'Trasferta': 'Déplacement', 'Smart Working': 'Télétravail',
			'Oggi': 'Aujourd’hui', 'Straordinari': 'Heures supplémentaires', 'Ferie & Assenze': 'Congés et absences', 'Giorni Totali': 'Nombre total de jours', 'Storico Dettagliato Mese': 'Détail mensuel',
			'Tutti gli eventi': 'Tous les événements', 'Solo Turni di Lavoro': 'Postes uniquement', 'Solo Straordinari': 'Heures supplémentaires uniquement', 'Solo Ferie & Malattie': 'Congés et arrêts uniquement', 'Nessun evento o turno registrato per questo mese con i filtri selezionati.': 'Aucun événement ni poste enregistré ce mois-ci avec les filtres sélectionnés.',
			'Riepilogo Stipendio & Imposte Italia': 'Résumé du salaire et des impôts', 'STIPENDIO NETTO STIMATO NEL MESE': 'SALAIRE NET MENSUEL ESTIMÉ', 'Include straordinari, maggiorazioni e buoni pasto esenti': 'Inclut les heures supplémentaires, majorations et titres-restaurant exonérés',
			'Totale Competenze Lorde:': 'Total brut :', 'Contributi INPS Dipendente:': 'Cotisations salariales :', 'Imponibile Fiscale IRPEF:': 'Revenu imposable :', 'Trattenuta IRPEF Stimata:': 'Impôt estimé :', 'Buoni Pasto & Indennità:': 'Titres-restaurant et indemnités :', 'Statistiche Retributive': 'Statistiques de rémunération', 'Media Oraria Netta': 'Moyenne nette horaire', 'Composizione Finanziaria (Lordo, Trattenute e Netto)': 'Détail du salaire (brut, retenues et net)',
			'Scanner OCR Busta Paga & Controllo Discrepanze': 'Scanner de bulletin et contrôle des écarts', 'Trascina qui il file PDF o l\'immagine della busta paga': 'Déposez ici le PDF ou la photo de votre bulletin', 'oppure tocca per selezionare dal dispositivo o scattare una foto': 'ou touchez pour choisir un fichier ou prendre une photo', 'Elaborazione documento in corso...': 'Traitement du document...',
			'Esportazione Registro Presenze & Report': 'Exporter le registre de présence et les rapports', 'Seleziona il Mese da Esportare': 'Sélectionnez le mois à exporter', 'Scarica Excel (.xlsx)': 'Télécharger Excel (.xlsx)', 'Scarica CSV': 'Télécharger CSV', 'Stampa / Esporta PDF': 'Imprimer / exporter PDF', 'Sicurezza & Backup Dati': 'Sécurité et sauvegarde', 'Esporta Backup Completo (JSON)': 'Exporter la sauvegarde complète (JSON)', 'Ripristina Dati da Backup': 'Restaurer une sauvegarde',
			'Parametri Contrattuali & Fiscalità (Italia)': 'Paramètres du contrat et des impôts', 'Tariffa & Contratto (Lordo & Netto in Mano)': 'Taux et contrat (brut et net)', 'Tipo Contratto': 'Type de contrat', 'Monte Ore Settimanale': 'Heures hebdomadaires', 'Ore Standard Giornaliere': 'Heures normales par jour', 'Pausa Giornaliera Predefinita (Minuti)': 'Pause quotidienne par défaut (minutes)', 'Salva Impostazioni': 'Enregistrer les paramètres', 'Azzera & Ricarica Demo': 'Réinitialiser et charger la démo',
			'Data del Turno': 'Date du poste', 'Orario Inizio': 'Heure de début', 'Orario Fine': 'Heure de fin', 'Pausa (Minuti)': 'Pause (minutes)', 'Tipologia Turno': 'Type de poste', 'Note / Commessa': 'Notes / projet', 'Aggiungi / Modifica Turno': 'Ajouter / modifier un poste', 'Salva Turno': 'Enregistrer le poste', 'Registra Assenza (Ferie / Malattia)': 'Enregistrer une absence (congé / maladie)', 'Tipologia Assenza': 'Type d’absence', 'Ore da Scalare': 'Heures à déduire', 'Registra Assenza': 'Enregistrer l’absence', 'Ferie': 'Congés', 'Malattia': 'Maladie', 'Giorno libero': 'Jour de repos', 'Permesso / ROL': 'Permission', 'Elimina': 'Supprimer', 'Nessun turno o evento registrato in questa data.': 'Aucun poste ni événement enregistré à cette date.'
		},
		de: {
			'Lingua': 'Sprache', 'Badge': 'Zeiterfassung', 'Calendario': 'Kalender', 'Stipendio': 'Gehalt', 'Busta Paga': 'Gehaltsabrechnung', 'Report': 'Berichte', 'Impostazioni': 'Einstellungen',
			'Caricamento data...': 'Datum wird geladen...', 'Pausa': 'Pause', 'Posizione GPS': 'GPS-Standort', 'Ore Lavorate': 'Arbeitsstunden', 'Tempo Pausa': 'Pausenzeit', 'Guadagno Stim.': 'Geschätzter Verdienst',
			'Tipologia Turno & Annotazioni': 'Schichtart und Notizen', 'Ordinario': 'Regulär', 'Straordinario (+15%)': 'Überstunden (+15%)', 'Notturno (+20%)': 'Nachtschicht (+20%)', 'Festivo (+50%)': 'Feiertag (+50%)', 'Trasferta': 'Dienstreise', 'Smart Working': 'Mobiles Arbeiten',
			'Oggi': 'Heute', 'Straordinari': 'Überstunden', 'Ferie & Assenze': 'Urlaub und Abwesenheiten', 'Giorni Totali': 'Tage insgesamt', 'Storico Dettagliato Mese': 'Monatsübersicht',
			'Tutti gli eventi': 'Alle Ereignisse', 'Solo Turni di Lavoro': 'Nur Arbeitsschichten', 'Solo Straordinari': 'Nur Überstunden', 'Solo Ferie & Malattie': 'Nur Urlaub und Krankheit', 'Nessun evento o turno registrato per questo mese con i filtri selezionati.': 'Keine Ereignisse oder Schichten für diesen Monat mit den ausgewählten Filtern.',
			'Riepilogo Stipendio & Imposte Italia': 'Gehalts- und Steuerübersicht', 'STIPENDIO NETTO STIMATO NEL MESE': 'GESCHÄTZTES MONATLICHES NETTOGEHALT', 'Include straordinari, maggiorazioni e buoni pasto esenti': 'Enthält Überstunden, Zuschläge und steuerfreie Essensgutscheine',
			'Totale Competenze Lorde:': 'Bruttogesamtbetrag:', 'Contributi INPS Dipendente:': 'Sozialabgaben:', 'Imponibile Fiscale IRPEF:': 'Steuerpflichtiges Einkommen:', 'Trattenuta IRPEF Stimata:': 'Geschätzte Einkommensteuer:', 'Buoni Pasto & Indennità:': 'Essensgutscheine und Zulagen:', 'Statistiche Retributive': 'Gehaltsstatistik', 'Media Oraria Netta': 'Durchschnittlicher Nettostundenlohn', 'Composizione Finanziaria (Lordo, Trattenute e Netto)': 'Gehaltsübersicht (Brutto, Abzüge und Netto)',
			'Scanner OCR Busta Paga & Controllo Discrepanze': 'Gehaltsabrechnung scannen und Abweichungen prüfen', 'Trascina qui il file PDF o l\'immagine della busta paga': 'PDF oder Bild der Gehaltsabrechnung hier ablegen', 'oppure tocca per selezionare dal dispositivo o scattare una foto': 'oder tippen, um eine Datei auszuwählen oder ein Foto aufzunehmen', 'Elaborazione documento in corso...': 'Dokument wird verarbeitet...',
			'Esportazione Registro Presenze & Report': 'Arbeitszeitnachweis und Berichte exportieren', 'Seleziona il Mese da Esportare': 'Monat zum Export auswählen', 'Scarica Excel (.xlsx)': 'Excel herunterladen (.xlsx)', 'Scarica CSV': 'CSV herunterladen', 'Stampa / Esporta PDF': 'Drucken / PDF exportieren', 'Sicurezza & Backup Dati': 'Sicherheit und Datensicherung', 'Esporta Backup Completo (JSON)': 'Vollständige Sicherung exportieren (JSON)', 'Ripristina Dati da Backup': 'Daten aus Sicherung wiederherstellen',
			'Parametri Contrattuali & Fiscalità (Italia)': 'Vertrags- und Steuereinstellungen', 'Tariffa & Contratto (Lordo & Netto in Mano)': 'Stundensatz und Vertrag (Brutto und Netto)', 'Tipo Contratto': 'Vertragsart', 'Monte Ore Settimanale': 'Wochenarbeitsstunden', 'Ore Standard Giornaliere': 'Tägliche Regelarbeitszeit', 'Pausa Giornaliera Predefinita (Minuti)': 'Tägliche Standardpause (Minuten)', 'Salva Impostazioni': 'Einstellungen speichern', 'Azzera & Ricarica Demo': 'Zurücksetzen und Demo laden',
			'Data del Turno': 'Schichtdatum', 'Orario Inizio': 'Startzeit', 'Orario Fine': 'Endzeit', 'Pausa (Minuti)': 'Pause (Minuten)', 'Tipologia Turno': 'Schichtart', 'Note / Commessa': 'Notizen / Auftrag', 'Aggiungi / Modifica Turno': 'Schicht hinzufügen / bearbeiten', 'Salva Turno': 'Schicht speichern', 'Registra Assenza (Ferie / Malattia)': 'Abwesenheit erfassen (Urlaub / Krankheit)', 'Tipologia Assenza': 'Abwesenheitsart', 'Ore da Scalare': 'Abzuziehende Stunden', 'Registra Assenza': 'Abwesenheit erfassen', 'Ferie': 'Urlaub', 'Malattia': 'Krankheit', 'Giorno libero': 'Freier Tag', 'Permesso / ROL': 'Freistellung', 'Elimina': 'Löschen', 'Nessun turno o evento registrato in questa data.': 'Keine Schichten oder Ereignisse an diesem Datum.'
		}
	};

	const additionalUiTranslations = {
		'CHECK-IN': ['CLOCK IN', 'ENTRADA', 'ARRIVÉE', 'KOMMEN'],
		'CHECK-OUT': ['CLOCK OUT', 'SALIDA', 'DÉPART', 'GEHEN'],
		'Tocca per iniziare il turno': ['Tap to start your shift', 'Toca para iniciar el turno', 'Touchez pour commencer le poste', 'Tippen, um die Schicht zu starten'],
		'In Pausa (Tocca per terminare)': ['On break (tap to resume)', 'En pausa (toca para reanudar)', 'En pause (touchez pour reprendre)', 'In Pause (tippen zum Fortsetzen)'],
		'In corso (Tocca per timbrare uscita)': ['In progress (tap to clock out)', 'En curso (toca para salir)', 'En cours (touchez pour pointer la sortie)', 'Läuft (tippen zum Ausstempeln)'],
		'Posizione GPS': ['GPS location', 'Ubicación GPS', 'Position GPS', 'GPS-Standort'],
		'Note per questo turno (es. Commessa, Cantiere, Progetto)...': ['Notes for this shift (e.g. job, site, project)...', 'Notas para este turno (p. ej., trabajo, obra, proyecto)...', 'Notes pour ce poste (ex. mission, chantier, projet)...', 'Notizen zu dieser Schicht (z. B. Auftrag, Baustelle, Projekt)...'],
		'Es. Cantiere, cliente, straordinario autorizzato...': ['e.g. site, client, approved overtime...', 'p. ej., obra, cliente, horas extra autorizadas...', 'ex. chantier, client, heures supplémentaires autorisées...', 'z. B. Baustelle, Kunde, genehmigte Überstunden...'],
		'Es. Visita medica, ferie estive...': ['e.g. medical appointment, summer leave...', 'p. ej., cita médica, vacaciones de verano...', 'ex. rendez-vous médical, congés d’été...', 'z. B. Arzttermin, Sommerurlaub...'],
		'Tipo Contratto': ['Contract type', 'Tipo de contrato', 'Type de contrat', 'Vertragsart'],
		'Turni Variabili / Flessibile': ['Variable / flexible shifts', 'Turnos variables / flexibles', 'Horaires variables / flexibles', 'Variable / flexible Schichten'],
		'Full-Time (40 ore)': ['Full-time (40 hours)', 'Jornada completa (40 horas)', 'Temps plein (40 heures)', 'Vollzeit (40 Stunden)'],
		'Part-Time': ['Part-time', 'Jornada parcial', 'Temps partiel', 'Teilzeit'],
		'Monte Ore Settimanale': ['Weekly hours', 'Horas semanales', 'Heures hebdomadaires', 'Wochenstunden'],
		'Ore Standard Giornaliere': ['Standard daily hours', 'Horas diarias estándar', 'Heures normales par jour', 'Tägliche Regelarbeitszeit'],
		'Pausa Giornaliera Predefinita (Minuti)': ['Default daily break (minutes)', 'Pausa diaria predeterminada (minutos)', 'Pause quotidienne par défaut (minutes)', 'Tägliche Standardpause (Minuten)'],
		'Contributi INPS IVS Dipendente (%)': ['Employee social contributions (%)', 'Cotizaciones del trabajador (%)', 'Cotisations salariales (%)', 'Arbeitnehmer-Sozialabgaben (%)'],
		'Aliquota IRPEF Media Stimata (%)': ['Estimated average income tax (%)', 'Tipo medio estimado (%)', 'Taux moyen estimé (%)', 'Geschätzter durchschnittlicher Steuersatz (%)'],
		'Maggiorazioni Turni & CCNL (%)': ['Shift premiums & contract rates (%)', 'Complementos de turno y convenio (%)', 'Majorations de poste et convention (%)', 'Schichtzuschläge und Tarifwerte (%)'],
		'Straordinario Diurno (%)': ['Daytime overtime (%)', 'Horas extra diurnas (%)', 'Heures supplémentaires de jour (%)', 'Überstunden tagsüber (%)'],
		'Straordinario Domenicale (%)': ['Sunday overtime (%)', 'Horas extra en domingo (%)', 'Heures supplémentaires du dimanche (%)', 'Sonntagsüberstunden (%)'],
		'Straordinario Notturno (%)': ['Night overtime (%)', 'Horas extra nocturnas (%)', 'Heures supplémentaires de nuit (%)', 'Nachtüberstunden (%)'],
		'Straordinario Festivo (%)': ['Holiday overtime (%)', 'Horas extra en festivo (%)', 'Heures supplémentaires un jour férié (%)', 'Feiertagsüberstunden (%)'],
		'Buono Pasto Giornaliero (€)': ['Daily meal voucher (€)', 'Vale de comida diario (€)', 'Titre-restaurant journalier (€)', 'Täglicher Essensgutschein (€)'],
		'Indennità Giornaliera Trasferta (€)': ['Daily travel allowance (€)', 'Dietas diarias (€)', 'Indemnité journalière de déplacement (€)', 'Tägliche Reisekostenpauschale (€)'],
		'Feedback sonoro alla timbratura': ['Sound on clock in/out', 'Sonido al fichar', 'Son à la pointeuse', 'Tonsignal beim Stempeln'],
		'Vibrazione aptica su smartphone': ['Haptic feedback on smartphone', 'Vibración en el móvil', 'Retour haptique sur smartphone', 'Haptisches Feedback auf dem Smartphone'],
		'Abilita Notifiche Promemoria di Sistema': ['Enable system reminder notifications', 'Activar notificaciones de recordatorio', 'Activer les notifications de rappel', 'System-Erinnerungen aktivieren'],
		'Azzera & Ricarica Demo': ['Reset & reload demo', 'Restablecer y cargar demo', 'Réinitialiser et charger la démo', 'Zurücksetzen und Demo laden'],
		'Data del Turno': ['Shift date', 'Fecha del turno', 'Date du poste', 'Schichtdatum'],
		'Orario Inizio': ['Start time', 'Hora de inicio', 'Heure de début', 'Startzeit'],
		'Orario Fine': ['End time', 'Hora de fin', 'Heure de fin', 'Endzeit'],
		'Pausa (Minuti)': ['Break (minutes)', 'Pausa (minutos)', 'Pause (minutes)', 'Pause (Minuten)'],
		'Tipologia Turno': ['Shift type', 'Tipo de turno', 'Type de poste', 'Schichtart'],
		'Note / Commessa': ['Notes / project', 'Notas / proyecto', 'Notes / projet', 'Notizen / Auftrag'],
		'Aggiungi Turno': ['Add shift', 'Añadir turno', 'Ajouter un poste', 'Schicht hinzufügen'],
		'Aggiungi / Modifica Turno': ['Add / edit shift', 'Añadir / editar turno', 'Ajouter / modifier un poste', 'Schicht hinzufügen / bearbeiten'],
		'Salva Turno': ['Save shift', 'Guardar turno', 'Enregistrer le poste', 'Schicht speichern'],
		'Ferie / Malattia / Giorno libero': ['Leave / sick / day off', 'Vacaciones / baja / día libre', 'Congé / maladie / repos', 'Urlaub / Krankheit / freier Tag'],
		'Registra Assenza (Ferie / Malattia)': ['Record absence (leave / sick)', 'Registrar ausencia (vacaciones / baja)', 'Enregistrer une absence (congé / maladie)', 'Abwesenheit erfassen (Urlaub / Krankheit)'],
		'Tipologia Assenza': ['Absence type', 'Tipo de ausencia', 'Type d’absence', 'Abwesenheitsart'],
		'Ore da Scalare': ['Hours to deduct', 'Horas que descontar', 'Heures à déduire', 'Abzuziehende Stunden'],
		'Registra Assenza': ['Record absence', 'Registrar ausencia', 'Enregistrer l’absence', 'Abwesenheit erfassen'],
		'Numero Protocollo Certificato INPS (opzionale)': ['INPS certificate protocol number (optional)', 'Número de protocolo del certificado (opcional)', 'Numéro de protocole du certificat (facultatif)', 'Protokollnummer der Bescheinigung (optional)'],
		'Paga in Busta Paga': ['Paid on payslip', 'Pagadas en nómina', 'Payées sur le bulletin', 'Auf der Abrechnung bezahlt'],
		'Impostazioni e tariffe salvate con successo!': ['Settings and rates saved successfully!', '¡Ajustes y tarifas guardados!', 'Paramètres et tarifs enregistrés !', 'Einstellungen und Sätze erfolgreich gespeichert!'],
		'Turno salvato con successo!': ['Shift saved successfully!', '¡Turno guardado!', 'Poste enregistré !', 'Schicht erfolgreich gespeichert!'],
		'Assenza registrata con successo!': ['Absence recorded successfully!', '¡Ausencia registrada!', 'Absence enregistrée !', 'Abwesenheit erfolgreich erfasst!'],
		'Nessun turno o evento registrato in questa data.': ['No shifts or events recorded on this date.', 'No hay turnos ni eventos registrados en esta fecha.', 'Aucun poste ni événement enregistré à cette date.', 'Keine Schichten oder Ereignisse an diesem Datum.'],
		'Nessun evento o turno registrato per questo mese con i filtri selezionati.': ['No events or shifts recorded this month with the selected filters.', 'No hay eventos ni turnos este mes con los filtros seleccionados.', 'Aucun événement ni poste enregistré ce mois-ci avec les filtres sélectionnés.', 'Keine Ereignisse oder Schichten für diesen Monat mit den ausgewählten Filtern.'],
		'In corso': ['In progress', 'En curso', 'En cours', 'Läuft'],
		'Elimina': ['Delete', 'Eliminar', 'Supprimer', 'Löschen'],
		'+ Aggiungi Turno': ['+ Add shift', '+ Añadir turno', '+ Ajouter un poste', '+ Schicht hinzufügen'],
		'+ Ferie / Malattia / Giorno libero': ['+ Leave / sick / day off', '+ Vacaciones / baja / día libre', '+ Congé / maladie / repos', '+ Urlaub / Krankheit / freier Tag'],
		'Risultato Verifica & Riconciliazione': ['Review & reconciliation result', 'Resultado de revisión y conciliación', 'Résultat de la vérification et du rapprochement', 'Prüf- und Abstimmungsergebnis'],
		'Dati Rilevati dal Cedolino (Modificabili)': ['Payslip data (editable)', 'Datos de la nómina (editables)', 'Données du bulletin (modifiables)', 'Abrechnungsdaten (bearbeitbar)'],
		'Mese di Competenza': ['Pay period', 'Periodo de nómina', 'Période de paie', 'Abrechnungsmonat'],
		'Ore Ordinarie Pagate': ['Regular hours paid', 'Horas ordinarias pagadas', 'Heures normales payées', 'Bezahlte Regelstunden'],
		'Ore Straordinario Pagate': ['Overtime hours paid', 'Horas extra pagadas', 'Heures supplémentaires payées', 'Bezahlte Überstunden'],
		'Ferie Godute (Ore)': ['Leave taken (hours)', 'Vacaciones disfrutadas (horas)', 'Congés pris (heures)', 'Genommener Urlaub (Stunden)'],
		'Permessi / ROL Goduti': ['Time off taken', 'Permisos disfrutados', 'Permissions prises', 'Genommene Freistellung'],
		'Netto a Pagare Cedolino (€)': ['Payslip net pay (€)', 'Neto a pagar (€)', 'Net à payer (€)', 'Auszahlungsbetrag netto (€)'],
		'Ricalcola Confronto con Registro Orari': ['Recalculate against time records', 'Recalcular comparación con el registro horario', 'Recalculer la comparaison avec le relevé horaire', 'Abgleich mit Zeiterfassung neu berechnen'],
		'Voce di Controllo': ['Check item', 'Concepto de control', 'Élément de contrôle', 'Prüfpunkt'],
		'Registrate nell\'App': ['Recorded in the app', 'Registradas en la aplicación', 'Enregistrées dans l’application', 'In der App erfasst'],
		'Pagate in Busta Paga': ['Paid on payslip', 'Pagadas en nómina', 'Payées sur le bulletin', 'Laut Abrechnung bezahlt'],
		'Discrepanza (Delta)': ['Difference', 'Diferencia', 'Écart', 'Abweichung'],
		'Copia Lettera di Chiarimento per HR': ['Copy clarification letter for HR', 'Copiar carta de aclaración para RR. HH.', 'Copier la lettre de clarification pour les RH', 'Klärungsschreiben für HR kopieren'],
		'Archivio Cedolini Verificati': ['Verified payslips', 'Nóminas verificadas', 'Bulletins vérifiés', 'Geprüfte Abrechnungen'],
		'Esportazione Registro Presenze & Report': ['Export attendance records & reports', 'Exportar asistencia e informes', 'Exporter le registre de présence et les rapports', 'Arbeitszeitnachweis und Berichte exportieren'],
		'Seleziona il Mese da Esportare': ['Select month to export', 'Selecciona el mes que quieres exportar', 'Sélectionnez le mois à exporter', 'Monat zum Export auswählen'],
		'📊 Foglio Excel (.xlsx)': ['📊 Excel spreadsheet (.xlsx)', '📊 Hoja de Excel (.xlsx)', '📊 Feuille Excel (.xlsx)', '📊 Excel-Tabelle (.xlsx)'],
		'Tabella completa pronta per Microsoft Excel o Google Fogli con formule e riepiloghi.': ['Complete spreadsheet for Microsoft Excel or Google Sheets, with formulas and summaries.', 'Hoja completa para Microsoft Excel o Google Sheets, con fórmulas y resúmenes.', 'Tableau complet pour Microsoft Excel ou Google Sheets, avec formules et récapitulatifs.', 'Vollständige Tabelle für Microsoft Excel oder Google Tabellen mit Formeln und Zusammenfassungen.'],
		'📄 Documento CSV': ['📄 CSV file', '📄 Archivo CSV', '📄 Document CSV', '📄 CSV-Datei'],
		'Formato standard separato da punto e virgola conforme alle importazioni contabili.': ['Standard semicolon-separated format for accounting imports.', 'Formato estándar separado por punto y coma para importaciones contables.', 'Format standard séparé par des points-virgules pour les imports comptables.', 'Standardformat mit Semikolontrennung für den Buchhaltungsimport.'],
		'🖨️ Stampa / PDF Ufficiale': ['🖨️ Print / official PDF', '🖨️ Imprimir / PDF oficial', '🖨️ Imprimer / PDF officiel', '🖨️ Drucken / offizielles PDF'],
		'Report impaginato con intestazione e spazi per le firme del dipendente e datore.': ['Formatted report with a header and signature spaces for employee and employer.', 'Informe maquetado con encabezado y espacio para las firmas del trabajador y empleador.', 'Rapport mis en page avec en-tête et emplacements de signature du salarié et de l’employeur.', 'Formatierter Bericht mit Kopfzeile und Unterschriftsfeldern für Beschäftigte und Arbeitgeber.'],
		'Sicurezza & Backup Dati': ['Security & data backup', 'Seguridad y copia de datos', 'Sécurité et sauvegarde', 'Sicherheit und Datensicherung'],
		'I dati sono salvati sul dispositivo. Con un account, turni e impostazioni vengono sincronizzati online e sono disponibili sugli altri dispositivi; puoi esportare un backup in qualsiasi momento.': ['Your data is saved on this device. With an account, shifts and settings sync online and are available on your other devices; you can export a backup at any time.', 'Tus datos se guardan en este dispositivo. Con una cuenta, los turnos y ajustes se sincronizan y están disponibles en tus otros dispositivos; puedes exportar una copia cuando quieras.', 'Vos données sont enregistrées sur cet appareil. Avec un compte, les postes et paramètres sont synchronisés et accessibles depuis vos autres appareils ; vous pouvez exporter une sauvegarde à tout moment.', 'Deine Daten werden auf diesem Gerät gespeichert. Mit einem Konto werden Schichten und Einstellungen synchronisiert und sind auf deinen anderen Geräten verfügbar; du kannst jederzeit eine Sicherung exportieren.'],
		'Esporta Backup Completo (JSON)': ['Export full backup (JSON)', 'Exportar copia completa (JSON)', 'Exporter la sauvegarde complète (JSON)', 'Vollständige Sicherung exportieren (JSON)'],
		'Ripristina Dati da Backup': ['Restore from backup', 'Restaurar desde una copia', 'Restaurer depuis une sauvegarde', 'Aus Sicherung wiederherstellen'],
		'Parametri Contrattuali & Fiscalità (Italia)': ['Contract & tax settings', 'Ajustes de contrato e impuestos', 'Paramètres du contrat et des impôts', 'Vertrags- und Steuereinstellungen'],
		'Tariffa & Contratto (Lordo & Netto in Mano)': ['Pay rate & contract (gross and net)', 'Tarifa y contrato (bruto y neto)', 'Taux et contrat (brut et net)', 'Stundensatz und Vertrag (Brutto und Netto)'],
		'Tariffa Oraria Lorda (€/ora)': ['Gross hourly rate (€/hour)', 'Tarifa bruta por hora (€/hora)', 'Taux horaire brut (€/heure)', 'Bruttostundenlohn (€/Stunde)'],
		'Lordo Contrattuale': ['Contract gross', 'Bruto contractual', 'Brut contractuel', 'Vertragsbrutto'],
		'Netto in Mano (€/ora)': ['Take-home pay (€/hour)', 'Neto por hora (€/hora)', 'Net en main (€/heure)', 'Nettolohn (€/Stunde)'],
		'Netto in Tasca': ['Take-home pay', 'Neto en mano', 'Net en poche', 'Nettolohn'],
		'Contributi INPS IVS Dipendente (%)': ['Employee social contributions (%)', 'Cotizaciones del trabajador (%)', 'Cotisations salariales (%)', 'Arbeitnehmer-Sozialabgaben (%)'],
		'Aliquota IRPEF Media Stimata (%)': ['Estimated average income tax (%)', 'Tipo medio estimado (%)', 'Taux moyen estimé (%)', 'Geschätzter durchschnittlicher Steuersatz (%)'],
		'Notifiche & Feedback': ['Notifications & feedback', 'Notificaciones y comentarios', 'Notifications et retours', 'Benachrichtigungen & Feedback'],
		'Pausa Giornaliera Predefinita (Minuti)': ['Default daily break (minutes)', 'Pausa diaria predeterminada (minutos)', 'Pause quotidienne par défaut (minutes)', 'Tägliche Standardpause (Minuten)'],
		'Ferie': ['Leave', 'Vacaciones', 'Congés', 'Urlaub'],
		'Malattia': ['Sick leave', 'Baja médica', 'Maladie', 'Krankheit'],
		'Giorno libero': ['Day off', 'Día libre', 'Jour de repos', 'Freier Tag'],
		'PERMESSO': ['TIME OFF', 'PERMISO', 'PERMISSION', 'FREISTELLUNG'],
		'GIORNO_LIBERO': ['DAY OFF', 'DÍA LIBRE', 'JOUR DE REPOS', 'FREIER TAG'],
		'FESTIVITA': ['HOLIDAY', 'FESTIVO', 'JOUR FÉRIÉ', 'FEIERTAG'],
		'Turno Ordinario': ['Regular shift', 'Turno ordinario', 'Poste normal', 'Reguläre Schicht'],
		'Turno Straordinario': ['Overtime shift', 'Turno de horas extra', 'Poste supplémentaire', 'Überstundenschicht'],
		'Turno Straordinario domenicale': ['Sunday overtime shift', 'Turno de horas extra en domingo', 'Poste supplémentaire du dimanche', 'Sonntagsüberstundenschicht'],
		'Turno Notturno': ['Night shift', 'Turno nocturno', 'Poste de nuit', 'Nachtschicht'],
		'Turno Festivo': ['Holiday shift', 'Turno festivo', 'Poste un jour férié', 'Feiertagsschicht']
	};

	let locale = 'it';
	const originalText = new WeakMap();
	const originalAttributes = new WeakMap();

	function getItalianSource(text) {
		if (locale === 'it') return text;

		const translatedUi = uiTranslations[locale] || {};
		const uiSource = Object.keys(translatedUi).find((source) => translatedUi[source] === text);
		if (uiSource) return uiSource;

		const localeIndex = ['en', 'es', 'fr', 'de'].indexOf(locale);
		const additionalSource = Object.keys(additionalUiTranslations).find((source) => additionalUiTranslations[source][localeIndex] === text);
		if (additionalSource) return additionalSource;

		const messageKey = Object.keys(messages[locale]).find((key) => messages[locale][key] === text);
		return messageKey ? messages.it[messageKey] || text : text;
	}

	function translateNode(node) {
		if (!node || (node.parentElement && node.parentElement.closest('[data-i18n]'))) return;
		if (node.nodeType === Node.TEXT_NODE) {
			if (!originalText.has(node)) originalText.set(node, node.nodeValue);
			const original = originalText.get(node);
			const text = original.trim();
			const authKey = Object.keys(messages.it).find((key) => messages.it[key] === text);
			const localeIndex = ['en', 'es', 'fr', 'de'].indexOf(locale);
			const translated = locale === 'it'
				? getItalianSource(text)
				: uiTranslations[locale]?.[text] || additionalUiTranslations[text]?.[localeIndex] || (authKey ? messages[locale][authKey] : '');
			if (translated && node.nodeValue !== `${original.match(/^\s*/)?.[0] || ''}${translated}${original.match(/\s*$/)?.[0] || ''}`) {
				const start = original.match(/^\s*/)?.[0] || '';
				const end = original.match(/\s*$/)?.[0] || '';
				const nextValue = `${start}${translated}${end}`;
				if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
			}
			return;
		}
		if (node.nodeType !== Node.ELEMENT_NODE) return;

		['placeholder', 'title', 'aria-label'].forEach((attribute) => {
			if (!node.hasAttribute(attribute)) return;
			let values = originalAttributes.get(node);
			if (!values) {
				values = {};
				originalAttributes.set(node, values);
			}
			if (!Object.prototype.hasOwnProperty.call(values, attribute)) values[attribute] = node.getAttribute(attribute);
			const authKey = Object.keys(messages.it).find((key) => messages.it[key] === values[attribute]);
			const localeIndex = ['en', 'es', 'fr', 'de'].indexOf(locale);
			const translated = locale === 'it'
				? getItalianSource(values[attribute])
				: uiTranslations[locale]?.[values[attribute]] || additionalUiTranslations[values[attribute]]?.[localeIndex] || (authKey ? messages[locale][authKey] : '');
			if (translated && node.getAttribute(attribute) !== translated) node.setAttribute(attribute, translated);
		});

		Array.from(node.childNodes).forEach(translateNode);
	}

	function translatePage() {
		translateNode(document.body);
	}

	const pageObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList') mutation.addedNodes.forEach(translateNode);
			else if (mutation.type === 'characterData') translateNode(mutation.target);
			else if (mutation.type === 'attributes') translateNode(mutation.target);
		});
	});
	pageObserver.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });

	function setLocale(value) {
		locale = Object.prototype.hasOwnProperty.call(messages, value) ? value : 'it';
		document.documentElement.lang = locale;
		document.querySelectorAll('[data-i18n]').forEach((element) => {
			const key = element.dataset.i18n;
			if (messages[locale][key]) element.textContent = messages[locale][key];
		});
		const languageSelect = document.getElementById('appLanguage');
		if (languageSelect) languageSelect.value = locale;
		translatePage();
		document.dispatchEvent(new CustomEvent('shiftnet:locale-changed', { detail: { locale } }));
		return locale;
	}

	window.shiftNetI18n = {
		setLocale,
		getLocale() {
			return locale;
		},
		 t(key, values = {}) {
			const message = messages[locale][key] || messages.it[key] || key;
			return message.replace(/\{(\w+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? values[name] : match);
		}
	};
})();
