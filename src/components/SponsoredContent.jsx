import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ExternalLink, Award, Play, ChevronRight, Speaker, CloudLightning, Bug, Thermometer, ShieldAlert, BadgeCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SponsoredContent = () => {
    const { t } = useApp();

    const bannerAds = [
        {
            id: 1,
            company: 'GreenFertilizers Ltd.',
            slogan: 'Grow More, Spend Less',
            description: 'Special 20% discount on organic NPK fertilizers for the upcoming season.',
            image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800',
            cta: 'View Offers',
            tag: 'Partner Offer',
        },
        {
            id: 2,
            company: 'Agri-Seed Pro',
            slogan: 'Precision Seeds for Better Yield',
            description: 'Drought-resistant wheat and rice seeds designed for Indian soil.',
            image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=800',
            cta: 'Request Samples',
            tag: 'Sponsored',
        },
    ];

    const advisories = [
        {
            id: 1,
            type: 'Weather Alert',
            title: 'High Humidity Warning',
            message: 'High moisture detected in Punjab region. Risk of fungal infection in Wheat is high. Recommendation: Use Fungicide-X for protection.',
            sponsor: 'Bayer Crop Science',
            icon: CloudLightning,
            color: 'bg-blue-100 text-blue-600',
            border: 'border-blue-200'
        },
        {
            id: 2,
            type: 'Pest Alert',
            title: 'Locust Sighting: Western Rajasthan',
            message: 'Swarms detected moving east. Immediate preventive spraying recommended. Click for approved chemical list.',
            sponsor: 'PI Industries',
            icon: Bug,
            color: 'bg-red-100 text-red-600',
            border: 'border-red-200'
        },
        {
            id: 3,
            type: 'Tech Tip',
            title: 'Optimize Irrigation: Heatwave Ahead',
            message: 'Temperature surge expected next 48 hrs. Increase drip intensity between 4 AM - 9 AM for maximum efficiency.',
            sponsor: 'Jain Irrigation',
            icon: Thermometer,
            color: 'bg-orange-100 text-orange-600',
            border: 'border-orange-200'
        }
    ];

    const educationalContent = [
        {
            id: 1,
            title: 'Modern Drip Irrigation Techniques',
            author: 'Finolex Plasson Industries',
            category: 'Water Management',
            readTime: '5 min read',
            thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
            type: 'Article',
        },
        {
            id: 2,
            title: 'Maximizing Yield with Bio-Organic Boosters',
            author: 'SoilHealth Global',
            category: 'Organic Farming',
            readTime: '10 min training',
            thumbnail: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=400',
            type: 'Workshop',
        },
        {
            id: 3,
            title: 'Integrated Pest Management for Paddy',
            author: 'Bayer Crop Science',
            category: 'Pest Control',
            readTime: '4 min read',
            thumbnail: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=400',
            type: 'Article',
        },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                    <Sparkles className="text-emerald-600 w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Sponsored Highlights</h2>
                    <p className="text-gray-500">Premium resources and exclusive offers from our trusted partners.</p>
                </div>
            </div>

            {/* Agri-Advisories Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-orange-600" />
                    <h3 className="text-xl font-bold text-gray-900">Real-time Agri-Advisories</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {advisories.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: alert.id * 0.1 }}
                            className={`glass-card p-5 border ${alert.border} relative overflow-hidden group hover:shadow-lg transition-all`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${alert.color} p-3 rounded-xl`}>
                                    <alert.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-wider opacity-60">{alert.type}</p>
                                    <h4 className="font-bold text-gray-900 text-sm">{alert.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                        {alert.message}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <BadgeCheck size={14} className="text-emerald-600" />
                                    <span className="text-[10px] font-bold text-gray-400">By {alert.sponsor}</span>
                                </div>
                                <button className="text-emerald-600 font-bold text-[10px] hover:underline">
                                    Detailed Guide
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Featured Banner Ad */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
                <div className="flex flex-col lg:flex-row bg-gray-900 border border-white/10 group">
                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center space-y-6 z-10">
                        <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">
                            {bannerAds[0].tag}
                        </span>
                        <div>
                            <h3 className="text-lg text-emerald-400 font-bold mb-1">{bannerAds[0].company}</h3>
                            <h4 className="text-4xl font-extrabold text-white leading-tight">
                                {bannerAds[0].slogan}
                            </h4>
                            <p className="text-gray-400 mt-4 text-lg">
                                {bannerAds[0].description}
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 transform active:scale-95">
                                {bannerAds[0].cta} <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative h-80 lg:h-auto">
                        <img
                            src={bannerAds[0].image}
                            alt="Ad Banner"
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 lg:from-transparent to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Educational Content Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="text-emerald-600" />
                        Partner Education
                    </h3>
                    <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-1 group">
                        View All Resources <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {educationalContent.map((content) => (
                        <motion.div
                            key={content.id}
                            whileHover={{ scale: 1.02 }}
                            className="glass-card overflow-hidden group border border-gray-100/50"
                        >
                            <div className="relative h-40">
                                <img
                                    src={content.thumbnail}
                                    alt={content.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-black uppercase rounded shadow-sm border border-white">
                                    {content.type}
                                </div>
                                {content.type === 'Workshop' && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <div className="bg-white p-3 rounded-full shadow-lg">
                                            <Play className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 space-y-3">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                    {content.category}
                                </p>
                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                    {content.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                                    <span className="flex items-center gap-1">
                                        <Speaker className="w-3 h-3" /> {content.author}
                                    </span>
                                    <span>{content.readTime}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Secondary Ad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 bg-gradient-to-br from-white to-gray-50 flex flex-col md:flex-row items-center gap-8 border border-emerald-50">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white flex-shrink-0">
                        <img src={bannerAds[1].image} className="w-full h-full object-cover" alt="Ad 2" />
                    </div>
                    <div className="text-center md:text-left space-y-3">
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">
                            {bannerAds[1].tag}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{bannerAds[1].company}</h4>
                        <p className="text-sm text-gray-600 italic">"{bannerAds[1].slogan}"</p>
                        <button className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors inline-block mt-2">
                            {bannerAds[1].cta}
                        </button>
                    </div>
                </div>

                <div className="glass-card p-8 bg-emerald-900 text-white flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Award className="w-4 h-4" /> Trusted Partner Program
                    </div>
                    <h4 className="text-2xl font-bold">Advertise with Krishi-Link</h4>
                    <p className="text-emerald-100/70 text-sm">
                        Reach over 500,000+ active farmers across India. Promote your agricultural solutions today.
                    </p>
                    <button className="w-full py-3 bg-white text-emerald-900 rounded-xl font-bold hover:bg-emerald-50 transition-all mt-2">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SponsoredContent;
