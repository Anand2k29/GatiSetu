import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Package, IndianRupee, Radar, Navigation, QrCode, User, ScanLine, Leaf, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import QRScanner from './QRScanner';
import B2BDeliveries from './B2BDeliveries';

export default function DriverMatcher() {
    const { liveRequests, acceptRequest, completeRequest, driverProfile, t } = useApp();
    const [deadMileMode, setDeadMileMode] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [activeTab, setActiveTab] = useState('available');

    // Filter requests
    const availableRequests = liveRequests.filter(req => req.status === 'Pending');
    const myAcceptedRequests = liveRequests.filter(req => req.status === 'Accepted' && req.driverName === driverProfile?.name);
    const potentialEarnings = availableRequests.reduce((acc, req) => acc + req.krishiPrice, 0);

    const badges = [
        { id: 'co2', name: t('co2Warrior'), icon: Leaf, active: (driverProfile?.stats?.co2Saved || 0) > 10, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'speedy', name: t('speedyDelivery'), icon: Truck, active: (driverProfile?.stats?.jobs || 0) > 5, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'pro', name: 'Pro Driver', icon: ShieldCheck, active: (driverProfile?.stats?.jobs || 0) > 10, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {t('welcome')}, {driverProfile?.name || 'Driver'}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Vehicle: {driverProfile?.vehicleNumber || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="flex-1 lg:max-w-md w-full">
                    <div className="glass-card p-4 bg-white/50 border-emerald-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t('badges')}</p>
                        <div className="flex gap-3">
                            {badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "flex-1 p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-300",
                                        badge.active ? cn(badge.bg, "border-transparent scale-100 shadow-sm") : "bg-gray-50 border-gray-100 grayscale opacity-40 scale-95"
                                    )}
                                >
                                    <badge.icon className={cn("w-6 h-6 mb-1", badge.active ? badge.color : "text-gray-400")} />
                                    <span className={cn("text-[10px] font-bold text-center", badge.active ? "text-gray-700" : "text-gray-400")}>
                                        {badge.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 self-end lg:self-center">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-emerald-700 transition-all font-bold"
                    >
                        <ScanLine className="w-5 h-5 mr-2" />
                        Verify
                    </button>
                    <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Dead Mile</span>
                        <button
                            onClick={() => setDeadMileMode(!deadMileMode)}
                            className={cn(
                                "relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none",
                                deadMileMode ? "bg-emerald-500" : "bg-gray-200"
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                    deadMileMode ? "translate-x-5" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('available')}
                    className={cn(
                        "pb-3 font-bold text-sm transition-colors relative",
                        activeTab === 'available' ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Available ({availableRequests.length})
                    {activeTab === 'available' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('my-loads')}
                    className={cn(
                        "pb-3 font-bold text-sm transition-colors relative",
                        activeTab === 'my-loads' ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Active ({myAcceptedRequests.length})
                    {activeTab === 'my-loads' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "pb-3 font-bold text-sm transition-colors relative",
                        activeTab === 'history' ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    History
                    {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('b2b-deliveries')}
                    className={cn(
                        "pb-3 font-bold text-sm transition-colors relative",
                        activeTab === 'b2b-deliveries' ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    B2B Contracts
                    {activeTab === 'b2b-deliveries' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'available' && (
                    <>
                        {/* Potential Earnings Banner */}
                        {availableRequests.length > 0 && (
                            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <IndianRupee size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 opacity-80 mb-1">
                                        <IndianRupee size={16} />
                                        <span className="font-bold text-xs uppercase tracking-widest">Available to Earn</span>
                                    </div>
                                    <span className="text-3xl font-black">₹{potentialEarnings.toLocaleString()}</span>
                                </div>
                                <button onClick={() => setActiveTab('available')} className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                    View All
                                </button>
                            </div>
                        )}

                        {availableRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-gray-200">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                >
                                    <Radar className="w-16 h-16 text-emerald-400" />
                                </motion.div>
                                <p className="mt-4 text-xl font-bold text-emerald-600 animate-pulse">
                                    Scanning for loads...
                                </p>
                                <p className="text-gray-400 font-medium mt-2">Checking within 50km of your route</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {availableRequests.map((req) => (
                                    <RequestCard
                                        key={req.id}
                                        req={req}
                                        deadMileMode={deadMileMode}
                                        onAction={() => acceptRequest(req.id, driverProfile.name)}
                                        actionLabel="Accept Load"
                                        actionColor="bg-gray-900"
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'my-loads' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myAcceptedRequests.length === 0 ? (
                            <div className="col-span-2 py-20 text-center">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-bold">No active jobs</p>
                                <button onClick={() => setActiveTab('available')} className="text-emerald-600 text-sm font-bold mt-2 hover:underline">Pick a load near you</button>
                            </div>
                        ) : (
                            myAcceptedRequests.map((req) => (
                                <RequestCard
                                    key={req.id}
                                    req={req}
                                    deadMileMode={false}
                                    onAction={() => completeRequest(req.id)}
                                    actionLabel="Complete Delivery"
                                    actionColor="bg-emerald-600"
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="glass-card overflow-hidden border-gray-100 shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Farmer</th>
                                        <th className="px-6 py-4 text-left">Route</th>
                                        <th className="px-6 py-4 text-right">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {liveRequests.filter(req => req.status === 'Completed' && req.driverName === driverProfile?.name).map((req) => (
                                        <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                                {new Date(req.completedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">{req.farmerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className="font-medium text-gray-900">{req.sourceVillage}</span>
                                                <span className="mx-2 opacity-30">→</span>
                                                <span className="font-medium text-gray-900">{req.targetMandi}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-black text-emerald-600">₹{req.krishiPrice}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {liveRequests.filter(req => req.status === 'Completed' && req.driverName === driverProfile?.name).length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">No completed jobs yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'b2b-deliveries' && (
                    <B2BDeliveries />
                )}
            </div>

            {
                showScanner && (
                    <QRScanner onClose={() => setShowScanner(false)} />
                )
            }
        </div >
    );
}

function RequestCard({ req, deadMileMode, onAction, actionLabel, actionColor }) {
    return (
        <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                "glass-card p-5 hover:shadow-xl transition-all border-l-4 relative overflow-hidden group",
                deadMileMode ? "border-emerald-500 bg-emerald-50/30" : "border-gray-300"
            )}
        >
            {deadMileMode && (
                <div className="absolute top-0 right-0 p-2 bg-emerald-100 rounded-bl-xl text-xs font-bold text-emerald-700">
                    MATCH FOUND
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="bg-gray-100 p-1 rounded-full">
                            <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{req.farmerName}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-500" /> {req.weight} kg Load
                    </h3>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <p className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-emerald-500" />
                            <span className="font-medium text-gray-700">{req.sourceVillage}</span>
                            <span className="mx-1 text-gray-400">→</span>
                            <span className="font-medium text-gray-700">{req.targetMandi}</span>
                        </p>
                        <p className="flex items-center">
                            <Navigation className="w-3 h-3 mr-1" /> {req.distance} km trip
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div>
                    <span className="text-xs text-gray-400 block">Market Rate</span>
                    <span className="text-red-400 line-through text-sm">₹{req.standardPrice}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-emerald-600 font-bold block">YOUR EARNINGS</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{req.krishiPrice}</span>
                </div>
            </div>
            <button
                onClick={onAction}
                className={cn("w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors text-white shadow-md active:scale-95", actionColor)}
            >
                {actionLabel}
            </button>
        </motion.div>
    );
}
