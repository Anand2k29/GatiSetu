import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Camera, ScanLine } from 'lucide-react';

export default function QRScanner({ onClose }) {
    const { liveRequests, acceptRequest, shipments, verifyShipment, userName } = useApp();
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(true);

    const handleScan = (text) => {
        if (text) {
            try {
                const rawValue = Array.isArray(text) ? text[0].rawValue : text;
                const parsed = JSON.parse(rawValue);

                // Try to match against shipments (Gati-Pass)
                if (parsed.shipmentId) {
                    const shipment = shipments.find(s => s.id === parsed.shipmentId && s.status === 'pending');
                    if (shipment) {
                        verifyShipment(shipment.id, userName || 'Sarathi');
                        setScanResult({ success: true, type: 'shipment', data: shipment });
                        setScanning(false);
                        return;
                    }
                    const alreadyVerified = shipments.find(s => s.id === parsed.shipmentId && s.status === 'verified');
                    if (alreadyVerified) {
                        setScanResult({ success: false, message: 'This Gati-Pass has already been verified.' });
                        setScanning(false);
                        return;
                    }
                }

                // Fallback: match against liveRequests
                if (parsed.id) {
                    const booking = liveRequests.find(req => req.id === parsed.id && req.status === 'Pending');
                    if (booking) {
                        setScanResult({ success: true, type: 'booking', data: booking });
                        setScanning(false);
                        setTimeout(() => { acceptRequest(booking.id); }, 2000);
                        return;
                    }
                }

                setScanResult({ success: false, message: 'Invalid or expired QR code.' });
                setScanning(false);
            } catch (err) {
                console.error("QR Parse Error", err);
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content overflow-hidden" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-xs font-black text-text-primary font-[Outfit] tracking-wider uppercase flex items-center gap-2">
                        <ScanLine size={16} className="text-invention-orange" /> Scan Gati-Pass
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <XCircle size={18} />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative aspect-square bg-surface">
                    {scanning ? (
                        <>
                            <div className="w-full h-full relative">
                                <Scanner
                                    onScan={(text) => handleScan(text)}
                                    onError={(error) => console.log(error?.message)}
                                    components={{ audio: false, onOff: false, torch: false, zoom: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' }, video: { width: '100%', height: '100%', objectFit: 'cover' } }}
                                />
                            </div>
                            <div className="absolute inset-4 border-2 border-invention-orange opacity-50 pointer-events-none z-10" style={{ borderRadius: '2px' }} />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-text-primary text-[10px] font-bold tracking-wider uppercase bg-surface/80 py-2 z-10" style={{ fontFamily: 'Outfit' }}>
                                Point camera at Farmer's Gati-Pass QR
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-elevated p-6 text-center z-20">
                            {scanResult?.success ? (
                                <div className="space-y-4">
                                    <div className="w-14 h-14 bg-mint-green/10 border-2 border-mint-green flex items-center justify-center mx-auto" style={{ borderRadius: '2px' }}>
                                        <CheckCircle2 size={28} className="text-mint-green" />
                                    </div>
                                    <h4 className="text-sm font-black text-mint-green font-[Outfit] tracking-wider uppercase">
                                        {scanResult.type === 'shipment' ? '✓ Load Verified' : '✓ Booking Verified'}
                                    </h4>
                                    {scanResult.type === 'shipment' && (
                                        <div className="mono-data text-left text-[10px]">
                                            {`ID: ${scanResult.data.id}\nCrop: ${scanResult.data.crop}\nWeight: ${scanResult.data.weight}kg`}
                                        </div>
                                    )}
                                    <div className="tag-verified">Load Verified</div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-14 h-14 bg-danger/10 border-2 border-danger flex items-center justify-center mx-auto" style={{ borderRadius: '2px' }}>
                                        <XCircle size={28} className="text-danger" />
                                    </div>
                                    <h4 className="text-sm font-black text-danger font-[Outfit] tracking-wider uppercase">Verification Failed</h4>
                                    <p className="text-xs text-text-secondary">{scanResult?.message}</p>
                                    <button onClick={() => { setScanResult(null); setScanning(true); }} className="btn-cta px-6 py-2 text-xs">
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
