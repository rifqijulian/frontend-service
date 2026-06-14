// Authentication logic

// Check user login session
function cekOtorisasiSesi() {
    const token = localStorage.getItem('token');
    const pathName = window.location.pathname;
    const isDashboard = pathName.includes('dashboard.html');
    const isAuthPage = pathName.includes('login.html') || pathName.includes('register.html');

    if (token) {
        // If logged in and on auth pages (login/register), redirect to dashboard
        if (isAuthPage) {
            window.location.href = 'dashboard.html';
        }
        // If on homepage (index.html), update navigation elements to show dashboard link and profile
        updateNavbarForLoggedInUser(true);
    } else {
        // If not logged in and trying to access dashboard, redirect to login
        if (isDashboard) {
            window.location.href = 'login.html';
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
        // Show navigation links for authenticated users
        navLinksContainer.innerHTML = `
            <a class="text-primary font-bold border-b-2 border-primary pb-1" href="dashboard.html">Dashboard</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors duration-200 pb-1" href="dashboard.html">History</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors duration-200 pb-1" href="#">Workshops</a>
        `;
        
        // Show notification, settings, profile, and logout
        navAuthContainer.innerHTML = `
            <button class="text-on-surface-variant hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <span class="material-symbols-outlined">notifications</span>
            </button>
            <button class="text-on-surface-variant hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <span class="material-symbols-outlined">settings</span>
            </button>
            <div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                <img alt="User profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHr1vhq4zgsh6mV7fpric_Q7FYnEHFS34xafLblG4SpsOo7Z0Rzo4fNALDB-Dd5atcMfLVO_1LzNXCvoysOnMiXdZaIUhNbhvOEE7OVh877rqp1eih8Ze5PJRUYcMtbxxaUeyKeldJs8YO1t_NyRqyzmZKJUtVnDUgPoBEeOO5dtX2ww4RUDzmJwmkapyDtKkh87q1-RUNcEzZNhrxYi-zzAnGMx4KXMT6i4X3OuxBebF1fpLGEipdVwLugjh4Gk0uGq0wAXmealYs"/>
            </div>
            <button onclick="prosesLogout()" class="bg-transparent border border-outline text-on-surface hover:text-primary hover:border-primary font-label-sm text-[12px] uppercase px-3 py-1.5 rounded transition-all duration-300">
                Logout
            </button>
        `;
    } else {
        // Show navigation links for guest users
        navLinksContainer.innerHTML = `
            <a class="text-primary font-bold border-b-2 border-primary pb-1" href="index.html">Home</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors duration-200 pb-1" href="#workflow">Workflow</a>
        `;

        // Show Sign In and Get Started buttons
        navAuthContainer.innerHTML = `
            <a href="login.html" class="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md uppercase">Sign In</a>
            <a href="register.html" class="bg-primary text-on-primary font-label-sm text-[12px] uppercase px-4 py-2 rounded hover:bg-primary-fixed-dim transition-all duration-300 hover-glow">
                Get Started
            </a>
        `;
    }
}

// Handle account registration process
async function prosesRegister(event) {
    event.preventDefault();
    const regNamaElem = document.getElementById('reg-nama');
    const nama = regNamaElem ? regNamaElem.value : `${document.getElementById('fname').value} ${document.getElementById('lname').value}`.trim();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const respon = await fetch(`${URL_API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, email, password })
        });
        const data = await respon.json();
        
        if (respon.ok) {
            showToast(data.pesan, 'success');
            document.getElementById('form-register').reset();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showToast(data.pesan, 'error');
        }
    } catch (error) {
        showToast('Gagal terhubung ke peladen backend!', 'error');
    }
}

// Handle login process
async function prosesLogin(event) {
    event.preventDefault();
    const loginEmailElem = document.getElementById('login-email');
    const email = loginEmailElem ? loginEmailElem.value : document.getElementById('email').value;
    const loginPasswordElem = document.getElementById('login-password');
    const password = loginPasswordElem ? loginPasswordElem.value : document.getElementById('password').value;

    try {
        const respon = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await respon.json();
        
        if (respon.ok) {
            localStorage.setItem('token', data.token);
            showToast('Login berhasil! Mengalihkan ke dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast(data.pesan, 'error');
        }
    } catch (error) {
        showToast('Gagal melakukan proses masuk!', 'error');
    }
}

// Process user logout
function prosesLogout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Helper: Toast notification helper
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const borderColor = type === 'success' ? 'border-primary' : 'border-error';
    const bgIconColor = type === 'success' ? 'bg-primary/10 text-primary' : 'bg-error-container/20 text-error';
    const iconName = type === 'success' ? 'check_circle' : 'warning';
    
    toast.className = `glass-panel border-l-4 ${borderColor} p-4 rounded shadow-xl min-w-[300px] transform translate-x-full transition-all duration-300 flex items-start gap-3`;
    toast.innerHTML = `
        <div class="${bgIconColor} p-1.5 rounded shrink-0">
            <span class="material-symbols-outlined text-md">${iconName}</span>
        </div>
        <div class="flex-1">
            <p class="text-sm font-semibold text-on-surface">${type === 'success' ? 'Sukses' : 'Gagal'}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 50);
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
