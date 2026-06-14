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