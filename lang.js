// ===== Language Toggle System =====
const translations = {
    en: {
        // Nav
        nav_home: "Home",
        nav_services: "Services",
        nav_gallery: "Gallery",
        nav_pricing: "Pricing",
        nav_book: "Book Now",
        nav_contact: "Contact",

        // Hero
        hero_subtitle: "✦ Jamshedpur's Trusted Mehndi Artist ✦",
        hero_title: "Beautiful Mehndi Designs<br>for Every Occasion",
        hero_desc: "Bridal, Arabic, Indo-Arabic, Party & more — crafted with love and precision by Sapna",
        hero_btn_book: "Book Appointment",
        hero_btn_work: "View My Work",
        hero_stat1: "Happy Brides",
        hero_stat2: "Years Experience",
        hero_stat3: "Designs Done",

        // Services
        services_title: "My Services",
        services_subtitle: "From intimate gatherings to grand weddings, I bring artistry to every occasion",
        svc_bridal_title: "Bridal Mehndi",
        svc_bridal_desc: "Full hands & feet intricate bridal designs. Traditional, modern, or fusion — your dream bridal mehndi, made real.",
        svc_bridal_price: "Starting ₹5,000",
        svc_arabic_title: "Arabic Mehndi",
        svc_arabic_desc: "Bold, flowing patterns with beautiful negative space. Perfect for engagements, parties, and festive occasions.",
        svc_arabic_price: "Starting ₹1,500",
        svc_indo_title: "Indo-Arabic",
        svc_indo_desc: "Best of both worlds — Indian intricacy meets Arabic elegance. A stunning fusion style loved by all.",
        svc_indo_price: "Starting ₹2,000",
        svc_party_title: "Party Mehndi",
        svc_party_desc: "Quick, trendy designs for festivals, birthdays, and celebrations. Get gorgeous mehndi in under 30 minutes.",
        svc_party_price: "Starting ₹500",
        svc_finger_title: "Finger & Minimal",
        svc_finger_desc: "Delicate finger trails and minimalist patterns. Modern, chic, and perfect for everyday elegance.",
        svc_finger_price: "Starting ₹300",
        svc_baby_title: "Baby Shower / Godh Bharai",
        svc_baby_desc: "Special designs for expecting mothers. Gentle, beautiful patterns celebrating new beginnings.",
        svc_baby_price: "Starting ₹2,000",

        // Gallery
        gallery_title: "My Work",
        gallery_subtitle: "Latest designs from my Instagram — updated automatically!",
        gallery_cta: "📷 See All Designs on Instagram",

        // Pricing
        pricing_title: "Pricing & Packages",
        pricing_subtitle: "Transparent pricing — no hidden charges. Choose what suits you best.",
        pkg_party_badge: "Popular",
        pkg_party_title: "Party Package",
        pkg_party_f1: "✓ Single hand or both hands",
        pkg_party_f2: "✓ Trendy modern designs",
        pkg_party_f3: "✓ 20-45 minutes per person",
        pkg_party_f4: "✓ Natural organic henna",
        pkg_party_f5: "✓ Home visit available",
        pkg_bridal_badge: "Best Value",
        pkg_bridal_title: "Bridal Package",
        pkg_bridal_f1: "✓ Full hands & feet (elbow/knee length)",
        pkg_bridal_f2: "✓ Customized bridal design",
        pkg_bridal_f3: "✓ Hidden groom's name",
        pkg_bridal_f4: "✓ Premium organic henna",
        pkg_bridal_f5: "✓ Free trial session",
        pkg_bridal_f6: "✓ Home visit included",
        pkg_bridal_f7: "✓ Aftercare tips & kit",
        pkg_engage_badge: "Elegant",
        pkg_engage_title: "Engagement Package",
        pkg_engage_f1: "✓ Both hands (front & back)",
        pkg_engage_f2: "✓ Arabic or Indo-Arabic style",
        pkg_engage_f3: "✓ 1-2 hours session",
        pkg_engage_f4: "✓ Organic henna paste",
        pkg_engage_f5: "✓ Home visit available",
        btn_book_now: "Book Now",
        payment_title: "💡 Payment Options",
        pay_booking_title: "Pay Booking Fee",
        pay_booking_desc: "Reserve your date with just <strong>₹500 booking fee</strong>. Pay the remaining amount on the day of appointment.",
        pay_full_title: "Pay Full Amount",
        pay_full_desc: "Pay the full amount upfront and get <strong>no booking charges</strong> — save ₹500! Plus get priority scheduling.",

        // Booking
        booking_title: "Book Your Appointment",
        booking_subtitle: "Secure your slot — dates fill up fast during wedding season!",
        form_name: "Your Name *",
        form_phone: "Phone Number *",
        form_email: "Email (Optional)",
        form_date: "Preferred Date *",
        form_time: "Preferred Time *",
        form_time_placeholder: "Select time slot",
        form_service: "Service Type *",
        form_service_placeholder: "Select service",
        form_persons: "Number of Persons",
        form_location: "Location / Address",
        form_notes: "Special Requests / Design Preference",
        form_notes_placeholder: "Describe your preferred design, reference images, or any special requests...",
        form_payment_title: "Choose Payment Option",
        form_pay_booking: "Pay ₹500 Booking Fee",
        form_pay_booking_desc: "Reserve your date now, pay remaining later",
        form_pay_full: "Pay Full Amount (Save ₹500!)",
        form_pay_full_desc: "No booking charges + priority scheduling",
        form_submit: "Confirm Booking →",
        form_note: "You will be redirected to payment. Booking confirmed after payment.",

        // Testimonials
        testimonials_title: "What Clients Say",
        test1_text: "\"Sapna did my bridal mehndi and it was absolutely stunning! Everyone at the wedding couldn't stop complimenting. The colour came out so dark and beautiful.\"",
        test1_author: "— Priya S., Bride",
        test2_text: "\"Booked her for my sister's engagement. She was punctual, professional, and the designs were gorgeous. Very reasonable pricing too!\"",
        test2_author: "— Neha K., Jamshedpur",
        test3_text: "\"Got mehndi done for Karwa Chauth. Quick, beautiful Arabic design. Sapna is so talented and sweet. Highly recommend!\"",
        test3_author: "— Anita M., Bistupur",

        // Instagram
        insta_title: "Latest on Instagram",
        insta_subtitle: "Follow for daily design inspiration, reels, and behind-the-scenes",
        insta_follow: "📸 Follow @jamshedpurmehndiartist",

        // WhatsApp CTA
        wa_title: "Have Questions? Chat with Sapna!",
        wa_desc: "Send your reference designs, ask about availability, or discuss custom packages",
        wa_btn: "💬 Chat on WhatsApp",

        // Footer
        footer_desc: "Professional mehndi artist serving Jamshedpur and nearby areas. Making every occasion beautiful with the art of henna.",
        footer_links: "Quick Links",
        footer_contact: "Contact",
        footer_hours: "Working Hours",
        footer_h1: "Mon - Sat: 9 AM - 8 PM",
        footer_h2: "Sunday: By appointment",
        footer_h3: "Home visits available",
        footer_h4: "Travels within 30 km",
        footer_copy: "© 2026 Sapna Mehndi Art, Jamshedpur. All rights reserved.",

        // Lang toggle
        lang_btn: "हिंदी"
    },
    hi: {
        // Nav
        nav_home: "होम",
        nav_services: "सेवाएं",
        nav_gallery: "गैलरी",
        nav_pricing: "मूल्य",
        nav_book: "बुक करें",
        nav_contact: "संपर्क",

        // Hero
        hero_subtitle: "✦ जमशेदपुर की विश्वसनीय मेहंदी आर्टिस्ट ✦",
        hero_title: "हर अवसर के लिए<br>खूबसूरत मेहंदी डिज़ाइन",
        hero_desc: "ब्राइडल, अरेबिक, इंडो-अरेबिक, पार्टी और भी बहुत कुछ — सपना द्वारा प्यार और कुशलता से बनाई गई",
        hero_btn_book: "अपॉइंटमेंट बुक करें",
        hero_btn_work: "मेरा काम देखें",
        hero_stat1: "खुश दुल्हनें",
        hero_stat2: "साल का अनुभव",
        hero_stat3: "डिज़ाइन पूरे",

        // Services
        services_title: "मेरी सेवाएं",
        services_subtitle: "छोटी महफिलों से लेकर भव्य शादियों तक, मैं हर अवसर पर कला लाती हूँ",
        svc_bridal_title: "ब्राइडल मेहंदी",
        svc_bridal_desc: "पूरे हाथ और पैर की जटिल ब्राइडल डिज़ाइन। पारंपरिक, मॉडर्न या फ्यूज़न — आपकी सपनों की ब्राइडल मेहंदी।",
        svc_bridal_price: "₹5,000 से शुरू",
        svc_arabic_title: "अरेबिक मेहंदी",
        svc_arabic_desc: "बोल्ड, बहती हुई पैटर्न। सगाई, पार्टी और त्योहारों के लिए एकदम सही।",
        svc_arabic_price: "₹1,500 से शुरू",
        svc_indo_title: "इंडो-अरेबिक",
        svc_indo_desc: "दोनों का सबसे अच्छा — भारतीय बारीकी और अरेबिक शान का शानदार मिश्रण।",
        svc_indo_price: "₹2,000 से शुरू",
        svc_party_title: "पार्टी मेहंदी",
        svc_party_desc: "त्योहारों, जन्मदिन और उत्सवों के लिए क्विक, ट्रेंडी डिज़ाइन। 30 मिनट में खूबसूरत मेहंदी।",
        svc_party_price: "₹500 से शुरू",
        svc_finger_title: "फिंगर और मिनिमल",
        svc_finger_desc: "नाज़ुक फिंगर ट्रेल्स और मिनिमलिस्ट पैटर्न। मॉडर्न और रोज़ाना के लिए परफेक्ट।",
        svc_finger_price: "₹300 से शुरू",
        svc_baby_title: "बेबी शॉवर / गोद भराई",
        svc_baby_desc: "गर्भवती माताओं के लिए विशेष डिज़ाइन। नई शुरुआत का जश्न मनाते सुंदर पैटर्न।",
        svc_baby_price: "₹2,000 से शुरू",

        // Gallery
        gallery_title: "मेरा काम",
        gallery_subtitle: "इंस्टाग्राम से नवीनतम डिज़ाइन — अपने आप अपडेट होते हैं!",
        gallery_cta: "📷 इंस्टाग्राम पर सभी डिज़ाइन देखें",

        // Pricing
        pricing_title: "मूल्य और पैकेज",
        pricing_subtitle: "पारदर्शी मूल्य — कोई छिपे शुल्क नहीं। जो आपको सूट करे वो चुनें।",
        pkg_party_badge: "लोकप्रिय",
        pkg_party_title: "पार्टी पैकेज",
        pkg_party_f1: "✓ एक हाथ या दोनों हाथ",
        pkg_party_f2: "✓ ट्रेंडी मॉडर्न डिज़ाइन",
        pkg_party_f3: "✓ 20-45 मिनट प्रति व्यक्ति",
        pkg_party_f4: "✓ नेचुरल ऑर्गेनिक हिना",
        pkg_party_f5: "✓ होम विज़िट उपलब्ध",
        pkg_bridal_badge: "सबसे अच्छा",
        pkg_bridal_title: "ब्राइडल पैकेज",
        pkg_bridal_f1: "✓ पूरे हाथ और पैर (कोहनी/घुटने तक)",
        pkg_bridal_f2: "✓ कस्टमाइज़्ड ब्राइडल डिज़ाइन",
        pkg_bridal_f3: "✓ छुपा हुआ दूल्हे का नाम",
        pkg_bridal_f4: "✓ प्रीमियम ऑर्गेनिक हिना",
        pkg_bridal_f5: "✓ फ्री ट्रायल सेशन",
        pkg_bridal_f6: "✓ होम विज़िट शामिल",
        pkg_bridal_f7: "✓ आफ्टरकेयर टिप्स और किट",
        pkg_engage_badge: "एलिगेंट",
        pkg_engage_title: "सगाई पैकेज",
        pkg_engage_f1: "✓ दोनों हाथ (आगे और पीछे)",
        pkg_engage_f2: "✓ अरेबिक या इंडो-अरेबिक स्टाइल",
        pkg_engage_f3: "✓ 1-2 घंटे का सेशन",
        pkg_engage_f4: "✓ ऑर्गेनिक हिना पेस्ट",
        pkg_engage_f5: "✓ होम विज़िट उपलब्ध",
        btn_book_now: "अभी बुक करें",
        payment_title: "💡 भुगतान विकल्प",
        pay_booking_title: "बुकिंग शुल्क भुगतान करें",
        pay_booking_desc: "सिर्फ <strong>₹500 बुकिंग शुल्क</strong> से अपनी तारीख रिज़र्व करें। बाकी राशि अपॉइंटमेंट वाले दिन दें।",
        pay_full_title: "पूरी राशि भुगतान करें",
        pay_full_desc: "पूरी राशि पहले दें और <strong>बुकिंग शुल्क नहीं</strong> — ₹500 बचाएं! प्राथमिकता शेड्यूलिंग भी।",

        // Booking
        booking_title: "अपॉइंटमेंट बुक करें",
        booking_subtitle: "अपनी तारीख सुरक्षित करें — शादी के सीज़न में डेट्स जल्दी भरती हैं!",
        form_name: "आपका नाम *",
        form_phone: "फ़ोन नंबर *",
        form_email: "ईमेल (वैकल्पिक)",
        form_date: "पसंदीदा तारीख *",
        form_time: "पसंदीदा समय *",
        form_time_placeholder: "समय चुनें",
        form_service: "सेवा प्रकार *",
        form_service_placeholder: "सेवा चुनें",
        form_persons: "व्यक्तियों की संख्या",
        form_location: "स्थान / पता",
        form_notes: "विशेष अनुरोध / डिज़ाइन पसंद",
        form_notes_placeholder: "अपनी पसंदीदा डिज़ाइन, रेफरेंस इमेज, या कोई विशेष अनुरोध बताएं...",
        form_payment_title: "भुगतान विकल्प चुनें",
        form_pay_booking: "₹500 बुकिंग शुल्क दें",
        form_pay_booking_desc: "अभी तारीख रिज़र्व करें, बाकी बाद में दें",
        form_pay_full: "पूरी राशि दें (₹500 बचाएं!)",
        form_pay_full_desc: "बुकिंग शुल्क नहीं + प्राथमिकता शेड्यूलिंग",
        form_submit: "बुकिंग कन्फर्म करें →",
        form_note: "भुगतान के लिए रीडायरेक्ट किया जाएगा। भुगतान के बाद बुकिंग कन्फर्म।",

        // Testimonials
        testimonials_title: "ग्राहक क्या कहते हैं",
        test1_text: "\"सपना ने मेरी ब्राइडल मेहंदी लगाई और वो बिल्कुल शानदार थी! शादी में सबने तारीफ की। रंग बहुत गहरा और खूबसूरत आया।\"",
        test1_author: "— प्रिया एस., दुल्हन",
        test2_text: "\"बहन की सगाई के लिए बुक किया। समय पर आईं, प्रोफेशनल थीं और डिज़ाइन बहुत अच्छी थीं। कीमत भी बहुत उचित!\"",
        test2_author: "— नेहा के., जमशेदपुर",
        test3_text: "\"करवा चौथ के लिए मेहंदी लगवाई। क्विक, सुंदर अरेबिक डिज़ाइन। सपना बहुत टैलेंटेड हैं। ज़रूर recommend करूंगी!\"",
        test3_author: "— अनीता एम., बिस्टुपुर",

        // Instagram
        insta_title: "इंस्टाग्राम पर नया",
        insta_subtitle: "रोज़ डिज़ाइन इंस्पिरेशन, रील्स और बिहाइंड-द-सीन्स के लिए फॉलो करें",
        insta_follow: "📸 फॉलो करें @jamshedpurmehndiartist",

        // WhatsApp CTA
        wa_title: "कोई सवाल? सपना से चैट करें!",
        wa_desc: "अपनी रेफरेंस डिज़ाइन भेजें, उपलब्धता पूछें, या कस्टम पैकेज पर बात करें",
        wa_btn: "💬 WhatsApp पर चैट करें",

        // Footer
        footer_desc: "जमशेदपुर और आसपास के क्षेत्रों में सेवा देने वाली पेशेवर मेहंदी आर्टिस्ट। हिना की कला से हर अवसर को खूबसूरत बनाती हूँ।",
        footer_links: "क्विक लिंक",
        footer_contact: "संपर्क",
        footer_hours: "कार्य समय",
        footer_h1: "सोम - शनि: सुबह 9 - रात 8",
        footer_h2: "रविवार: अपॉइंटमेंट पर",
        footer_h3: "होम विज़िट उपलब्ध",
        footer_h4: "30 किमी के अंदर आती हूँ",
        footer_copy: "© 2026 सपना मेहंदी आर्ट, जमशेदपुर। सर्वाधिकार सुरक्षित।",

        // Lang toggle
        lang_btn: "English"
    }
};

// Current language
let currentLang = localStorage.getItem('sapna_lang') || 'en';

// Apply translations to all elements with data-lang attribute
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sapna_lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

    const t = translations[lang];
    
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.getAttribute('data-lang-attr') === 'placeholder') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            } else if (el.tagName === 'OPTION' && el.value === '') {
                el.textContent = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    // Update toggle button
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.textContent = t.lang_btn;
}

// Toggle language
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    applyLanguage(newLang);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});
