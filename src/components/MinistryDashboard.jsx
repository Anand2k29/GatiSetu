import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { Leaf, IndianRupee, Activity, TrendingUp, Truck, Users, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GovernmentSchemes from './GovernmentSchemes';

export default function MinistryDashboard() {
    const { totalSavings, totalCO2, liveRequests, totalFarmers, activeDrivers, users, drivers } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter requests
    const activeRequests = liveRequests.filter(req => req.status === 'Pending' || req.status === 'Accepted');
    const historyRequests = liveRequests.filter(req => req.status === 'Completed');

    const BASE_TODAY_SAVINGS = 0;
    const BASE_TODAY_CO2 = 0;

    const currentSavings = BASE_TODAY_SAVINGS + totalSavings;
    const currentCO2 = BASE_TODAY_CO2 + totalCO2;

    const graphData = [
        { name: 'Mon', savings: 0, co2: 0 },
        { name: 'Tue', savings: 0, co2: 0 },
        { name: 'Wed', savings: 0, co2: 0 },
        { name: 'Thu', savings: 0, co2: 0 },
        { name: 'Fri', savings: 0, co2: 0 },
        { name: 'Sat', savings: 0, co2: 0 },
        { name: 'Today', savings: currentSavings, co2: currentCO2 },
    ];

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Live Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={IndianRupee} label="Total Savings" value={totalSavings} color="emerald" prefix="₹" />
                <MetricCard icon={Leaf} label="CO2 Saved" value={totalCO2} color="teal" suffix="kg" decimals={1} />
                <MetricCard icon={Users} label="Farmers Supported" value={totalFarmers} color="blue" />
                <MetricCard icon={Truck} label="Active Drivers" value={activeDrivers} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Feed Table - Takes up 2/3 */}
                <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Active Orders
                        </h3>
                    </div>
                    {/* ... table content remains same ... */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-left">Request ID</th>
                                    <th className="px-6 py-3 text-left">Farmer</th>
                                    <th className="px-6 py-3 text-left">Route</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Assigned Driver</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {activeRequests.map((req) => (
                                        <motion.tr
                                            key={req.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-xs text-gray-500">#{req.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.farmerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{req.sourceVillage} → {req.targetMandi}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                    req.status === 'Accepted' ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                                                )}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {req.driverName ? (
                                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                        <Truck className="w-3 h-3" /> {req.driverName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Looking...</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {activeRequests.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No active orders</td></tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Analytics Graph - Takes up 1/3 */}
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> Weekly Impact
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Savings']}
                                />
                                <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-emerald-50 p-2 rounded-lg text-center">
                            <p className="text-xs text-emerald-600 font-bold">AVG SAVING</p>
                            <p className="font-bold text-gray-800">
                                ₹{liveRequests.length > 0 ? (totalSavings / liveRequests.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                            </p>
                        </div>
                        <div className="bg-teal-50 p-2 rounded-lg text-center">
                            <p className="text-xs text-teal-600 font-bold">TOTAL TRIPS</p>
                            <p className="font-bold text-gray-800">{liveRequests.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFleet = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-gray-700">Available Fleet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {drivers.map((driver, idx) => {
                    const activeJob = liveRequests.find(r => r.driverName === driver.name && r.status === 'Accepted');
                    const isBusy = !!activeJob;

                    return (
                        <div key={idx} className="glass-card p-4 flex items-center space-x-4">
                            <div className={cn("p-3 rounded-full", isBusy ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600")}>
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{driver.name}</h4>
                                <p className="text-xs text-gray-500">{driver.vehicleNumber}</p>
                                <span className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block",
                                    isBusy ? "bg-orange-100 text-orange-800" : "bg-emerald-100 text-emerald-800"
                                )}>
                                    {isBusy ? 'On Delivery' : 'Available'}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {drivers.length === 0 && <p className="text-gray-500">No drivers registered yet.</p>}
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-gray-700">Order History</h3>
            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3 text-left">Completed At</th>
                            <th className="px-6 py-3 text-left">Farmer</th>
                            <th className="px-6 py-3 text-left">Driver</th>
                            <th className="px-6 py-3 text-left">Route</th>
                            <th className="px-6 py-3 text-left">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {historyRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {req.completedAt ? new Date(req.completedAt).toLocaleString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{req.farmerName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{req.driverName}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{req.sourceVillage} → {req.targetMandi}</td>
                                <td className="px-6 py-4 text-sm font-medium text-emerald-600">₹{req.krishiPrice}</td>
                            </tr>
                        ))}
                        {historyRequests.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No history available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRegistry = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Farmers List */}
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Users className="text-blue-500" /> Farmers
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {users.map((user, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedUser({ ...user, type: 'farmer' })}
                                className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center"
                            >
                                <span className="font-medium text-gray-700">{user.name}</span>
                                <span className="text-xs text-gray-400">Click for details</span>
                            </div>
                        ))}
                        {users.length === 0 && <p className="text-gray-400 text-sm">No farmers registered.</p>}
                    </div>
                </div>

                {/* Drivers List */}
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Truck className="text-purple-500" /> Drivers
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {drivers.map((driver, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedUser({ ...driver, type: 'driver' })}
                                className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors flex justify-between items-center"
                            >
                                <div>
                                    <span className="font-medium text-gray-700 block">{driver.name}</span>
                                    <span className="text-xs text-gray-500">{driver.vehicleNumber}</span>
                                </div>
                                <span className="text-xs text-gray-400">Click for details</span>
                            </div>
                        ))}
                        {drivers.length === 0 && <p className="text-gray-400 text-sm">No drivers registered.</p>}
                    </div>
                </div>
            </div>

            {/* User Details Modal (Inline) */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6 border-2 border-blue-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                                <p className="text-sm text-gray-500 capitalize">{selectedUser.type} Profile</p>
                                {selectedUser.vehicleNumber && <p className="text-xs text-gray-500">Vehicle: {selectedUser.vehicleNumber}</p>}
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">Close</button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Recent Activity</h4>
                            <div className="space-y-2">
                                {liveRequests.filter(r =>
                                    (selectedUser.type === 'farmer' && r.farmerName === selectedUser.name) ||
                                    (selectedUser.type === 'driver' && r.driverName === selectedUser.name)
                                ).length === 0 ? (
                                    <p className="text-gray-400 italic">No activity found for this user.</p>
                                ) : (
                                    liveRequests.filter(r =>
                                        (selectedUser.type === 'farmer' && r.farmerName === selectedUser.name) ||
                                        (selectedUser.type === 'driver' && r.driverName === selectedUser.name)
                                    ).map(r => (
                                        <div key={r.id} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                                            <span className="text-sm">
                                                <span className={cn(
                                                    "inline-block w-2 h-2 rounded-full mr-2",
                                                    r.status === 'Completed' ? "bg-gray-400" :
                                                        r.status === 'Accepted' ? "bg-blue-500" : "bg-yellow-500"
                                                )} />
                                                {r.sourceVillage} → {r.targetMandi} ({r.weight}kg)
                                            </span>
                                            <span className="text-xs font-medium text-gray-500">{r.status}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-blue-600" /> Ministry Dashboard
                </h2>

                {/* Tabs */}
                <div className="bg-white/50 p-1 rounded-xl flex space-x-1">
                    {['overview', 'fleet', 'history', 'registry', 'schemes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                activeTab === tab ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'fleet' && renderFleet()}
            {activeTab === 'history' && renderHistory()}
            {activeTab === 'registry' && renderRegistry()}
            {activeTab === 'schemes' && (
                <div className="glass-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GovernmentSchemes isAdmin={true} />
                </div>
            )}
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color, prefix = '', suffix = '', decimals = 0 }) {
    const colors = {
        emerald: "text-emerald-600 bg-emerald-100",
        teal: "text-teal-600 bg-teal-100",
        blue: "text-blue-600 bg-blue-100",
        purple: "text-purple-600 bg-purple-100",
    };

    // Fallback for color if not found
    const colorClass = colors[color] || colors.blue;
    const textColor = colorClass.split(' ')[0];

    return (
        <div className="glass-card p-6 flex items-center justify-between">
            <div>
                <p className={cn("text-xs font-bold uppercase tracking-wider opacity-70", textColor)}>{label}</p>
                <div className={cn("text-2xl font-bold mt-1", textColor)}>
                    {prefix}<CountUp end={value} decimals={decimals} duration={2} separator="," />{suffix}
                </div>
            </div>
            <div className={cn("p-3 rounded-full", colorClass)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
