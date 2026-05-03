import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBhvLK2EVqQkwJOZ9pWnU3IIoy5gNPo8LY",
    authDomain: "krishi-link-auth.firebaseapp.com",
    projectId: "krishi-link-auth",
    storageBucket: "krishi-link-auth.firebasestorage.app",
    messagingSenderId: "144395720176",
    appId: "1:144395720176:web:32ed296436bbaf4ba67935",
    measurementId: "G-HKEF9RCMGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// RecaptchaVerifier will be initialized in components when needed
export { RecaptchaVerifier };

export default app;
