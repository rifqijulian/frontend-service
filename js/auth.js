// Check user login session
function cekOtorisasiSesi() {
    const token = localStorage.getItem('token');
    const pathName = window.location.pathname;

    const isProtectedPage =
        pathName.includes('dashboard.html') ||
        pathName.includes('history.html') ||
        pathName.includes('workshops.html');

    const isAuthPage =
        pathName.includes('login.html') ||
        pathName.includes('register.html');

    if (token) {
        // Jika sudah login dan masih membuka login/register
        if (isAuthPage) {
            window.location.href = 'dashboard.html';
            return;
        }

        updateNavbarForLoggedInUser(true);
    } else {
        // Jika belum login dan membuka halaman yang dilindungi
        if (isProtectedPage) {
            window.location.href = 'login.html';
            return;
        }

        updateNavbarForLoggedInUser(false);
    }
}

// Update navigation bar dynamically based on authentication state
function updateNavbarForLoggedInUser(isLoggedIn) {
    const navAuthContainer = document.getElementById('nav-auth-container');
    const navLinksContainer = document.getElementById('nav-links-container');

    if (!navLinksContainer || !navAuthContainer) return;

    if (isLoggedIn) {

        const currentPage = window.location.pathname;

        navLinksContainer.innerHTML = `
            <a
                class="${
                    currentPage.includes('dashboard.html')
                        ? 'text-primary font-bold border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary'
                } transition-colors duration-200 pb-1"
                href="dashboard.html">
                Dashboard
            </a>

            <a
                class="${
                    currentPage.includes('history.html')
                        ? 'text-primary font-bold border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary'
                } transition-colors duration-200 pb-1"
                href="history.html">
                History
            </a>

            <a
                class="${
                    currentPage.includes('workshops.html')
                        ? 'text-primary font-bold border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary'
                } transition-colors duration-200 pb-1"
                href="workshops.html">
                Workshops
            </a>
        `;

        navAuthContainer.innerHTML = `
            <button class="text-on-surface-variant hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <span class="material-symbols-outlined">notifications</span>
            </button>

            <button class="text-on-surface-variant hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <span class="material-symbols-outlined">settings</span>
            </button>

            <div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                <img
                    alt="User profile"
                    class="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHr1vhq4zgsh6mV7fpric_Q7FYnEHFS34xafLblG4SpsOo7Z0Rzo4fNALDB-Dd5atcMfLVO_1LzNXCvoysOnMiXdZaIUhNbhvOEE7OVh877rqp1eih8Ze5PJRUYcMtbxxaUeyKeldJs8YO1t_NyRqyzmZKJUtVnDUgPoBEeOO5dtX2ww4RUDzmJwmkapyDtKkh87q1-RUNcEzZNhrxYi-zzAnGMx4KXMT6i4X3OuxBebF1fpLGEipdVwLugjh4Gk0uGq0wAXmealYs"/>
            </div>

            <button
                onclick="prosesLogout()"
                class="bg-transparent border border-outline text-on-surface hover:text-primary hover:border-primary font-label-sm text-[12px] uppercase px-3 py-1.5 rounded transition-all duration-300">
                Logout
            </button>
        `;

    } else {

        navLinksContainer.innerHTML = `
            <a class="text-primary font-bold border-b-2 border-primary pb-1"
               href="index.html">
               Home
            </a>

            <a class="text-on-surface-variant hover:text-primary transition-colors duration-200 pb-1"
               href="#workflow">
               Workflow
            </a>
        `;

        navAuthContainer.innerHTML = `
            <a href="login.html"
               class="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md uppercase">
               Sign In
            </a>

            <a href="register.html"
               class="bg-primary text-on-primary font-label-sm text-[12px] uppercase px-4 py-2 rounded hover:bg-primary-fixed-dim transition-all duration-300 hover-glow">
               Get Started
            </a>
        `;
    }
}

// Submit login data to API
async function prosesLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            showToast(data.pesan || 'Login gagal!', 'error');
        }
    } catch (error) {
        console.error('Error login:', error);
        showToast('Koneksi ke server gagal!', 'error');
    }
}

// Submit registration data to API
async function prosesRegister(event) {
    event.preventDefault();
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const nama = `${fname} ${lname}`.trim();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${URL_API}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nama, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.pesan || 'Registrasi berhasil!', 'success');
            // Reset register form inputs
            document.getElementById('form-register').reset();
            // Switch to login tab
            if (typeof switchTab === 'function') {
                switchTab('login');
            }
        } else {
            showToast(data.pesan || 'Registrasi gagal!', 'error');
        }
    } catch (error) {
        console.error('Error registrasi:', error);
        showToast('Koneksi ke server gagal!', 'error');
    }
}

// Logout user and clear session
function prosesLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Show custom toast notifications dynamically
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-primary/20 border-primary text-primary' : 'bg-error/20 border-error text-error';
    const icon = type === 'success' ? 'check_circle' : 'error';
    
    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded border shadow-2xl glass-panel transform translate-y-5 opacity-0 transition-all duration-300 ${bgClass}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-md">${icon}</span>
        <span class="text-xs font-semibold uppercase tracking-wider">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-5', 'opacity-0');
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        toast.classList.add('translate-y-5', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}