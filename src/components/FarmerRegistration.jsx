import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ArrowRight, Sprout, Lock, LogIn } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import GoogleAuthButton from './GoogleAuthButton';



export default function FarmerRegistration() {
    const { registerFarmer, loginFarmer, registerFarmerWithOAuth } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [authMethod, setAuthMethod] = useState('traditional'); // 'traditional', 'google'
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [googleUser, setGoogleUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !password.trim()) {
            setError('Please enter both name and password');
            return;
        }

        let result;
        if (isLoginMode) {
            result = loginFarmer(name, password);
        } else {
            result = registerFarmer(name, password);
        }

        if (!result.success) {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = (user) => {
        // Register farmer with Google OAuth immediately
        const result = registerFarmerWithOAuth({
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            uid: user.uid,
            photoURL: user.photoURL,
            phoneNumber: null, // No phone verification
            phoneVerified: false
        });

        if (!result.success) {
            setError(result.message || 'Registration failed');
        }
    };

    const handleGoogleError = (errorMessage) => {
        setError(errorMessage);
    };



    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Join Krishi-Link
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Sign in to start booking loads
                    </p>
                </div>

                {/* Google Sign-In Option */}
                <div className="mb-6">
                    <GoogleAuthButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="Continue with Google"
                    />
                </div>

                {/* 
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Sprout className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your name"
                            />
                            <VoiceInputButton
                                onTranscript={(text) => {
                                    setName(text);
                                    setError('');
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium mt-1 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                    >
                        {isLoginMode ? 'Login' : 'Continue'} <ArrowRight className="ml-2 w-5 h-5" />
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                            }}
                            className="text-sm text-emerald-600 font-medium hover:text-emerald-700 underline"
                        >
                            {isLoginMode
                                ? "New here? Create an account"
                                : "Already registered? Login here"}
                        </button>
                    </div>
                </form> 
                */}

                {error && <p className="text-red-500 text-sm font-medium mt-4 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}
            </div>
        </div>
    );
}
