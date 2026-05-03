import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Package, Calendar, MessageSquare, Send, CheckCircle2, X, TrendingUp, Users, IndianRupee, Clock, AlertCircle, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceInputButton from './VoiceInputButton';

const B2BMarketplace = () => {
    const { b2bQuotes, submitQuoteResponse, confirmB2BOrder, farmerProfile } = useApp();
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [offerData, setOfferData] = useState({
        pricePerTon: '',
        availableQuantity: '',
        deliveryDays: '',
        notes: '',
        source: '',
        destination: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(null);

    const handleOfferSubmit = (e) => {
        e.preventDefault();
        submitQuoteResponse({
            quoteId: selectedQuote.id,
            ...offerData,
            farmerName: farmerProfile?.name || 'Current Farmer',
            submittedAt: new Date().toISOString()
        });
        setIsSubmitted(true);
        setTimeout(() => {
            setSelectedQuote(null);
            setIsSubmitted(false);
            setOfferData({ pricePerTon: '', availableQuantity: '', deliveryDays: '', notes: '', source: '', destination: '' });
        }, 2000);

        // WhatsApp Notification (Step 1)
        sendWhatsAppNotification(selectedQuote, offerData);
    };

    const sendWhatsAppNotification = (quote, offer) => {
        const message = `🌾 *Krishi-Link New Offer*\n\n` +
            `Farmer ${farmerProfile?.name || 'A farmer'} has responded to your quote!\n\n` +
            `📦 *Commodity:* ${quote.commodity}\n` +
            `💰 *Offer Price:* ₹${offer.pricePerTon}/Ton\n` +
            `⚖️ *Qty Available:* ${offer.availableQuantity} Tons\n` +
            `📅 *Delivery:* ${offer.deliveryDays}\n` +
            `Please login to Approve the offer: http://localhost:5173`;

        const phoneNumber = quote.buyerPhone || '1234567890';
        // Simulating sending notification
        console.log(`Sending WhatsApp to ${phoneNumber}: ${message}`);
        alert("Offer submitted! Buyer notified via WhatsApp to Approve.");
    };

    const handleFinalConfirm = (quote) => {
        confirmB2BOrder(quote.id);
        alert("Order Confirmed! Delivery Request sent to Drivers.");
    };

    // Legacy/Removed: handleAcceptQuote (Replaced by handleOfferSubmit + handleFinalConfirm flow)

    // Filter quotes by status
    const pendingQuotes = b2bQuotes.filter(q => q.status === 'Pending');
    const respondedQuotes = b2bQuotes.filter(q => q.status === 'Responded' || q.status === 'Accepted');

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-orange-600" />
                        B2B Quote Marketplace
                    </h2>
                    <p className="text-gray-600 mt-1">Respond to bulk procurement requests from hotels and restaurants</p>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
                    <div className="bg-orange-600 p-2 rounded-lg text-white">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Active Requests</p>
                        <p className="text-sm font-black text-gray-900">{pendingQuotes.length} Open Quotes</p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="glass-card bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <AlertCircle size={24} />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 mb-1">How It Works</h3>
                        <p className="text-sm text-gray-600">
                            B2B buyers (hotels, restaurants, retail chains) submit custom quote requests for bulk produce.
                            Review their requirements and submit your best offer. Competitive pricing and quality will help you win contracts!
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending Quotes', value: pendingQuotes.length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Your Responses', value: respondedQuotes.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg. Response Time', value: '< 2 hrs', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
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

            {/* Pending Quote Requests */}
            {pendingQuotes.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="text-orange-600" />
                        Open Quote Requests
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pendingQuotes.map((quote) => (
                            <motion.div
                                key={quote.id}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 space-y-4 border border-orange-100 hover:border-orange-200 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono font-bold text-gray-400">{quote.id}</span>
                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                                                {quote.status}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900">{quote.commodity}</h4>
                                        <p className="text-sm text-gray-500">Requested by B2B Buyer</p>
                                    </div>
                                    <div className="bg-orange-50 p-2 rounded-lg">
                                        <Package className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Quantity</p>
                                        <p className="text-lg font-black text-gray-900">{quote.quantity} Tons</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Timeline</p>
                                        <p className="text-sm font-bold text-gray-900">{quote.deadline}</p>
                                    </div>
                                </div>

                                {quote.notes && (
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1">
                                            <MessageSquare size={12} /> Special Requirements
                                        </p>
                                        <p className="text-sm text-gray-700">{quote.notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div className="text-xs text-gray-400">
                                        <Calendar size={12} className="inline mr-1" />
                                        Posted: {new Date(quote.createdAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => setSelectedQuote(quote)}
                                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-black hover:from-orange-600 hover:to-amber-600 transition-all text-sm shadow-xl shadow-orange-200 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-white/20 animate-pulse"
                                    >
                                        <Send size={16} className="animate-bounce" /> Submit Offer
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Quote Requests</h3>
                    <p className="text-gray-500">
                        New bulk procurement requests from B2B buyers will appear here. Check back soon!
                    </p>
                </div>
            )}

            {/* Your Responses */}
            {respondedQuotes.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-600" />
                        Your Submitted Offers
                    </h3>
                    <div className="glass-card overflow-hidden border border-emerald-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                        <th className="px-6 py-4">Quote ID</th>
                                        <th className="px-6 py-4">Commodity</th>
                                        <th className="px-6 py-4">Your Offer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {respondedQuotes.map((quote) => (
                                        <tr key={quote.id} className="text-sm hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-500">{quote.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{quote.commodity}</span>
                                                    <span className="text-[10px] text-gray-500">{quote.quantity} Tons</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-emerald-700">₹{quote.yourOffer || 'Pending'}/Ton</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${quote.status === 'Accepted'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {quote.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {quote.status === 'Responded' && (
                                                    <button
                                                        onClick={() => handleAcceptQuote(quote)}
                                                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1"
                                                    >
                                                        <Truck size={14} /> Accept & Request Pickup
                                                    </button>
                                                )}
                                                {quote.status === 'Accepted' && (
                                                    <span className="text-xs text-gray-500">Delivery Requested</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Offer Modal */}
            <AnimatePresence>
                {selectedQuote && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitted && setSelectedQuote(null)}
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
                                    <h3 className="text-2xl font-bold text-gray-900">Offer Submitted!</h3>
                                    <p className="text-gray-500">The B2B buyer will review your offer and contact you if selected.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <Package className="w-6 h-6" />
                                                <h3 className="text-xl font-bold">Submit Your Offer</h3>
                                            </div>
                                            <button onClick={() => setSelectedQuote(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                                            <p className="text-sm opacity-90 mb-2">Quote Request:</p>
                                            <p className="text-lg font-bold">{selectedQuote.commodity}</p>
                                            <div className="flex gap-4 mt-2 text-sm">
                                                <span>Qty: {selectedQuote.quantity} Tons</span>
                                                <span>•</span>
                                                <span>Timeline: {selectedQuote.deadline}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleOfferSubmit} className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                    <IndianRupee className="w-3 h-3" /> Price per Ton
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="e.g. 22500"
                                                    value={offerData.pricePerTon}
                                                    onChange={(e) => setOfferData({ ...offerData, pricePerTon: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                    <Package className="w-3 h-3" /> Available Qty (Tons)
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="e.g. 50"
                                                    value={offerData.availableQuantity}
                                                    onChange={(e) => setOfferData({ ...offerData, availableQuantity: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Delivery Timeline (Days)
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. 7-10 days"
                                                    value={offerData.deliveryDays}
                                                    onChange={(e) => setOfferData({ ...offerData, deliveryDays: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                                />
                                                <VoiceInputButton
                                                    onTranscript={(text) => setOfferData({ ...offerData, deliveryDays: text })}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" /> Additional Notes
                                            </label>
                                            <div className="relative group">
                                                <textarea
                                                    placeholder="e.g. Organic certified, Grade A quality..."
                                                    rows="3"
                                                    value={offerData.notes}
                                                    onChange={(e) => setOfferData({ ...offerData, notes: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-100 focus:border-orange-500 outline-none transition-all bg-gray-50 resize-none"
                                                ></textarea>
                                                <VoiceInputButton
                                                    onTranscript={(text) => setOfferData({ ...offerData, notes: text })}
                                                    className="absolute right-2 top-3"
                                                />
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2 group">
                                            Submit Offer <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default B2BMarketplace;
