// ===== Firebase Configuration =====
// INSTRUCTIONS: Replace these values with your Firebase project config
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g., "sapna-mehndi")
// 3. Add a Web App (click </> icon)
// 4. Copy the config values below
// 5. Enable Firestore Database (Build → Firestore → Create Database → Start in test mode)
// 6. Enable Storage (Build → Storage → Get Started → Start in test mode)
// 7. Enable Authentication (Build → Authentication → Email/Password)

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// ===== Firestore Helper Functions =====

// Save a booking to Firestore
async function saveBookingToFirebase(bookingData) {
    try {
        const docRef = await db.collection('bookings').add({
            ...bookingData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Booking saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving booking:', error);
        // Fallback to localStorage
        saveBookingToLocalStorage(bookingData);
        return null;
    }
}

// Get all bookings
async function getBookingsFromFirebase() {
    try {
        const snapshot = await db.collection('bookings')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
    }
}

// Update booking status
async function updateBookingStatusFirebase(bookingId, newStatus) {
    try {
        await db.collection('bookings').doc(bookingId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating booking:', error);
        return false;
    }
}

// Delete a booking
async function deleteBookingFirebase(bookingId) {
    try {
        await db.collection('bookings').doc(bookingId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error);
        return false;
    }
}

// ===== Storage Helper Functions =====

// Upload image to Firebase Storage
async function uploadImageToFirebase(file, category = 'general') {
    try {
        const fileName = `gallery/${Date.now()}_${file.name}`;
        const storageRef = storage.ref(fileName);
        
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Save metadata to Firestore
        await db.collection('gallery').add({
            url: downloadURL,
            fileName: fileName,
            category: category,
            originalName: file.name,
            size: file.size,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

// Get all gallery images
async function getGalleryFromFirebase() {
    try {
        const snapshot = await db.collection('gallery')
            .orderBy('uploadedAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return [];
    }
}

// Delete gallery image
async function deleteGalleryImageFirebase(imageId, fileName) {
    try {
        // Delete from Storage
        await storage.ref(fileName).delete();
        // Delete metadata from Firestore
        await db.collection('gallery').doc(imageId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

// ===== Settings =====

// Save settings to Firestore
async function saveSettingsToFirebase(settings) {
    try {
        await db.collection('settings').doc('main').set(settings, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Get settings
async function getSettingsFromFirebase() {
    try {
        const doc = await db.collection('settings').doc('main').get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

// ===== Auth Helper =====

// Admin login with email/password
async function adminLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

// Admin logout
async function adminLogout() {
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}

// Check if admin is logged in
function onAuthStateChange(callback) {
    auth.onAuthStateChanged(callback);
}

// Fallback localStorage save
function saveBookingToLocalStorage(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('sapna_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('sapna_bookings', JSON.stringify(bookings));
}

console.log('🔥 Firebase initialized for Sapna Mehndi Art');
