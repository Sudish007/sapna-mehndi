// ===== UPI Payment Integration =====
// Configuration - UPDATE THESE VALUES
const UPI_CONFIG = {
    merchantName: 'Sapna Mehndi Art',
    upiId: 'sapnamehndi@upi', // Replace with actual UPI ID
    merchantPhone: '919110106612', // Replace with actual phone
    bookingFee: 500,
    currency: 'INR'
};

// Service pricing map (minimum amounts)
const SERVICE_PRICING = {
    'bridal': { min: 5000, max: 15000 },
    'engagement': { min: 2000, max: 5000 },
    'arabic': { min: 1500, max: 4000 },
    'indo-arabic': { min: 2000, max: 5000 },
    'party': { min: 500, max: 1500 },
    'minimal': { min: 300, max: 800 },
    'baby-shower': { min: 2000, max: 5000 }
};

// Current payment state
let currentPayment = {
    amount: 0,
    type: '', // 'booking' or 'full'
    service: '',
    customerName: '',
    transactionNote: '',
    orderId: ''
};

// ===== Override the booking form submit =====
document.getElementById('bookingForm').removeEventListener('submit', () => {});
document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);

function handleBookingSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid 10-digit Indian phone number', 'error');
        return;
    }

    // Validate date
    if (!data.date) {
        showNotification('Please select a date', 'error');
        return;
    }

    // Determine payment amount
    const serviceInfo = SERVICE_PRICING[data.service];
    const paymentType = data.payment;
    let amount = 0;

    if (paymentType === 'booking') {
        amount = UPI_CONFIG.bookingFee;
    } else {
        // Full payment - use minimum service price
        amount = serviceInfo ? serviceInfo.min : 500;
    }

    // Generate order ID
    const orderId = 'SM' + Date.now().toString(36).toUpperCase();

    // Set current payment state
    currentPayment = {
        amount: amount,
        type: paymentType,
        service: data.service,
        customerName: data.name,
        customerPhone: data.phone,
        date: data.date,
        time: data.time,
        persons: data.persons || 1,
        location: data.location || '',
        notes: data.notes || '',
        transactionNote: `${orderId} - ${data.service} mehndi - ${data.name}`,
        orderId: orderId
    };

    // Open UPI payment modal
    openUPIModal();
}

// ===== UPI Modal Functions =====
function openUPIModal() {
    const modal = document.getElementById('upiModal');
    const summary = document.getElementById('upiSummary');

    // Build summary
    const payLabel = currentPayment.type === 'full' 
        ? 'Full Payment (₹500 saved!)' 
        : 'Booking Fee (pay remaining on appointment)';

    summary.innerHTML = `
        <div class="upi-summary-card">
            <div class="summary-row"><span>Service:</span><strong>${formatService(currentPayment.service)}</strong></div>
            <div class="summary-row"><span>Date:</span><strong>${currentPayment.date}</strong></div>
            <div class="summary-row"><span>Payment Type:</span><strong>${payLabel}</strong></div>
            <div class="summary-row total"><span>Amount to Pay:</span><strong>₹${currentPayment.amount.toLocaleString()}</strong></div>
            <div class="summary-row"><span>Order ID:</span><strong>${currentPayment.orderId}</strong></div>
        </div>
    `;

    // Generate QR code
    generateQRCode();

    // Update WhatsApp link
    const whatsappMsg = encodeURIComponent(
        `💰 *Payment Confirmation*\n\n` +
        `Order ID: ${currentPayment.orderId}\n` +
        `Name: ${currentPayment.customerName}\n` +
        `Phone: ${currentPayment.customerPhone}\n` +
        `Service: ${formatService(currentPayment.service)}\n` +
        `Amount Paid: ₹${currentPayment.amount}\n` +
        `Date: ${currentPayment.date}\n` +
        `Time: ${currentPayment.time}\n\n` +
        `Please confirm my booking. Sharing payment screenshot.`
    );
    document.getElementById('upiWhatsappLink').href = 
        `https://wa.me/919110106612?text=${whatsappMsg}`;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeUPIModal() {
    document.getElementById('upiModal').style.display = 'none';
    document.body.style.overflow = '';
}

// ===== Pay with specific UPI app =====
function payWithUPI(app) {
    const amount = currentPayment.amount;
    const note = currentPayment.transactionNote;
    const upiId = UPI_CONFIG.upiId;
    const name = UPI_CONFIG.merchantName;

    // Build UPI deep link URL
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${UPI_CONFIG.currency}&tn=${encodeURIComponent(note)}`;

    // App-specific deep links
    const appLinks = {
        'gpay': `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${UPI_CONFIG.currency}&tn=${encodeURIComponent(note)}`,
        'phonepe': `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${UPI_CONFIG.currency}&tn=${encodeURIComponent(note)}`,
        'paytm': `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${UPI_CONFIG.currency}&tn=${encodeURIComponent(note)}`,
        'bhim': `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${UPI_CONFIG.currency}&tn=${encodeURIComponent(note)}`,
        'generic': upiUrl
    };

    const link = appLinks[app] || upiUrl;

    // Try to open the app
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Show fallback message after a delay
    setTimeout(() => {
        showNotification(
            `If ${getAppName(app)} didn't open, scan the QR code below or copy the UPI ID manually.`,
            'info'
        );
    }, 2000);

    // Save booking to localStorage for admin panel
    saveBooking();
}

// ===== QR Code Generation (Simple SVG-based) =====
function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    const amount = currentPayment.amount;
    const upiId = UPI_CONFIG.upiId;
    const name = UPI_CONFIG.merchantName;
    const note = currentPayment.transactionNote;

    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Generate a visual QR placeholder with the UPI link
    // For production, use a library like qrcode.js
    qrContainer.innerHTML = `
        <div class="qr-placeholder">
            <div class="qr-visual">
                <svg viewBox="0 0 200 200" width="180" height="180">
                    <rect width="200" height="200" fill="#fff"/>
                    <rect x="10" y="10" width="60" height="60" fill="none" stroke="#000" stroke-width="4"/>
                    <rect x="20" y="20" width="40" height="40" fill="#000"/>
                    <rect x="130" y="10" width="60" height="60" fill="none" stroke="#000" stroke-width="4"/>
                    <rect x="140" y="20" width="40" height="40" fill="#000"/>
                    <rect x="10" y="130" width="60" height="60" fill="none" stroke="#000" stroke-width="4"/>
                    <rect x="20" y="140" width="40" height="40" fill="#000"/>
                    <rect x="80" y="80" width="40" height="40" fill="#8B1A4A"/>
                    <text x="100" y="105" text-anchor="middle" font-size="8" fill="#fff">₹${amount}</text>
                    <!-- Pattern blocks -->
                    <rect x="85" y="15" width="10" height="10" fill="#000"/>
                    <rect x="100" y="15" width="10" height="10" fill="#000"/>
                    <rect x="85" y="30" width="10" height="10" fill="#000"/>
                    <rect x="115" y="30" width="10" height="10" fill="#000"/>
                    <rect x="85" y="45" width="10" height="10" fill="#000"/>
                    <rect x="100" y="45" width="10" height="10" fill="#000"/>
                    <rect x="85" y="130" width="10" height="10" fill="#000"/>
                    <rect x="100" y="140" width="10" height="10" fill="#000"/>
                    <rect x="130" y="85" width="10" height="10" fill="#000"/>
                    <rect x="145" y="100" width="10" height="10" fill="#000"/>
                    <rect x="160" y="85" width="10" height="10" fill="#000"/>
                    <rect x="175" y="100" width="10" height="10" fill="#000"/>
                    <rect x="130" y="130" width="15" height="15" fill="#000"/>
                    <rect x="155" y="130" width="15" height="15" fill="#000"/>
                    <rect x="130" y="155" width="15" height="15" fill="#000"/>
                    <rect x="155" y="155" width="10" height="10" fill="#000"/>
                    <rect x="175" y="175" width="15" height="15" fill="#000"/>
                </svg>
            </div>
            <p class="qr-note">Scan with any UPI app to pay ₹${amount}</p>
            <p class="qr-upi-link" style="font-size:0.7rem;color:#999;word-break:break-all;margin-top:8px;">${upiString}</p>
        </div>
    `;
}

// ===== Copy UPI ID =====
function copyUPIId() {
    const field = document.getElementById('upiIdField');
    field.select();
    navigator.clipboard.writeText(field.value).then(() => {
        showNotification('UPI ID copied! Open your UPI app and pay.', 'success');
    }).catch(() => {
        // Fallback
        document.execCommand('copy');
        showNotification('UPI ID copied!', 'success');
    });
}

// ===== Save Booking to Firebase + LocalStorage (for Admin Panel) =====
function saveBooking() {
    const booking = {
        id: currentPayment.orderId,
        customerName: currentPayment.customerName,
        phone: currentPayment.customerPhone,
        service: currentPayment.service,
        date: currentPayment.date,
        time: currentPayment.time,
        persons: currentPayment.persons,
        location: currentPayment.location,
        notes: currentPayment.notes,
        paymentType: currentPayment.type,
        amount: currentPayment.amount,
        status: 'pending', // pending, confirmed, completed, cancelled
        createdAt: new Date().toISOString()
    };

    // Save to Firebase (if available)
    if (typeof saveBookingToFirebase === 'function') {
        saveBookingToFirebase(booking);
    }

    // Also save to localStorage as fallback
    const bookings = JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('sapna_bookings', JSON.stringify(bookings));
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

function getAppName(app) {
    const names = {
        'gpay': 'Google Pay',
        'phonepe': 'PhonePe',
        'paytm': 'Paytm',
        'bhim': 'BHIM',
        'generic': 'UPI App'
    };
    return names[app] || 'UPI App';
}

// Override notification for info type
const originalShowNotification = window.showNotification;
window.showNotification = function(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${msg}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);

    const bgColors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'info': '#2196F3'
    };

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        background: bgColors[type] || bgColors.success,
        color: '#fff',
        fontSize: '0.95rem',
        zIndex: '10002',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease',
        maxWidth: '90vw'
    });

    notification.querySelector('button').style.cssText = 
        'background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;';

    setTimeout(() => notification.remove(), 5000);
};
