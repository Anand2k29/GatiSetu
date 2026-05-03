import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, MapPin, IndianRupee, Calendar, Building2, Users, CheckCircle2, X, AlertCircle, TrendingUp, Percent, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

const B2BDeliveries = () => {
    const { b2bDeliveryRequests, acceptB2BDelivery, driverProfile } = useApp();
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [showSplitModal, setShowSplitModal] = useState(null);
    const [splitConfig, setSplitConfig] = useState({
        driver1Percentage: 50,
        driver2Percentage: 50,
        driver2Name: ''
    });

    // Filter deliveries
    const availableDeliveries = b2bDeliveryRequests?.filter(d => d.status === 'Pending') || [];
    const myDeliveries = b2bDeliveryRequests?.filter(d =>
        d.assignedDrivers?.some(driver => driver.name === driverProfile?.name)
    ) || [];

    const handleAcceptDelivery = (delivery, isSplit = false, splitData = null) => {
        acceptB2BDelivery({
            deliveryId: delivery.id,
            driverName: driverProfile?.name,
            isSplit,
            splitData,
            acceptedAt: new Date().toISOString()
        });
        setSelectedDelivery(null);
        setShowSplitModal(null);
    };

    const handleSplitSubmit = (delivery) => {
        const splitData = {
            driver1: {
                name: driverProfile?.name,
                percentage: splitConfig.driver1Percentage,
                load: ((delivery.quantity * splitConfig.driver1Percentage) / 100).toFixed(1)
            },
            driver2: {
                name: splitConfig.driver2Name,
                percentage: splitConfig.driver2Percentage,
                load: ((delivery.quantity * splitConfig.driver2Percentage) / 100).toFixed(1)
            }
        };
        handleAcceptDelivery(delivery, true, splitData);
    };

    const calculateEarnings = (delivery, percentage = 100) => {
        const baseRate = delivery.ratePerTon || 1500;
        const quantity = delivery.quantity || 0;
        return ((baseRate * quantity * percentage) / 100).toFixed(0);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-blue-600" />
                        B2B Delivery Marketplace
                    </h2>
                    <p className="text-gray-600 mt-1">High-value bulk delivery contracts from verified buyers</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Available Loads</p>
                        <p className="text-sm font-black text-gray-900">{availableDeliveries.length} Active Contracts</p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="glass-card bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-100">
                <div className="flex items-start gap-4">
                    <div className="bg-orange-600 p-3 rounded-xl text-white">
                        <AlertCircle size={24} />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 mb-1">Premium B2B Contracts</h3>
                        <p className="text-sm text-gray-600">
                            These are bulk delivery requests from hotels, restaurants, and retail chains. Higher rates, verified payments,
                            and escrow protection. For large loads, you can split with another driver!
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Available Contracts', value: availableDeliveries.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'My Active Deliveries', value: myDeliveries.length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg. Rate', value: '₹1,800/Ton', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 flex items-center gap-4">
                        <div className={`${stat.bg} p-3 rounded-xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Available Deliveries */}
            {availableDeliveries.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="text-blue-600" />
                        Available Delivery Contracts
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {availableDeliveries.map((delivery) => {
                            const needsSplit = delivery.quantity > 10; // Assume 10 tons is max for single truck
                            return (
                                <motion.div
                                    key={delivery.id}
                                    whileHover={{ y: -5 }}
                                    className="glass-card p-6 space-y-4 border border-blue-100 hover:border-blue-200 transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono font-bold text-gray-400">{delivery.id}</span>
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                                    B2B Contract
                                                </span>
                                                {needsSplit && (
                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                                                        Split Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900">{delivery.commodity}</h4>
                                            <p className="text-sm text-gray-500">From: {delivery.farmerName}</p>
                                        </div>
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Load</p>
                                            <p className="text-lg font-black text-gray-900">{delivery.quantity} Tons</p>
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Rate</p>
                                            <p className="text-lg font-black text-emerald-700">₹{delivery.ratePerTon}/Ton</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <MapPin size={14} /> Pickup
                                            </span>
                                            <span className="font-bold text-gray-900">{delivery.source}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <MapPin size={14} /> Delivery
                                            </span>
                                            <span className="font-bold text-gray-900">{delivery.destination}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Calendar size={14} /> Timeline
                                            </span>
                                            <span className="font-bold text-gray-900">{delivery.timeline}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold mb-1">Total Earnings (Full Load)</p>
                                                <p className="text-2xl font-black text-emerald-700">₹{calculateEarnings(delivery)}</p>
                                            </div>
                                            <IndianRupee className="w-8 h-8 text-emerald-600 opacity-50" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setSelectedDelivery(delivery)}
                                            className="flex-grow px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all text-sm shadow-md group-hover:scale-105"
                                        >
                                            Accept Full Load
                                        </button>
                                        {needsSplit && (
                                            <button
                                                onClick={() => setShowSplitModal(delivery)}
                                                className="px-4 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all text-sm shadow-md flex items-center gap-2"
                                            >
                                                <Percent size={16} /> Split Load
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Available Contracts</h3>
                    <p className="text-gray-500">
                        New B2B delivery contracts will appear here. Check back soon for premium opportunities!
                    </p>
                </div>
            )}

            {/* My Active Deliveries */}
            {myDeliveries.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="text-emerald-600" />
                        My Active B2B Deliveries
                    </h3>
                    <div className="glass-card overflow-hidden border border-emerald-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                        <th className="px-6 py-4">Contract ID</th>
                                        <th className="px-6 py-4">Commodity</th>
                                        <th className="px-6 py-4">My Load</th>
                                        <th className="px-6 py-4">Earnings</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {myDeliveries.map((delivery) => {
                                        const myAssignment = delivery.assignedDrivers?.find(d => d.name === driverProfile?.name);
                                        return (
                                            <tr key={delivery.id} className="text-sm hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-gray-500">{delivery.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">{delivery.commodity}</span>
                                                        <span className="text-[10px] text-gray-500">{delivery.source} → {delivery.destination}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-blue-700">
                                                        {myAssignment?.load || delivery.quantity} Tons
                                                        {myAssignment?.percentage && myAssignment.percentage < 100 && (
                                                            <span className="text-xs text-gray-500 ml-1">({myAssignment.percentage}%)</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-emerald-700">
                                                        ₹{calculateEarnings(delivery, myAssignment?.percentage || 100)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] px-2 py-1 rounded-lg font-bold bg-blue-50 text-blue-700">
                                                        {delivery.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Accept Confirmation Modal */}
            <AnimatePresence>
                {selectedDelivery && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDelivery(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-blue-100"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">Confirm Acceptance</h3>
                                    <button onClick={() => setSelectedDelivery(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                                    <p className="text-lg font-bold">{selectedDelivery.commodity}</p>
                                    <p className="text-sm opacity-90 mt-1">{selectedDelivery.quantity} Tons • {selectedDelivery.source} → {selectedDelivery.destination}</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <p className="text-sm text-gray-600 mb-2">Your Total Earnings</p>
                                    <p className="text-3xl font-black text-emerald-700">₹{calculateEarnings(selectedDelivery)}</p>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                        <span>Escrow payment protection</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                        <span>Verified B2B buyer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                        <span>Premium rate: ₹{selectedDelivery.ratePerTon}/Ton</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAcceptDelivery(selectedDelivery)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                                >
                                    Accept Contract
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Split Load Modal */}
            <AnimatePresence>
                {showSplitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSplitModal(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-orange-100 max-h-[90vh] flex flex-col"
                        >
                            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <Percent className="w-6 h-6" />
                                        <h3 className="text-xl font-bold">Split Load</h3>
                                    </div>
                                    <button onClick={() => setShowSplitModal(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                                    <p className="text-lg font-bold">{showSplitModal.commodity}</p>
                                    <p className="text-sm opacity-90 mt-1">Total: {showSplitModal.quantity} Tons</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-gray-900">You ({driverProfile?.name})</span>
                                            <span className="text-2xl font-black text-blue-700">{splitConfig.driver1Percentage}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="30"
                                            max="70"
                                            value={splitConfig.driver1Percentage}
                                            onChange={(e) => setSplitConfig({
                                                ...splitConfig,
                                                driver1Percentage: parseInt(e.target.value),
                                                driver2Percentage: 100 - parseInt(e.target.value)
                                            })}
                                            className="w-full"
                                        />
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p>Load: {((showSplitModal.quantity * splitConfig.driver1Percentage) / 100).toFixed(1)} Tons</p>
                                            <p className="font-bold text-emerald-700">Earnings: ₹{calculateEarnings(showSplitModal, splitConfig.driver1Percentage)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-gray-900">Partner Driver</span>
                                            <span className="text-2xl font-black text-orange-700">{splitConfig.driver2Percentage}%</span>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter driver name"
                                            value={splitConfig.driver2Name}
                                            onChange={(e) => setSplitConfig({ ...splitConfig, driver2Name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none transition-all mb-2"
                                        />
                                        <div className="text-sm text-gray-600">
                                            <p>Load: {((showSplitModal.quantity * splitConfig.driver2Percentage) / 100).toFixed(1)} Tons</p>
                                            <p className="font-bold text-emerald-700">Earnings: ₹{calculateEarnings(showSplitModal, splitConfig.driver2Percentage)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Common Split Ratios</p>
                                    <div className="flex gap-2">
                                        {[
                                            { label: '50-50', value: 50 },
                                            { label: '60-40', value: 60 },
                                            { label: '70-30', value: 70 },
                                        ].map((preset) => (
                                            <button
                                                key={preset.value}
                                                onClick={() => setSplitConfig({
                                                    ...splitConfig,
                                                    driver1Percentage: preset.value,
                                                    driver2Percentage: 100 - preset.value
                                                })}
                                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSplitSubmit(showSplitModal)}
                                    disabled={!splitConfig.driver2Name}
                                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Split & Accept
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default B2BDeliveries;
