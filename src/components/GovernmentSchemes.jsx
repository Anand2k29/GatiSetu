import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const SCHEMES = [
    {
        id: 'pm-kisan',
        title: 'PM-KISAN',
        description: 'Direct income support of ₹6,000 per year to all landholding farmer families.',
        subsidy: '₹6,000/year',
        status: 'Active',
        category: 'Income Support'
    },
    {
        id: 'fertilizer',
        title: 'Fertilizer Subsidy',
        description: 'Highly subsidized urea and P&K fertilizers provided to farmers.',
        subsidy: 'Up to 50%',
        status: 'Active',
        category: 'Inputs'
    },
    {
        id: 'drip',
        title: 'Drip Irrigation Loans',
        description: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) for micro-irrigation.',
        subsidy: '80-90%',
        status: 'Limited',
        category: 'Infrastructure'
    },
    {
        id: 'crop-insurance',
        title: 'PM Fasal Bima Yojana',
        description: 'Comprehensive crop insurance against non-preventable natural risks.',
        subsidy: 'Premium as low as 2%',
        status: 'Active',
        category: 'Insurance'
    }
];

export default function GovernmentSchemes({ isAdmin = false }) {
    const [expandedScheme, setExpandedScheme] = useState(null);
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-emerald-600 w-6 h-6" />
                        Government Scheme Aggregator
                    </h3>
                    <p className="text-sm text-gray-500">Live subsidies and financial aid programs for Indian agriculture.</p>
                </div>

                {!isAdmin && (
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
                    >
                        <HelpCircle size={18} />
                        {showGuide ? 'Hide Guide' : 'One-Click Apply Guide'}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-lg space-y-4">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <CheckCircle size={20} />
                                One-Click Application Guide
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="text-xl font-bold block mb-1">01</span>
                                    <p className="font-medium">Verify Aadhaar Details</p>
                                    <p className="opacity-80 text-xs">Ensure your profile name matches your Aadhaar card.</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="text-xl font-bold block mb-1">02</span>
                                    <p className="font-medium">Select Active Scheme</p>
                                    <p className="opacity-80 text-xs">Choose the subsidy that best fits your current crop cycle.</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="text-xl font-bold block mb-1">03</span>
                                    <p className="font-medium">Instant Linking</p>
                                    <p className="opacity-80 text-xs">Krishi-Link automatically sends your data to the DBT portal.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCHEMES.map((scheme) => (
                    <div
                        key={scheme.id}
                        className={cn(
                            "glass-card p-5 transition-all duration-300 border-l-4",
                            expandedScheme === scheme.id ? "border-emerald-500 scale-[1.02]" : "border-gray-200 hover:border-emerald-300"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{scheme.category}</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                        scheme.status === 'Active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {scheme.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">{scheme.title}</h4>
                                <p className="text-emerald-700 font-bold text-sm mt-1">{scheme.subsidy}</p>
                            </div>
                            <button
                                onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                {expandedScheme === scheme.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        <AnimatePresence>
                            {expandedScheme === scheme.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mt-4"
                                >
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {scheme.description}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm">
                                            Apply Now
                                        </button>
                                        <button className="px-3 py-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
