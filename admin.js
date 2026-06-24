// ===== Admin Panel JavaScript (Firebase-backed) =====

const DEFAULT_PASSWORD = 'sapna2024';
let useFirebase = typeof firebase !== 'undefined' && firebase.apps.length > 0;

// ===== Authentication =====
function checkAuth() {
    if (useFirebase) {
        // Check Firebase auth state
        auth.onAuthStateChanged(user => {
            if (user) {
                showDashboard();
            }
        });
    }
    // Also check session storage for simple password auth
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (useFirebase) {
        // Try Firebase email/password auth
        const email = 'admin@sapnamehndi.com'; // Default admin email
        const user = await adminLogin(email, password);
        if (user) {
            sessionStorage.setItem('admin_logged_in', 'true');
            showDashboard();
            return;
        }
    }

    // Fallback: simple password check
    const storedPassword = localStorage.getItem('admin_password') || DEFAULT_PASSWORD;
    if (password === storedPassword) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showDashboard();
    } else {
        alert('Incorrect password! Default: sapna2024');
    }
});

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboardData();
}

function logout() {
    sessionStorage.removeItem('admin_logged_in');
    if (useFirebase) adminLogout();
    location.reload();
}

// ===== Tab Navigation =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');

        document.getElementById('pageTitle').textContent = item.textContent.trim();
        document.querySelector('.sidebar').classList.remove('active');

        if (tab === 'bookings') loadBookingsTable();
        if (tab === 'payments') loadPaymentsTable();
        if (tab === 'gallery') loadGalleryManager();
        if (tab === 'dashboard') loadDashboardData();
    });
});

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// ===== Data Access Layer =====
async function getBookings() {
    if (useFirebase) {
        try {
            const bookings = await getBookingsFromFirebase();
            if (bookings.length > 0) return bookings;
        } catch (e) {
            console.warn('Firebase fetch failed, using localStorage');
        }
    }
    return JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
}

async function updateBookingStatus(id, newStatus) {
    if (useFirebase) {
        const success = await updateBookingStatusFirebase(id, newStatus);
        if (success) return;
    }
    // Fallback to localStorage
    const bookings = JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
    const idx = bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
        bookings[idx].status = newStatus;
        localStorage.setItem('sapna_bookings', JSON.stringify(bookings));
    }
}

// ===== Dashboard Data =====
async function loadDashboardData() {
    const bookings = await getBookings();

    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingBookings').textContent =
        bookings.filter(b => b.status === 'pending').length;
    document.getElementById('confirmedBookings').textContent =
        bookings.filter(b => b.status === 'confirmed').length;

    const totalRev = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.amount || 0), 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRev.toLocaleString()}`;

    document.getElementById('todayDate').textContent =
        new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    loadUpcomingBookings(bookings);
    loadRevenueChart(bookings);
}

function loadUpcomingBookings(bookings) {
    const container = document.getElementById('upcomingBookings');
    const today = new Date().toISOString().split('T')[0];

    const upcoming = bookings
        .filter(b => b.date >= today && b.status !== 'cancelled')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming bookings</p>';
        return;
    }

    container.innerHTML = upcoming.map(b => `
        <div class="booking-item">
            <div class="booking-item-info">
                <h4>${b.customerName}</h4>
                <p>${formatService(b.service)} • ${formatDate(b.date)} • ${b.time || ''}</p>
            </div>
            <span class="badge badge-${b.status}">${b.status}</span>
        </div>
    `).join('');
}

function loadRevenueChart(bookings) {
    const container = document.getElementById('revenueBars');
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            label: d.toLocaleDateString('en-IN', { month: 'short' }),
            year: d.getFullYear(),
            month: d.getMonth()
        });
    }

    const monthlyRevenue = months.map(m => {
        return bookings
            .filter(b => {
                const bd = new Date(b.createdAt || b.date);
                return bd.getMonth() === m.month && bd.getFullYear() === m.year &&
                    (b.status === 'confirmed' || b.status === 'completed');
            })
            .reduce((sum, b) => sum + (b.amount || 0), 0);
    });

    const maxRev = Math.max(...monthlyRevenue, 1);

    container.innerHTML = months.map((m, i) => {
        const height = (monthlyRevenue[i] / maxRev) * 100;
        return `<div class="revenue-bar" style="height: ${Math.max(height, 3)}%" data-label="${m.label}" title="₹${monthlyRevenue[i].toLocaleString()}"></div>`;
    }).join('');
}

// ===== Bookings Table =====
async function loadBookingsTable() {
    const bookings = await getBookings();
    renderBookingsTable(bookings);
}

function renderBookingsTable(bookings) {
    const tbody = document.getElementById('bookingsTableBody');

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    }).map(b => `
        <tr>
            <td><strong>${b.id}</strong></td>
            <td>
                <div>${b.customerName}</div>
                <small style="color:#999">${b.phone}</small>
            </td>
            <td>${formatService(b.service)}</td>
            <td>
                <div>${formatDate(b.date)}</div>
                <small style="color:#999">${b.time || '-'}</small>
            </td>
            <td>₹${(b.amount || 0).toLocaleString()}</td>
            <td><span class="badge badge-${b.status}">${b.status}</span></td>
            <td>
                <div class="action-btns">
                    ${b.status === 'pending' ? `
                        <button class="btn-sm btn-confirm" onclick="handleStatusUpdate('${b.id}', 'confirmed')">✓</button>
                        <button class="btn-sm btn-cancel" onclick="handleStatusUpdate('${b.id}', 'cancelled')">✗</button>
                    ` : ''}
                    ${b.status === 'confirmed' ? `
                        <button class="btn-sm btn-complete" onclick="handleStatusUpdate('${b.id}', 'completed')">Done</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

async function handleStatusUpdate(id, newStatus) {
    await updateBookingStatus(id, newStatus);
    loadBookingsTable();
    loadDashboardData();
    showAdminNotification(`Booking marked as ${newStatus}`, 'success');
}

async function filterBookings() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchBooking').value.toLowerCase();
    let bookings = await getBookings();

    if (status !== 'all') {
        bookings = bookings.filter(b => b.status === status);
    }
    if (search) {
        bookings = bookings.filter(b =>
            (b.customerName || '').toLowerCase().includes(search) ||
            (b.phone || '').includes(search) ||
            (b.id || '').toLowerCase().includes(search)
        );
    }

    renderBookingsTable(bookings);
}

// ===== Payments Table =====
async function loadPaymentsTable() {
    const bookings = await getBookings();
    const tbody = document.getElementById('paymentsTableBody');

    const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalCollected = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);
    const pendingAmt = bookings
        .filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    document.getElementById('totalCollected').textContent = `₹${totalCollected.toLocaleString()}`;
    document.getElementById('pendingAmount').textContent = `₹${pendingAmt.toLocaleString()}`;

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No payments yet</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    }).map(b => `
        <tr>
            <td><strong>${b.id}</strong></td>
            <td>${b.customerName}</td>
            <td>${b.paymentType === 'full' ? 'Full Payment' : 'Booking Fee'}</td>
            <td>₹${(b.amount || 0).toLocaleString()}</td>
            <td>${formatDate(b.createdAt ? b.createdAt.split('T')[0] : b.date)}</td>
            <td><span class="badge badge-${b.status}">${b.status}</span></td>
        </tr>
    `).join('');
}

// ===== Gallery Manager (Firebase Storage) =====
async function loadGalleryManager() {
    const grid = document.getElementById('adminGalleryGrid');
    grid.innerHTML = '<p class="empty-state">Loading...</p>';

    let images = [];
    if (useFirebase) {
        images = await getGalleryFromFirebase();
    } else {
        images = JSON.parse(localStorage.getItem('sapna_gallery') || '[]');
    }

    if (images.length === 0) {
        grid.innerHTML = '<p class="empty-state">No images uploaded yet. Add images to showcase your work.</p>';
        return;
    }

    grid.innerHTML = images.map((img, i) => `
        <div class="gallery-admin-item">
            <img src="${img.url}" alt="${img.category || 'mehndi'}" loading="lazy">
            <button class="delete-btn" onclick="handleDeleteImage('${img.id || i}', '${img.fileName || ''}')">×</button>
        </div>
    `).join('');
}

async function handleGalleryUpload(event) {
    const files = event.target.files;
    if (!files.length) return;

    showAdminNotification(`Uploading ${files.length} image(s)...`, 'info');

    for (const file of files) {
        if (useFirebase) {
            const url = await uploadImageToFirebase(file, 'general');
            if (url) {
                showAdminNotification(`Uploaded: ${file.name}`, 'success');
            } else {
                showAdminNotification(`Failed to upload: ${file.name}`, 'error');
            }
        } else {
            // Fallback: localStorage with base64
            const reader = new FileReader();
            reader.onload = (e) => {
                const images = JSON.parse(localStorage.getItem('sapna_gallery') || '[]');
                images.push({
                    url: e.target.result,
                    category: 'general',
                    uploadedAt: new Date().toISOString()
                });
                localStorage.setItem('sapna_gallery', JSON.stringify(images));
            };
            reader.readAsDataURL(file);
        }
    }

    // Reload gallery after uploads
    setTimeout(() => loadGalleryManager(), 2000);
}

async function handleDeleteImage(imageId, fileName) {
    if (!confirm('Delete this image?')) return;

    if (useFirebase && fileName) {
        const success = await deleteGalleryImageFirebase(imageId, fileName);
        if (success) {
            showAdminNotification('Image deleted', 'success');
            loadGalleryManager();
            return;
        }
    }

    // Fallback
    const images = JSON.parse(localStorage.getItem('sapna_gallery') || '[]');
    images.splice(parseInt(imageId), 1);
    localStorage.setItem('sapna_gallery', JSON.stringify(images));
    loadGalleryManager();
    showAdminNotification('Image deleted', 'success');
}

function addGalleryItem() {
    document.getElementById('galleryUpload').click();
}

// ===== Settings (Firebase) =====
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const settings = {
        businessName: document.getElementById('businessName').value,
        phone: document.getElementById('businessPhone').value,
        upiId: document.getElementById('businessUPI').value,
        bookingFee: document.getElementById('bookingFee').value,
        instagram: document.getElementById('instagramHandle').value,
        whatsapp: document.getElementById('whatsappNumber').value
    };

    if (useFirebase) {
        await saveSettingsToFirebase(settings);
    }
    localStorage.setItem('sapna_settings', JSON.stringify(settings));
    showAdminNotification('Settings saved!', 'success');
});

document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    const storedPass = localStorage.getItem('admin_password') || DEFAULT_PASSWORD;

    if (current !== storedPass) {
        showAdminNotification('Current password is incorrect', 'error');
        return;
    }
    if (newPass !== confirm) {
        showAdminNotification('New passwords do not match', 'error');
        return;
    }
    if (newPass.length < 4) {
        showAdminNotification('Password must be at least 4 characters', 'error');
        return;
    }

    localStorage.setItem('admin_password', newPass);
    showAdminNotification('Password updated!', 'success');
    e.target.reset();
});

async function loadSettings() {
    let settings = null;
    if (useFirebase) {
        settings = await getSettingsFromFirebase();
    }
    if (!settings) {
        settings = JSON.parse(localStorage.getItem('sapna_settings') || '{}');
    }
    if (settings.businessName) document.getElementById('businessName').value = settings.businessName;
    if (settings.phone) document.getElementById('businessPhone').value = settings.phone;
    if (settings.upiId) document.getElementById('businessUPI').value = settings.upiId;
    if (settings.bookingFee) document.getElementById('bookingFee').value = settings.bookingFee;
    if (settings.instagram) document.getElementById('instagramHandle').value = settings.instagram;
    if (settings.whatsapp) document.getElementById('whatsappNumber').value = settings.whatsapp;
}

// ===== Data Export =====
async function exportBookings() {
    const bookings = await getBookings();
    if (bookings.length === 0) {
        showAdminNotification('No bookings to export', 'error');
        return;
    }

    const headers = ['Order ID', 'Customer Name', 'Phone', 'Service', 'Date', 'Time', 'Amount', 'Payment Type', 'Status', 'Created At'];
    const rows = bookings.map(b => [
        b.id, b.customerName, b.phone, b.service, b.date, b.time, b.amount, b.paymentType, b.status, b.createdAt
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(v => `"${v || ''}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sapna_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showAdminNotification('Bookings exported!', 'success');
}

function clearAllData() {
    if (!confirm('⚠️ This will delete ALL bookings and gallery data. Are you sure?')) return;
    if (!confirm('This action CANNOT be undone. Final confirmation?')) return;

    localStorage.removeItem('sapna_bookings');
    localStorage.removeItem('sapna_gallery');
    // Note: Firebase data needs to be cleared manually from console for safety
    loadDashboardData();
    showAdminNotification('Local data cleared. Firebase data intact (clear from Firebase Console if needed).', 'success');
}

// ===== Test Booking =====
async function addTestBooking() {
    const names = ['Priya Sharma', 'Neha Gupta', 'Anita Singh', 'Riya Patel', 'Kavita Jha'];
    const services = ['bridal', 'engagement', 'arabic', 'party', 'minimal', 'baby-shower'];
    const statuses = ['pending', 'confirmed', 'pending'];
    const times = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));

    const service = services[Math.floor(Math.random() * services.length)];
    const amounts = { bridal: 5000, engagement: 2000, arabic: 1500, party: 500, minimal: 300, 'baby-shower': 2000 };

    const booking = {
        id: 'SM' + Date.now().toString(36).toUpperCase(),
        customerName: names[Math.floor(Math.random() * names.length)],
        phone: '98' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
        service: service,
        date: randomDate.toISOString().split('T')[0],
        time: times[Math.floor(Math.random() * times.length)],
        persons: Math.floor(Math.random() * 5) + 1,
        location: 'Jamshedpur',
        notes: '',
        paymentType: Math.random() > 0.5 ? 'full' : 'booking',
        amount: Math.random() > 0.5 ? amounts[service] : 500,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date().toISOString()
    };

    if (useFirebase) {
        await saveBookingToFirebase(booking);
    }
    // Also save locally
    const bookings = JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('sapna_bookings', JSON.stringify(bookings));

    loadBookingsTable();
    loadDashboardData();
    showAdminNotification(`Test booking added: ${booking.customerName}`, 'success');
}

// ===== Helpers =====
function formatService(service) {
    const names = {
        'bridal': 'Bridal Mehndi',
        'engagement': 'Engagement',
        'arabic': 'Arabic Mehndi',
        'indo-arabic': 'Indo-Arabic',
        'party': 'Party Mehndi',
        'minimal': 'Finger / Minimal',
        'baby-shower': 'Baby Shower'
    };
    return names[service] || service;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function showAdminNotification(msg, type = 'success') {
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()">×</button>`;

    const bgColors = { success: '#4CAF50', error: '#f44336', info: '#2196F3' };
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '14px 22px',
        borderRadius: '10px',
        background: bgColors[type] || bgColors.success,
        color: '#fff',
        fontSize: '0.9rem',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        fontFamily: 'Poppins, sans-serif'
    });
    notification.querySelector('button').style.cssText =
        'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;';

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// ===== Initialize =====
checkAuth();
loadSettings();
