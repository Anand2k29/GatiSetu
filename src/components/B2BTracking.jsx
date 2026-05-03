import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Package, Users, MapPin, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ShieldCheck, Activity, BarChart3, Leaf, BadgeCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const B2BTracking = () => {
    const { t, b2bOrders, b2bQuotes, b2bDeliveryRequests } = useApp();

    // Transform B2B Quotes (Confirmed/Approved) into trackable orders
    const quoteOrders = b2bQuotes
        .filter(q => q.status === 'Confirmed' || q.status === 'BuyerApproved')
        .map(q => ({
            id: q.id,
            buyer: 'Verified Buyer', // In real app, would lookup buyer details
            fpo: q.farmerName || 'Registered FPO',
            product: q.commodity,
            quantity: `${q.quantity} Tons`,
            status: q.status === 'Confirmed' ? 'Processing' : 'Awaiting Final Confirm',
            escrowStatus: 'Secure',
            source: q.farmerResponse?.source || 'Farm Gate',
            destination: 'Buyer Hub',
            progress: q.status === 'Confirmed' ? 25 : 10,
            co2Impact: '0.5 Tons' // Placeholder calculation
        }));

    // Transform Delivery Requests into trackable orders
    const deliveryOrders = b2bDeliveryRequests.map(d => ({
        id: d.id,
        buyer: 'Distribution Center',
        fpo: d.farmerName,
        product: d.commodity,
        quantity: `${d.quantity} Tons`,
        status: d.status === 'Completed' ? 'Delivered' : d.status === 'Accepted' ? 'In-Transit' : 'Pending',
        escrowStatus: d.status === 'Completed' ? 'Settled' : 'In-Escrow',
        source: d.source,
        destination: d.destination,
        progress: d.status === 'Completed' ? 100 : d.status === 'Accepted' ? 60 : 0,
        co2Impact: '1.2 Tons'
    }));

    const allOrders = [...quoteOrders, ...deliveryOrders];

    const totalESG = allOrders.reduce((acc, order) => {
        const val = parseFloat(order.co2Impact) || 0;
        return acc + val;
    }, 142.5).toFixed(1);

    const stats = [
        { label: 'Platform ESG Impact', value: `${totalESG} Tons CO2`, icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Funds In Escrow', value: `₹${(allOrders.length * 0.45).toFixed(1)} Cr`, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Contracts', value: allOrders.length.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Revenue Generated', value: `₹${(allOrders.length * 1.2).toFixed(1)} Cr`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="text-emerald-600" />
                        B2B Oversight Dashboard
                    </h2>
                    <p className="text-gray-600 mt-1">Ministry monitoring of corporate procurement & platform-wide sustainability.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-2">
                        <Activity size={14} /> System Health: Operational
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`text-[10px] font-bold ${idx === 0 ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'} px-2 py-0.5 rounded-full flex items-center gap-0.5`}>
                                +24% <ArrowUpRight className="w-2.5 h-2.5" />
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracking Table */}
            <div className="glass-card overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">Live Procurement Pipeline</h3>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <ShieldCheck size={14} className="text-emerald-500" /> All Payments Secured
                        </span>
                        <button className="text-xs font-bold text-emerald-600 hover:underline">Export Analytics</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-400 font-black">
                                <th className="px-6 py-4">Transaction / FPO</th>
                                <th className="px-6 py-4">Buyer / Quantity</th>
                                <th className="px-6 py-4">Logistics & ESG</th>
                                <th className="px-6 py-4">Escrow Status</th>
                                <th className="px-6 py-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 leading-tight">{order.product}</span>
                                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                                <BadgeCheck size={12} /> {order.fpo}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">Ref: {order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{order.buyer}</span>
                                            <span className="text-xs text-gray-500">{order.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <MapPin className="w-3 h-3" />
                                                <span>{order.source} → {order.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
                                                <Leaf size={12} /> ESG Offset: {order.co2Impact}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 w-fit ${order.escrowStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            order.escrowStatus === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                            <ShieldCheck size={12} /> {order.escrowStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 min-w-[150px]">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                                                <span>{order.status}</span>
                                                <span>{order.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${order.progress}%` }}
                                                    className={`h-full transition-all duration-1000 ${order.status === 'Delivered' ? 'bg-emerald-500' :
                                                        order.status === 'In-Transit' ? 'bg-blue-500' :
                                                            'bg-orange-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Platform Sustainability Audit */}
                <div className="glass-card p-8 border border-emerald-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Leaf size={150} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-emerald-900 uppercase tracking-wider text-sm flex items-center gap-2">
                                <Leaf className="text-emerald-600" size={18} /> Sustainability Audit
                            </h4>
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded uppercase">Monthly Goal: 92%</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Direct Sourcing Adoption', score: 88, status: 'High' },
                                { name: 'Logistics Optimization', score: 76, status: 'On Track' },
                                { name: 'Plastic-free Packaging', score: 64, status: 'Improving' },
                            ].map((metric, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{metric.name}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">Status: {metric.status}</span>
                                        </div>
                                        <span className="font-black text-emerald-700">{metric.score}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/30">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.score}%` }}
                                            className="h-full bg-emerald-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-500 italic mt-4">
                            Krishi-Link B2B platform reduces average carbon miles by 340km per transaction.
                        </p>
                    </div>
                </div>

                {/* Secure Payment Escrow Analytics */}
                <div className="glass-card p-8 bg-gray-900 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-10">
                        <ShieldCheck size={200} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black uppercase tracking-widest text-emerald-400">Payment Pipeline</h4>
                            <BarChart3 className="text-emerald-400" size={20} />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-grow space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">In Escrow (Holding)</p>
                                    <p className="text-xl font-black text-white">₹3.24 Cr</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">In Transit (Settling)</p>
                                    <p className="text-xl font-black text-emerald-400">₹1.56 Cr</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                    <span>Escrow Liquidity Index</span>
                                    <span className="text-emerald-400">Stable</span>
                                </div>
                                <div className="flex gap-1 h-3">
                                    <div className="w-[60%] bg-white/20 rounded-l-md border-r border-gray-900"></div>
                                    <div className="w-[30%] bg-emerald-500 border-r border-gray-900"></div>
                                    <div className="w-[10%] bg-orange-500 rounded-r-md"></div>
                                </div>
                                <div className="flex gap-4 text-[9px] font-black uppercase mt-2">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white/20 rounded-full" /> Escrow</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Settling</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Disputed</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
                            View Detailed Financial Audit <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2BTracking;

