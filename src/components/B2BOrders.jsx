import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShoppingCart, Package, ArrowRight, TrendingUp, Users, CheckCircle2, X, ClipboardList, Calendar, MessageSquare, Send, Sparkles, ChevronRight, Truck, ShieldCheck, Mic, ScanLine } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceInputButton from './VoiceInputButton';
import QRScanner from './QRScanner';

const B2BOrders = () => {
    const { t, addB2BOrder, addB2BQuote, b2bOrders, b2bQuotes, approveB2BQuote } = useApp();
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [selectedFPO, setSelectedFPO] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [quoteData, setQuoteData] = useState({
        commodity: '',
        quantity: '',
        deadline: '',
        notes: ''
    });

    const totalESG = b2bOrders.reduce((acc, order) => {
        const val = parseFloat(order.co2Impact) || 0;
        return acc + val;
    }, 142.5).toFixed(1);

    const bulkProducts = [
        {
            id: 1,
            name: 'Organic Wheat (Sonalika)',
            fpo: 'Green Valley Farmers Group',
            location: 'Punjab, India',
            quantity: '500 Tons',
            exFarmPrice: '₹22,500',
            deliveredPrice: '₹24,100',
            estFreight: '₹1,600',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
            specs: ['Moisture < 12%', 'No pesticides', 'Grade A'],
            co2Saved: '12.4 Tons',
            fpoDetails: {
                members: 450,
                rating: 4.8,
                verified: true,
                specialty: 'Sustainable Wheat Farming'
            }
        },
        {
            id: 2,
            name: 'Red Onions (Nashik)',
            fpo: 'Sahyadri Farmers Producer Co.',
            location: 'Maharashtra, India',
            quantity: '200 Tons',
            exFarmPrice: '₹18,000',
            deliveredPrice: '₹19,850',
            estFreight: '₹1,850',
            image: 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=400',
            specs: ['Medium size', 'Export quality', 'Available now'],
            co2Saved: '8.2 Tons',
            fpoDetails: {
                members: 1200,
                rating: 4.9,
                verified: true,
                specialty: 'Global Export Standards'
            }
        },
        {
            id: 3,
            name: 'Basmati Rice (Pusa-1121)',
            fpo: 'Golden Grain Collective',
            location: 'Haryana, India',
            quantity: '150 Tons',
            exFarmPrice: '₹85,000',
            deliveredPrice: '₹87,200',
            estFreight: '₹2,200',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
            specs: ['Extra long grain', 'Aged 1 year', 'Premium'],
            co2Saved: '5.6 Tons',
            fpoDetails: {
                members: 310,
                rating: 4.7,
                verified: true,
                specialty: 'Traditional Basmati Cultivation'
            }
        },
    ];

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        addB2BQuote(quoteData);
        setIsSubmitted(true);
        setTimeout(() => {
            setShowQuoteModal(false);
            setIsSubmitted(false);
            setQuoteData({ commodity: '', quantity: '', deadline: '', notes: '' });
        }, 2000);
    };

    const handleOrder = (product) => {
        addB2BOrder({
            buyer: 'Partner Chain',
            fpo: product.fpo,
            product: product.name,
            quantity: '10 Tons (Sample)',
            source: product.location.split(',')[0],
            destination: 'Distribution Hub',
            co2Impact: product.co2Saved
        });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-emerald-600" />
                        B2B Wholesale Portal
                    </h2>
                    <p className="text-gray-600 mt-1">Direct procurement for hotels, restaurants, and retail chains.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <div className="bg-emerald-600 p-2 rounded-lg text-white">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total ESG Impact</p>
                            <p className="text-sm font-black text-gray-900">{totalESG} Tons CO2 Saved</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowScanner(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg transition-all flex items-center gap-2 font-bold"
                        title="Scan QR Code for Delivery Verification"
                    >
                        <ScanLine size={20} />
                        <span className="hidden md:inline">Verify Delivery</span>
                    </button>
                </div>
            </div>

            {/* Info Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Verified FPOs', value: '1,240+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Pipeline', value: '15,000 Tons', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Corporate Discount', value: 'Up to 25%', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
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

            {/* Farmer Responses Section */}
            {b2bQuotes.filter(q => q.status === 'Responded').length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="text-orange-600" />
                        Farmer Responses & Offers
                    </h3>
                    <div className="glass-card overflow-hidden border border-orange-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-orange-50/50">
                                    <tr className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                        <th className="px-6 py-4">Quote ID</th>
                                        <th className="px-6 py-4">Farmer</th>
                                        <th className="px-6 py-4">Commodity</th>
                                        <th className="px-6 py-4">Offer Price</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {b2bQuotes.filter(q => q.status === 'Responded').map((quote) => (
                                        <tr key={quote.id} className="text-sm hover:bg-orange-50/10 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-500">{quote.id}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{quote.farmerName}</td>
                                            <td className="px-6 py-4">{quote.commodity} ({quote.quantity} Tons)</td>
                                            <td className="px-6 py-4 font-bold text-emerald-700">₹{quote.yourOffer}/Ton</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        approveB2BQuote(quote.id);
                                                        alert("Quote Approved! Waiting for Farmer's Final Confirmation.");
                                                    }}
                                                    className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-all flex items-center gap-1 shadow-md"
                                                >
                                                    <CheckCircle2 size={14} /> Approve Offer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {bulkProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className="glass-card overflow-hidden flex flex-col group border border-emerald-50"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                Stock: {product.quantity}
                            </div>
                            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-white/20">
                                <Sparkles size={12} className="text-emerald-400" /> ESG Savings: {product.co2Saved}
                            </div>
                        </div>
                        <div className="p-6 space-y-4 flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                    <button
                                        onClick={() => setSelectedFPO(product)}
                                        className="text-sm text-emerald-600 font-medium flex items-center gap-1 mt-1 hover:underline group/fpo"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> {product.fpo}
                                        <ChevronRight size={14} className="group-hover/fpo:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Ex-Farm Price:</span>
                                    <span className="font-bold text-gray-700">{product.exFarmPrice}/Ton</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Truck size={12} /> Est. Freight:
                                    </span>
                                    <span className="font-bold text-gray-700">{product.estFreight}/Ton</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-emerald-600">Delivered Index</span>
                                    <span className="text-lg font-black text-emerald-700">{product.deliveredPrice}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Audit Compliance:</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.specs.map((spec, i) => (
                                        <span key={i} className="text-[10px] bg-white text-gray-600 px-2 py-1 rounded-md border border-gray-100 shadow-sm font-bold">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between gap-3">
                                <button
                                    onClick={() => handleOrder(product)}
                                    className="flex-grow py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md text-sm active:scale-95 transform"
                                >
                                    Order Sample
                                </button>
                                <button className="bg-emerald-100 text-emerald-700 p-3 rounded-xl hover:bg-emerald-200 transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trust Banner */}
            <div className="glass-card bg-gradient-to-r from-orange-600 to-amber-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden ring-1 ring-orange-400/30">
                <div className="z-10 relative">
                    <h3 className="text-2xl font-bold mb-2 text-white">Sourcing for a Global Chain?</h3>
                    <p className="text-white/80">
                        Get ESG-compliant sourcing reports and custom bulk rates for your organization.
                    </p>
                </div>
                <button
                    onClick={() => setShowQuoteModal(true)}
                    className="z-10 relative px-8 py-4 bg-white text-orange-600 rounded-xl font-black hover:bg-orange-50 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg"
                >
                    Request Custom Quote <ArrowRight className="w-4 h-4" />
                </button>
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
                    <ClipboardList size={200} />
                </div>
            </div>

            {/* My Procurement History - Payment Tracking */}
            {b2bOrders.length > 0 && (
                <div className="glass-card overflow-hidden border border-emerald-100/50">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/30">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <ClipboardList className="text-emerald-600" /> My Procurement History
                            </h3>
                            <p className="text-xs text-gray-500">Track your escrowed payments and active deliveries.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Active Escrow</p>
                            <p className="text-lg font-black text-emerald-700">₹{(b2bOrders.length * 2.4).toFixed(1)} Lakhs</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                    <th className="px-6 py-4">Order Ref</th>
                                    <th className="px-6 py-4">Product / FPO</th>
                                    <th className="px-6 py-4">Escrow Status</th>
                                    <th className="px-6 py-4">Delivery Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {b2bOrders.map((order) => (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-500">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{order.product}</span>
                                                <span className="text-[10px] text-emerald-600 font-bold">{order.fpo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 w-fit ${order.escrowStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                <ShieldCheck size={12} /> {order.escrowStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-grow h-1 bg-gray-100 rounded-full max-w-[60px] overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${order.progress}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{order.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* FPO Detail Modal */}
            <AnimatePresence>
                {selectedFPO && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFPO(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-emerald-100"
                        >
                            <div className="bg-emerald-600 p-6 text-white text-center">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-2xl font-bold">{selectedFPO.fpo}</h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                        Verified FPO
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-300">
                                        <Sparkles size={14} className="fill-amber-300" /> {selectedFPO.fpoDetails.rating} Rating
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Members</p>
                                        <p className="text-xl font-black text-gray-900">{selectedFPO.fpoDetails.members}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Legacy</p>
                                        <p className="text-xl font-black text-gray-900">12+ Years</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-600" /> Core Specialty
                                    </h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Expertly focused on {selectedFPO.fpoDetails.specialty}. This group follows 100% sustainable practices, reducing carbon emissions by locally sourcing and optimizing warehouse-to-buyer logistics.
                                    </p>
                                </div>
                                <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                    Download FPO Audit Report <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quote Modal */}
            <AnimatePresence>
                {showQuoteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitted && setShowQuoteModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-orange-100"
                        >
                            {isSubmitted ? (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Quote Request Sent!</h3>
                                    <p className="text-gray-500">Our FPO network is reviewing your request. You'll receive quotes shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ClipboardList className="w-6 h-6" />
                                            <h3 className="text-xl font-bold">Request Bulk Quote</h3>
                                        </div>
                                        <button onClick={() => setShowQuoteModal(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                    <Package className="w-3 h-3" /> Commodity
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="e.g. Potatoes"
                                                        value={quoteData.commodity}
                                                        onChange={(e) => setQuoteData({ ...quoteData, commodity: e.target.value })}
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                    />
                                                    <VoiceInputButton
                                                        onTranscript={(text) => setQuoteData({ ...quoteData, commodity: text })}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                    <ClipboardList className="w-3 h-3" /> Quantity (Tons)
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="50"
                                                    value={quoteData.quantity}
                                                    onChange={(e) => setQuoteData({ ...quoteData, quantity: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Delivery Timeline
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. Within 15 days"
                                                    value={quoteData.deadline}
                                                    onChange={(e) => setQuoteData({ ...quoteData, deadline: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                />
                                                <VoiceInputButton
                                                    onTranscript={(text) => setQuoteData({ ...quoteData, deadline: text })}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" /> Special Requirements
                                            </label>
                                            <div className="relative group">
                                                <textarea
                                                    placeholder="e.g. Export quality, specific moisture level..."
                                                    rows="3"
                                                    value={quoteData.notes}
                                                    onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50 resize-none"
                                                ></textarea>
                                                <VoiceInputButton
                                                    onTranscript={(text) => setQuoteData({ ...quoteData, notes: text })}
                                                    className="absolute right-2 top-3"
                                                />
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2 group">
                                            Submit Request <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner onClose={() => setShowScanner(false)} />
            )}
        </div>
    );
};

export default B2BOrders;
