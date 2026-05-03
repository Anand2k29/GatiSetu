import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Camera, Loader2 } from 'lucide-react';

export default function QRScanner({ onClose }) {
    const { liveRequests, acceptRequest } = useApp();
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(true);

    const handleScan = (text) => {
        if (text) {
            try {
                // @yudiel/react-qr-scanner usually returns an array of objects
                // We handle both array (new version) and raw object just in case
                const rawValue = Array.isArray(text) ? text[0].rawValue : text;
                const parsed = JSON.parse(rawValue);

                // Verify if booking exists and is pending
                const booking = liveRequests.find(req => req.id === parsed.id && req.status === 'Pending');

                if (booking) {
                    setScanResult({ success: true, booking });
                    setScanning(false);
                    // Automatically accept the load after a short delay
                    setTimeout(() => {
                        acceptRequest(booking.id);
                    }, 2000);
                } else {
                    // Check if it's already accepted
                    const acceptedBooking = liveRequests.find(req => req.id === parsed.id && req.status === 'Accepted');
                    if (acceptedBooking) {
                        setScanResult({ success: false, message: 'This booking has already been processed.' });
                        setScanning(false);
                    } else {
                        setScanResult({ success: false, message: 'Invalid or expired booking QR code.' });
                        setScanning(false);
                    }
                }
            } catch (err) {
                console.error("QR Parse Error", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center">
                        <Camera className="mr-2" /> Scan Booking QR
                    </h3>
                    <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
                        <XCircle />
                    </button>
                </div>

                <div className="relative aspect-square bg-black">
                    {scanning ? (
                        <>
                            <div className="w-full h-full relative">
                                <Scanner
                                    onScan={(text) => handleScan(text)}
                                    onError={(error) => console.log(error?.message)}
                                    components={{
                                        audio: false,
                                        onOff: false,
                                        torch: false,
                                        zoom: false,
                                        finder: false
                                    }}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                                    }}
                                />
                            </div>
                            <div className="absolute inset-0 border-2 border-emerald-500 opacity-50 animate-pulse pointer-events-none z-10"></div>
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1 z-10">
                                Point camera at Farmer's QR Code
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center z-20">
                            {scanResult?.success ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-green-800">Verification Successful!</h4>
                                    <p className="text-gray-600">Booking #{scanResult.booking.id} verified.</p>
                                    <div className="flex items-center justify-center text-emerald-600 font-medium">
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Accepting Load...
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                        <XCircle size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-red-800">Verification Failed</h4>
                                    <p className="text-gray-600">{scanResult?.message}</p>
                                    <button
                                        onClick={() => { setScanResult(null); setScanning(true); }}
                                        className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
