/**
 * FlexoGig Core Application Logic
 * Handles Authentication, Navigation, Job Feed Fallback, and Profile Management.
 */

const app = {
    currentUser: null,
    users: JSON.parse(localStorage.getItem('flexogig_users')) || [],
    applications: JSON.parse(localStorage.getItem('flexogig_applications')) || [],

    // Pre-populated Job Data
    gigs: [
        { id: 1, category: 'Cafe', title: 'Weekend Barista', company: 'The Brew House', pay: 150, hours: '10 AM - 4 PM', city: 'Mumbai', contact: 'Ramesh: 9812345670', address: 'Bandra West, Opp Station' },
        { id: 2, category: 'Library', title: 'Book Cataloger', company: 'City Public Library', pay: 120, hours: '4 PM - 8 PM', city: 'Delhi', contact: 'Anjali: 9812345671', address: 'Connaught Place' },
        { id: 3, category: 'Tutor', title: 'Math Tutor (Grade 8)', company: 'Private Client', pay: 300, hours: '5 PM - 7 PM', city: 'Bangalore', contact: 'Suresh: 9812345672', address: 'Koramangala 5th Block' },
        { id: 4, category: 'Retail', title: 'Stock Room Assistant', company: 'Lifestyle Store', pay: 180, hours: '12 PM - 6 PM', city: 'Mumbai', contact: 'Manager: 9812345673', address: 'Phoenix Marketcity' },
        { id: 5, category: 'Delivery', title: 'Pizza Delivery Partner', company: 'Local Slice', pay: 200, hours: '6 PM - 11 PM', city: 'Pune', contact: 'Shop: 9812345674', address: 'MG Road' },
        { id: 6, category: 'Events', title: 'Registration Desk Staff', company: 'BigEvents Co', pay: 250, hours: '9 AM - 6 PM', city: 'Hyderabad', contact: 'Vikram: 9812345675', address: 'HITEX Exhibition Center' },
        { id: 7, category: 'Cafe', title: 'Front of House', company: 'Blue Tokai', pay: 160, hours: '8 AM - 1 PM', city: 'Delhi', contact: 'HR: 9812345676', address: 'Hauz Khas Village' },
        { id: 8, category: 'Retail', title: 'Cashier (Local Mart)', company: 'Reliance Fresh', pay: 140, hours: '1 PM - 9 PM', city: 'Chennai', contact: 'Supervisor: 9812345677', address: 'Adyar' },
        { id: 9, category: 'Tutor', title: 'English Conversationalist', company: 'Online Platform', pay: 350, hours: 'Flexible', city: 'Remote', contact: 'Recruiter: 9812345678', address: 'Home Work' },
        { id: 10, category: 'Delivery', title: 'Document Courier', company: 'QuickSend', pay: 170, hours: '10 AM - 5 PM', city: 'Mumbai', contact: 'Reception: 9812345679', address: 'Andheri East' }
    ],

    init() {
        // Hydrate current session
        const session = sessionStorage.getItem('flexogig_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.navigate('dashboard');
        } else {
            this.navigate('home');
        }
    },

    navigate(view) {
        const container = document.getElementById('app-container');
        const navLinks = document.getElementById('nav-links');
        
        // Reset view
        container.innerHTML = '';

        // Dynamic Nav Links
        if (this.currentUser) {
            navLinks.innerHTML = `
                <span onclick="app.navigate('dashboard')">Dashboard</span>
                <span onclick="app.handleLogout()">Logout</span>
                <button class="btn btn-primary">${this.currentUser.name.split(' ')[0]}</button>
            `;
        } else {
            navLinks.innerHTML = `
                <span onclick="app.navigate('home')">Home</span>
                <span onclick="app.navigate('login')">Login</span>
                <button class="btn btn-primary" onclick="app.navigate('register')">Sign Up</button>
            `;
        }

        switch(view) {
            case 'home':
                container.appendChild(this.getTemplate('view-landing'));
                break;
            case 'login':
                container.appendChild(this.getTemplate('view-login'));
                break;
            case 'register':
                container.appendChild(this.getTemplate('view-register'));
                break;
            case 'dashboard':
                container.appendChild(this.getTemplate('view-dashboard'));
                this.renderDashboard('jobs');
                break;
        }
        window.scrollTo(0,0);
    },

    getTemplate(id) {
        return document.getElementById(id).cloneNode(true);
    },

    handleRegister(e) {
        e.preventDefault();
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
        
        const newUser = {
            name: document.getElementById('reg-name').value,
            phone: document.getElementById('reg-phone').value,
            aadhaar: document.getElementById('reg-aadhaar').value,
            age: document.getElementById('reg-age').value,
            address: document.getElementById('reg-address').value,
            gender: document.getElementById('reg-gender').value,
            password: document.getElementById('reg-password').value,
            interests: interests.length > 0 ? interests : ['General'],
            joined: new Date().toLocaleDateString()
        };

        // Basic duplicate check
        if (this.users.find(u => u.phone === newUser.phone)) {
            alert('Phone number already registered. Please login.');
            return;
        }

        this.users.push(newUser);
        localStorage.setItem('flexogig_users', JSON.stringify(this.users));
        alert('Account Created! Please login.');
        this.navigate('login');
    },

    handleLogin(e) {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value;
        const pass = document.getElementById('login-password').value;

        const user = this.users.find(u => u.phone === phone && u.password === pass);
        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('flexogig_session', JSON.stringify(user));
            this.navigate('dashboard');
        } else {
            alert('Invalid credentials. Hint: register first!');
        }
    },

    handleLogout() {
        this.currentUser = null;
        sessionStorage.removeItem('flexogig_session');
        this.navigate('home');
    },

    renderDashboard(tab) {
        const content = document.getElementById('dash-main-content');
        document.getElementById('dash-user-name').innerText = this.currentUser.name;
        
        if (tab === 'jobs') {
            content.innerHTML = `
                <div class="dash-header">
                    <h2>Matching Gigs For You</h2>
                    <p>Priority based on your interests: ${this.currentUser.interests.join(', ')}</p>
                </div>
                <div class="job-feed" id="job-list"></div>
            `;
            this.renderGigs();
        } else if (tab === 'applications') {
            const userApps = this.applications.filter(a => a.userPhone === this.currentUser.phone);
            content.innerHTML = `
                <h2>Your Applications</h2>
                <div class="job-feed">
                    ${userApps.length ? userApps.map(a => `
                        <div class="app-card">
                            <div>
                                <h4>${a.jobTitle}</h4>
                                <small>${a.company} • Applied on ${a.date}</small>
                            </div>
                            <div class="app-status status-pending">Status: Pending</div>
                        </div>
                    `).join('') : '<p>No applications yet. Start exploring!</p>'}
                </div>
            `;
        } else if (tab === 'profile-edit') {
            content.innerHTML = `
                <h2>Edit Profile</h2>
                <form id="profile-form" class="auth-card wide" onsubmit="app.updateProfile(event)">
                    <div class="form-grid">
                        <div class="form-group"><label>Full Name</label><input value="${this.currentUser.name}" id="edit-name"></div>
                        <div class="form-group"><label>Aadhaar</label><input value="${this.currentUser.aadhaar}" disabled></div>
                        <div class="form-group full-width"><label>Self Description / Resume Summary</label>
                        <textarea id="edit-desc" rows="4">Independent student looking for experience.</textarea></div>
                    </div>
                    <button class="btn btn-primary" type="submit">Save Profile Changes</button>
                </form>
            `;
        }
    },

    switchDashTab(tab) {
        const items = document.querySelectorAll('.dash-nav li');
        items.forEach(i => i.classList.remove('active'));
        event.currentTarget.classList.add('active');
        this.renderDashboard(tab);
    },

    renderGigs() {
        const list = document.getElementById('job-list');
        // Smart Fallback Logic:
        // 1. Filter jobs that match user interests
        // 2. If none match, show all (to ensure seeker never sees empty screen)
        let filtered = this.gigs.filter(g => this.currentUser.interests.includes(g.category));
        
        let isFallback = false;
        if (filtered.length === 0) {
            filtered = this.gigs;
            isFallback = true;
        }

        list.innerHTML = (isFallback ? '<div class="notice">Note: No specific matches for your interests. Here are all available gigs!</div>' : '') + 
        filtered.map(g => `
            <div class="job-card">
                <div class="job-main">
                    <span class="badge badge-${g.category.toLowerCase()}">${g.category}</span>
                    <h3>${g.title}</h3>
                    <div class="job-meta">
                        <span><i class="fas fa-building"></i> ${g.company}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${g.city}</span>
                    </div>
                    <div class="job-details">
                        <p><strong><i class="fas fa-clock"></i> Shift:</strong> ${g.hours}</p>
                        <p><strong><i class="fas fa-phone"></i> Contact:</strong> ${g.contact}</p>
                        <a href="https://www.google.com/maps/search/${encodeURIComponent(g.address + ' ' + g.city)}" target="_blank" class="map-link">
                            <i class="fas fa-location-arrow"></i> View Location Map
                        </a>
                    </div>
                </div>
                <div class="job-actions">
                    <div class="pay">₹${g.pay}/hr</div>
                    <button class="btn btn-primary" onclick="app.applyForJob(${g.id}, '${g.title}', '${g.company}')">Quick Apply</button>
                </div>
            </div>
        `).join('');
    },

    applyForJob(id, title, company) {
        // Prevent double applications
        if (this.applications.find(a => a.jobId === id && a.userPhone === this.currentUser.phone)) {
            alert('You have already applied for this gig!');
            return;
        }

        const newApp = {
            jobId: id,
            jobTitle: title,
            company: company,
            userPhone: this.currentUser.phone,
            date: new Date().toLocaleDateString()
        };

        this.applications.push(newApp);
        localStorage.setItem('flexogig_applications', JSON.stringify(this.applications));
        alert('Application Successful! The employer will contact you on ' + this.currentUser.phone);
    },

    updateProfile(e) {
        e.preventDefault();
        const name = document.getElementById('edit-name').value;
        this.currentUser.name = name;
        
        // Update users array
        const idx = this.users.findIndex(u => u.phone === this.currentUser.phone);
        this.users[idx].name = name;
        
        localStorage.setItem('flexogig_users', JSON.stringify(this.users));
        sessionStorage.setItem('flexogig_session', JSON.stringify(this.currentUser));
        alert('Profile updated successfully!');
    }
};

// Initialize app when window loads
window.onload = () => app.init();
