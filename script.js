// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Gallery Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.display = '';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });
    });
});

// ===== Booking Form - Date Setup =====
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Note: Booking form submit is handled by upi-payment.js

// ===== Notification System =====
function showNotification(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${msg}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        background: type === 'error' ? '#f44336' : '#4CAF50',
        color: '#fff',
        fontSize: '0.95rem',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease'
    });

    notification.querySelector('button').style.cssText = 
        'background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;';

    setTimeout(() => notification.remove(), 5000);
}

// ===== Booking Confirmation Modal =====
function showBookingConfirmation(message, whatsappMsg) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.booking-modal').remove()">&times;</button>
            <div class="modal-icon">🎉</div>
            <h3>Booking Summary</h3>
            <pre style="white-space:pre-wrap;font-family:inherit;text-align:left;background:#f9f5f2;padding:20px;border-radius:10px;margin:20px 0;font-size:0.9rem;">${message}</pre>
            <p style="margin-bottom:20px;color:#666;font-size:0.9rem;">Click below to confirm via WhatsApp. Sapna will reach out to finalize your booking.</p>
            <a href="https://wa.me/919876543210?text=${whatsappMsg}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="display:inline-block;text-decoration:none;padding:14px 32px;border-radius:50px;background:#25D366;color:#fff;font-weight:500;">
                💬 Confirm on WhatsApp
            </a>
            <p style="margin-top:15px;font-size:0.8rem;color:#999;">Or call: +91 98765 43210</p>
        </div>
    `;

    // Modal styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-modal {
            position: fixed;
            inset: 0;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            position: relative;
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #999;
        }
        .modal-icon {
            font-size: 3rem;
            margin-bottom: 10px;
        }
        .modal-content h3 {
            font-family: 'Playfair Display', serif;
            color: #8B1A4A;
            font-size: 1.5rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// ===== Smooth Scroll for Safari =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Add slideIn animation =====
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(animStyle);


// ===== Enrollment Form Handler =====
const enrollForm = document.getElementById('enrollForm');
if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(enrollForm);
        const data = Object.fromEntries(formData.entries());

        // Validate phone
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // Course pricing
        const coursePricing = {
            'beginner': 2500,
            'intermediate': 4500,
            'professional': 8000
        };

        const paymentType = data['enroll-payment'];
        const courseAmount = coursePricing[data.course] || 2500;
        const amount = paymentType === 'full' ? courseAmount : 500;

        // Build WhatsApp message
        const whatsappMsg = encodeURIComponent(
            `📚 *New Course Enrollment*\n\n` +
            `👤 Name: ${data.name}\n` +
            `📞 Phone: ${data.phone}\n` +
            `📖 Course: ${data.course}\n` +
            `📅 Batch: ${data.batch}\n` +
            `💰 Payment: ${paymentType === 'full' ? 'Full Fee ₹' + courseAmount : 'Registration ₹500'}\n\n` +
            `Please confirm my enrollment.`
        );

        // Show confirmation
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.booking-modal').remove()">&times;</button>
                <div class="modal-icon">📚</div>
                <h3>Enrollment Summary</h3>
                <div style="text-align:left;background:#f9f5f2;padding:20px;border-radius:10px;margin:20px 0;">
                    <p><strong>Course:</strong> ${data.course.charAt(0).toUpperCase() + data.course.slice(1)}</p>
                    <p><strong>Batch:</strong> ${data.batch === 'weekday' ? 'Weekday (Mon, Wed, Fri)' : 'Weekend (Sat & Sun)'}</p>
                    <p><strong>Amount:</strong> ₹${amount.toLocaleString()} ${paymentType === 'full' ? '(Full - ₹500 saved!)' : '(Registration fee)'}</p>
                </div>
                <a href="https://wa.me/919110106612?text=${whatsappMsg}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="display:inline-block;text-decoration:none;padding:14px 32px;border-radius:50px;background:#25D366;color:#fff;font-weight:500;">
                    💬 Confirm on WhatsApp
                </a>
                <p style="margin-top:12px;font-size:0.8rem;color:#999;">Sapna will confirm your seat and share class details</p>
            </div>
        `;

        // Add modal styles if not already
        if (!document.querySelector('.enrollment-modal-style')) {
            const style = document.createElement('style');
            style.className = 'enrollment-modal-style';
            style.textContent = `
                .booking-modal { position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px; }
                .booking-modal .modal-overlay { position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(5px); }
                .booking-modal .modal-content { position:relative;background:#fff;padding:40px;border-radius:16px;max-width:450px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3); }
                .booking-modal .modal-close { position:absolute;top:15px;right:20px;background:none;border:none;font-size:1.8rem;cursor:pointer;color:#999; }
                .booking-modal .modal-icon { font-size:3rem;margin-bottom:10px; }
                .booking-modal .modal-content h3 { font-family:'Playfair Display',serif;color:#8B1A4A;font-size:1.5rem; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(modal);

        // Save enrollment to localStorage / Firebase
        const enrollment = {
            id: 'EN' + Date.now().toString(36).toUpperCase(),
            customerName: data.name,
            phone: data.phone,
            service: 'course-' + data.course,
            date: new Date().toISOString().split('T')[0],
            time: data.batch,
            paymentType: paymentType,
            amount: amount,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        if (typeof saveBookingToFirebase === 'function') {
            saveBookingToFirebase(enrollment);
        }
        const bookings = JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
        bookings.push(enrollment);
        localStorage.setItem('sapna_bookings', JSON.stringify(bookings));
    });
}
