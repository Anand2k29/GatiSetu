import {
    signInWithPopup,
    signOut as firebaseSignOut,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
    linkWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';

/**
 * Sign in with Google OAuth
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            }
        };
    } catch (error) {
        console.error('Google sign-in error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Initialize reCAPTCHA verifier for phone authentication
 * @param {string} containerId - ID of the container element for reCAPTCHA
 * @returns {RecaptchaVerifier}
 */
export const initRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            },
            'expired-callback': () => {
                // Response expired
                window.recaptchaVerifier = null;
            }
        });
    }
    return window.recaptchaVerifier;
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
 * @param {RecaptchaVerifier} recaptchaVerifier - reCAPTCHA verifier instance
 * @returns {Promise<{success: boolean, verificationId?: string, error?: string}>}
 */
/*
export const sendOTP = async (phoneNumber, recaptchaVerifier) => {
    try {
        const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptchaVerifier
        );

        // Store confirmation result globally for verification
        window.confirmationResult = confirmationResult;

        return {
            success: true,
            verificationId: confirmationResult.verificationId
        };
    } catch (error) {
        console.error('Send OTP error:', error);

        // Reset reCAPTCHA on error
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }

        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};
*/

/**
 * Verify OTP code
 * @param {string} code - 6-digit OTP code
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
/*
export const verifyOTP = async (code) => {
    try {
        if (!window.confirmationResult) {
            throw new Error('No confirmation result found. Please request OTP again.');
        }

        const result = await window.confirmationResult.confirm(code);
        const user = result.user;

        // Clear confirmation result
        window.confirmationResult = null;

        return {
            success: true,
            user: {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                emailVerified: user.emailVerified
            }
        };
    } catch (error) {
        console.error('Verify OTP error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};
*/

/**
 * Link phone number to existing Google account
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} verificationCode - OTP code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
/*
export const linkPhoneToAccount = async (phoneNumber, verificationCode) => {
    try {
        const credential = PhoneAuthProvider.credential(
            window.confirmationResult.verificationId,
            verificationCode
        );

        await linkWithCredential(auth.currentUser, credential);

        return { success: true };
    } catch (error) {
        console.error('Link phone error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};
*/

/**
 * Get current authenticated user
 * @returns {object|null}
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Sign out current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);

        // Clear any stored verification data
        window.confirmationResult = null;
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }

        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get user-friendly error messages
 * @param {string} errorCode - Firebase error code
 * @returns {string}
 */
const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
        'auth/popup-blocked': 'Popup was blocked by the browser. Please allow popups.',
        'auth/invalid-phone-number': 'Invalid phone number format. Please use +91XXXXXXXXXX format.',
        'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
        'auth/code-expired': 'OTP code has expired. Please request a new one.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled.',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email.',
        'auth/unauthorized-domain': `This domain (${window.location.hostname}) is not authorized. Please add it to Firebase Console > Auth > Settings > Authorized Domains.`,
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

export default {
    signInWithGoogle,
    initRecaptcha,
    // sendOTP,
    // verifyOTP,
    // linkPhoneToAccount,
    getCurrentUser,
    signOut
};
