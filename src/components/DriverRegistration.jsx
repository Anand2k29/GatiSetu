import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Lock, ArrowRight, User, LogIn } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import GoogleAuthButton from './GoogleAuthButton';

export default function DriverRegistration() {
    const { registerDriver, loginDriver, registerDriverWithOAuth } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [authMethod, setAuthMethod] = useState('traditional'); // 'traditional', 'google', 'phone'
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [error, setError] = useState('');
    const [googleUser, setGoogleUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !password.trim()) {
            setError('Please enter all fields');
            return;
        }

        if (!isLoginMode && !vehicleNumber.trim()) {
            setError('Please enter vehicle number');
            return;
        }

        let result;
        if (isLoginMode) {
            result = loginDriver(name, password);
        } else {
            result = registerDriver(name, password, vehicleNumber);
        }

        if (!result.success) {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = (user) => {
        setGoogleUser(user);
        setAuthMethod('vehicle'); // Skip phone, go to vehicle
        setError('');
    };

    const handleGoogleError = (errorMessage) => {
        setError(errorMessage);
    };

    const handleVehicleSubmit = (e) => {
        e.preventDefault();

        if (!vehicleNumber.trim()) {
            setError('Please enter vehicle number');
            return;
        }

        // Register driver with Google OAuth and phone verification
        const result = registerDriverWithOAuth({
            name: googleUser.displayName || googleUser.email.split('@')[0],
            email: googleUser.email,
            uid: googleUser.uid,
            photoURL: googleUser.photoURL,
            phoneNumber: null, // No phone verification
            phoneVerified: false,
            vehicleNumber: vehicleNumber
        });

        if (!result.success) {
            setError(result.message || 'Registration failed');
        }
    };

    // Vehicle number entry step (after Google Sign-In)
    if (authMethod === 'vehicle' && googleUser) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-500">
                    <div className="text-center mb-6">
                        {googleUser.photoURL && (
                            <img
                                src={googleUser.photoURL}
                                alt="Profile"
                                className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-blue-200"
                            />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">
                            Almost Done!
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            Enter your vehicle details to complete registration
                        </p>
                    </div>

                    <form onSubmit={handleVehicleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Truck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white uppercase placeholder:normal-case"
                                    placeholder="e.g. MH 12 AB 1234"
                                />
                                <VoiceInputButton
                                    onTranscript={(text) => {
                                        setVehicleNumber(text.toUpperCase());
                                        setError('');
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                        >
                            Complete Registration <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => {
                            setAuthMethod('traditional');
                            setGoogleUser(null);
                            setError('');
                        }}
                        className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        ← Back to login options
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Driver Registration
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Join our fleet network
                    </p>
                </div>

                {/* Google Sign-In Option */}
                <div className="mb-6">
                    <GoogleAuthButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="Sign up with Google"
                    />
                </div>

                {/*
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Driver Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {!isLoginMode && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Truck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white uppercase placeholder:normal-case"
                                    placeholder="e.g. MH 12 AB 1234"
                                />
                                <VoiceInputButton
                                    onTranscript={(text) => {
                                        setVehicleNumber(text.toUpperCase());
                                        setError('');
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm font-medium mt-1 text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                    >
                        {isLoginMode ? 'Login' : 'Register Vehicle'} <ArrowRight className="ml-2 w-5 h-5" />
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                            }}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700 underline"
                        >
                            {isLoginMode
                                ? "New driver? Register vehicle"
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
