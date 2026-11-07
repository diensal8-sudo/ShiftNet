class AuthManager {
	constructor(onReady) {
		this.onReady = onReady;
		this.client = null;
		this.user = null;
		this.mode = 'login';
		this.syncTimer = null;
		this.elements = {};
	}

	async initialize() {
		this.elements = {
			form: document.getElementById('authForm'),
			nameGroup: document.getElementById('authNameGroup'),
			name: document.getElementById('authName'),
			email: document.getElementById('authEmail'),
			password: document.getElementById('authPassword'),
			submit: document.getElementById('authSubmit'),
			title: document.getElementById('authTitle'),
			feedback: document.getElementById('authFeedback'),
			configNotice: document.getElementById('authConfigNotice'),
			language: document.getElementById('appLanguage'),
			account: document.getElementById('accountBtn')
		};

		const entryCompleted = localStorage.getItem('shiftnet_entry_choice_v1') === 'done';
		const savedLocale = localStorage.getItem('shiftnet_locale_v1') || 'it';
		this.elements.language.value = savedLocale;
		window.shiftNetI18n.setLocale(savedLocale);
		this.setMode('login');
		this.bindEvents();
		if (!entryCompleted) document.body.classList.add('auth-required');
		else document.body.classList.remove('auth-required');

		const projectUrl = window.SHIFTNET_SUPABASE_URL;
		const anonKey = window.SHIFTNET_SUPABASE_ANON_KEY;
		if (!projectUrl || !anonKey) {
			this.elements.configNotice.hidden = false;
			this.elements.submit.disabled = true;
			if (entryCompleted) this.onReady();
			return;
		}

		if (!window.supabase?.createClient) {
			this.setFeedback(window.shiftNetI18n.t('authError'), 'error');
			if (entryCompleted) this.onReady();
			return;
		}

		this.client = window.supabase.createClient(projectUrl, anonKey);
		const { data, error } = await this.client.auth.getSession();
		if (error) {
			this.setFeedback(window.shiftNetI18n.t('authError'), 'error');
			if (entryCompleted) this.onReady();
			return;
		}
		if (data.session) {
			await this.activateSession(data.session.user);
			if (entryCompleted && !this.user) this.onReady();
		} else if (entryCompleted) {
			this.onReady();
		}
	}

	bindEvents() {
		this.elements.form.addEventListener('submit', (event) => this.submit(event));
		document.querySelectorAll('[data-auth-mode]').forEach((button) => {
			button.addEventListener('click', () => this.setMode(button.dataset.authMode));
		});
		this.elements.language.addEventListener('change', () => {
			const locale = window.shiftNetI18n.setLocale(this.elements.language.value);
			localStorage.setItem('shiftnet_locale_v1', locale);
			if (this.user && this.client) {
				this.client.auth.updateUser({ data: { preferred_language: locale } });
			}
			this.updateAccountButton();
		});
		this.elements.account.addEventListener('click', () => {
			if (this.user) this.signOut();
			else {
				this.setMode('login');
				document.body.classList.add('auth-required');
			}
		});
		document.getElementById('continueOfflineBtn').addEventListener('click', () => this.continueOffline());
	}

	setMode(mode) {
		this.mode = mode === 'register' ? 'register' : 'login';
		const registering = this.mode === 'register';
		this.elements.nameGroup.hidden = !registering;
		this.elements.name.required = registering;
		this.elements.password.autocomplete = registering ? 'new-password' : 'current-password';
		this.elements.title.dataset.i18n = registering ? 'createTitle' : 'welcome';
		this.elements.submit.dataset.i18n = registering ? 'createAccount' : 'login';
		document.querySelectorAll('[data-auth-mode]').forEach((button) => {
			button.classList.toggle('active', button.dataset.authMode === this.mode);
			button.setAttribute('aria-selected', String(button.dataset.authMode === this.mode));
		});
		window.shiftNetI18n.setLocale(this.elements.language.value);
		this.setFeedback('');
	}

	async submit(event) {
		event.preventDefault();
		if (!this.client) return;

		const email = this.elements.email.value.trim();
		const password = this.elements.password.value;
		this.elements.submit.disabled = true;
		this.setFeedback(window.shiftNetI18n.t('loading'));

		try {
			if (this.mode === 'register') {
				const { data, error } = await this.client.auth.signUp({
					email,
					password,
					options: {
						data: {
							full_name: this.elements.name.value.trim(),
							preferred_language: this.elements.language.value
						}
					}
				});
				if (error) throw error;
				if (data.session) await this.activateSession(data.user);
				else {
					this.setFeedback(window.shiftNetI18n.t('verifyEmail'), 'success');
					localStorage.setItem('shiftnet_entry_choice_v1', 'done');
				}
			} else {
				const { data, error } = await this.client.auth.signInWithPassword({ email, password });
				if (error) throw error;
				await this.activateSession(data.user);
			}
		} catch (error) {
			console.error('Errore autenticazione:', error);
			const key = this.mode === 'register' ? 'registerError' : 'authError';
			this.setFeedback(window.shiftNetI18n.t(key), 'error');
		} finally {
			this.elements.submit.disabled = false;
		}
	}

	async activateSession(user) {
		this.setFeedback(window.shiftNetI18n.t('loading'));
		const { data, error } = await this.client
			.from('user_app_data')
			.select('data')
			.eq('user_id', user.id)
			.maybeSingle();

		if (error) {
			console.error('Errore caricamento dati cloud:', error);
			this.setFeedback(window.shiftNetI18n.t('cloudError'), 'error');
			return;
		}

		if (data?.data) {
			appStore.restoreCloudSnapshot(data.data);
		} else {
			const { error: saveError } = await this.client.from('user_app_data').upsert({
				user_id: user.id,
				data: appStore.getCloudSnapshot()
			});
			if (saveError) {
				console.error('Errore creazione dati cloud:', saveError);
				this.setFeedback(window.shiftNetI18n.t('cloudError'), 'error');
				return;
			}
		}

		this.user = user;
		localStorage.setItem('shiftnet_entry_choice_v1', 'done');
		window.authenticatedUser = user;
		const locale = user.user_metadata?.preferred_language || this.elements.language.value;
		this.elements.language.value = locale;
		localStorage.setItem('shiftnet_locale_v1', locale);
		window.shiftNetI18n.setLocale(locale);
		this.updateAccountButton();
		this.onReady();
	}

	continueOffline() {
		localStorage.setItem('shiftnet_entry_choice_v1', 'done');
		this.user = null;
		window.authenticatedUser = null;
		this.updateAccountButton();
		this.onReady();
	}

	updateAccountButton() {
		const label = this.user ? window.shiftNetI18n.t('signOut') : window.shiftNetI18n.t('signIn');
		this.elements.account.dataset.i18n = this.user ? 'signOut' : 'signIn';
		this.elements.account.textContent = label;
		this.elements.account.title = this.user?.email || label;
	}

	setFeedback(message, type = '') {
		this.elements.feedback.textContent = message;
		this.elements.feedback.className = `auth-feedback${type ? ` ${type}` : ''}`;
	}

	scheduleSync() {
		if (!this.user || !this.client || !navigator.onLine) return;
		clearTimeout(this.syncTimer);
		this.syncTimer = setTimeout(() => this.syncNow(), 700);
	}

	async syncNow() {
		if (!this.user || !this.client || !navigator.onLine) return;
		const { error } = await this.client.from('user_app_data').upsert({
			user_id: this.user.id,
			data: appStore.getCloudSnapshot(),
			updated_at: new Date().toISOString()
		});
		if (error) {
			console.error('Errore sincronizzazione dati:', error);
			if (typeof showToast === 'function') showToast(window.shiftNetI18n.t('syncError'), 'warning');
		}
	}

	async signOut() {
		if (!this.client) return;
		const { error } = await this.client.auth.signOut();
		if (error) {
			this.setFeedback(window.shiftNetI18n.t('authError'), 'error');
			return;
		}
		Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
		location.reload();
	}
}
