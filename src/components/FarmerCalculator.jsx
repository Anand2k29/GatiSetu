import React, { useState, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { useApp } from '../context/AppContext';
import { Leaf, IndianRupee, Truck, ArrowRight, MapPin, Navigation, TrendingUp, TrendingDown, Search, Filter, Wheat, Sprout, CloudRain, Sun, Wind, Share2, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import VoiceInputButton from './VoiceInputButton';

const VILLAGES = ['Rampur', 'Kishangarh', 'Badlapur', 'Sonarpur', 'Madhopur', 'Begampur', 'Chandpur', 'Dharmapur', 'Lakshmanpur'];
const MANDIS = ['Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi', 'Keshopur Mandi'];

const MANDI_DATA = {
    'Azadpur Mandi': [
        { id: 1, name: 'Wheat (Gehun)', price: 2350, unit: 'Quintal', trend: 'up', change: '+2.4%', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 2, name: 'Rice (Basmati)', price: 4200, unit: 'Quintal', trend: 'down', change: '-1.1%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 3, name: 'Mustard (Sarson)', price: 5450, unit: 'Quintal', trend: 'up', change: '+5.2%', icon: Sprout, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 4, name: 'Sugarcane', price: 350, unit: 'Quintal', trend: 'up', change: '+0.8%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 5, name: 'Tomato', price: 1800, unit: 'Quintal', trend: 'down', change: '-12.4%', icon: FruitIcon, color: 'text-red-600', bg: 'bg-red-50' },
    ],
    'Ghazipur Mandi': [
        { id: 1, name: 'Wheat (Gehun)', price: 2380, unit: 'Quintal', trend: 'up', change: '+3.1%', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 2, name: 'Rice (Basmati)', price: 4150, unit: 'Quintal', trend: 'down', change: '-0.8%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 3, name: 'Mustard (Sarson)', price: 5300, unit: 'Quintal', trend: 'down', change: '-1.2%', icon: Sprout, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 4, name: 'Sugarcane', price: 360, unit: 'Quintal', trend: 'up', change: '+1.5%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 5, name: 'Tomato', price: 1750, unit: 'Quintal', trend: 'down', change: '-8.2%', icon: FruitIcon, color: 'text-red-600', bg: 'bg-red-50' },
    ],
    'Okhla Mandi': [
        { id: 1, name: 'Wheat (Gehun)', price: 2320, unit: 'Quintal', trend: 'down', change: '-0.5%', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 2, name: 'Rice (Basmati)', price: 4300, unit: 'Quintal', trend: 'up', change: '+1.2%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 3, name: 'Mustard (Sarson)', price: 5550, unit: 'Quintal', trend: 'up', change: '+6.1%', icon: Sprout, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 4, name: 'Sugarcane', price: 345, unit: 'Quintal', trend: 'down', change: '-0.5%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 5, name: 'Tomato', price: 1950, unit: 'Quintal', trend: 'up', change: '+4.4%', icon: FruitIcon, color: 'text-red-600', bg: 'bg-red-50' },
    ],
    'Keshopur Mandi': [
        { id: 1, name: 'Wheat (Gehun)', price: 2400, unit: 'Quintal', trend: 'up', change: '+4.2%', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 2, name: 'Rice (Basmati)', price: 4100, unit: 'Quintal', trend: 'down', change: '-2.1%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 3, name: 'Mustard (Sarson)', price: 5400, unit: 'Quintal', trend: 'up', change: '+4.8%', icon: Sprout, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 4, name: 'Sugarcane', price: 355, unit: 'Quintal', trend: 'up', change: '+2.1%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 5, name: 'Tomato', price: 1700, unit: 'Quintal', trend: 'down', change: '-10.4%', icon: FruitIcon, color: 'text-red-600', bg: 'bg-red-50' },
    ],
};

function FruitIcon(props) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
            <path d="M12 2v2" />
            <path d="M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
    );
}

export default function FarmerCalculator() {
    const { addRequest, farmerProfile, t } = useApp();
    const [weight, setWeight] = useState(200);
    const [distance, setDistance] = useState(50);
    const [sourceVillage, setSourceVillage] = useState(VILLAGES[0]);
    const [targetMandi, setTargetMandi] = useState(MANDIS[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isBooked, setIsBooked] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // Constants
    const RATE_PER_KM = 15;
    const DISCOUNT_FACTOR = 0.6; // 40% discount
    const CO2_PER_KM = 0.12;

    // Real-time calculations
    const standardPrice = useMemo(() => distance * RATE_PER_KM, [distance]);
    const krishiPrice = useMemo(() => standardPrice * DISCOUNT_FACTOR, [standardPrice]);
    const savings = useMemo(() => standardPrice - krishiPrice, [standardPrice, krishiPrice]);
    const co2Saved = useMemo(() => distance * CO2_PER_KM, [distance]);

    const filteredPrices = useMemo(() => {
        const prices = MANDI_DATA[targetMandi] || MANDI_DATA['Azadpur Mandi'];
        return prices.filter(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, targetMandi]);

    const handleWhatsAppShare = () => {
        if (!bookingDetails) return;
        const text = `Krishi-Link Booking Confirmed!\nID: ${bookingDetails.id}\nFrom: ${bookingDetails.sourceVillage}\nTo: ${bookingDetails.targetMandi}\nPrice: ₹${bookingDetails.krishiPrice}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleBook = () => {
        const requestData = {
            id: Date.now(),
            farmerName: farmerProfile?.name || 'Unknown Farmer',
            sourceVillage,
            targetMandi,
            weight,
            distance,
            standardPrice,
            krishiPrice,
            savings,
            co2: co2Saved,
            timestamp: new Date().toISOString(),
            status: 'Pending',
        };
        addRequest(requestData);
        setIsBooked(true);
        setBookingDetails(requestData);

        setTimeout(() => {
            setIsBooked(false);
        }, 2000);
    };

    const weatherAlert = useMemo(() => {
        // Deterministic mock weather based on village name
        if (sourceVillage.length % 3 === 0) return { type: 'rain', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' };
        if (sourceVillage.length % 2 === 0) return { type: 'wind', icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50' };
        return { type: 'sun', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50' };
    }, [sourceVillage]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Market Prices Section */}
                <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-left-4 duration-500 order-2 lg:order-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold text-gray-800">{t('marketPrices')}</h2>
                        </div>
                        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Live: {t(targetMandi)}
                        </div>
                    </div>

                    <div className="relative mb-6 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t('Search crops in') + " " + t(targetMandi) + "..."}
                            className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <VoiceInputButton
                            onTranscript={(text) => setSearchTerm(text)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                        {filteredPrices.map((crop) => (
                            <div key={crop.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group">
                                <div className="flex items-center space-x-4">
                                    <div className={cn("p-3 rounded-xl transition-all group-hover:scale-110", crop.bg, crop.color)}>
                                        <crop.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{crop.name}</h4>
                                        <p className="text-xs text-gray-400">per {crop.unit}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">₹{crop.price}</p>
                                    <div className={cn(
                                        "flex items-center justify-end text-xs font-bold",
                                        crop.trend === 'up' ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {crop.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                        {crop.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col space-y-4">
                        {/* Weather Advisory Card */}
                        <div className={cn("p-4 rounded-2xl border flex items-start space-x-3 animate-in slide-in-from-bottom duration-500", weatherAlert.bg, weatherAlert.color + "/20")}>
                            <div className={cn("p-2 rounded-xl text-white mt-0.5", weatherAlert.type === 'rain' ? "bg-blue-500" : weatherAlert.type === 'wind' ? "bg-teal-500" : "bg-amber-500")}>
                                <weatherAlert.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">{t('weatherWarning')}: {t(sourceVillage)}</p>
                                <p className="text-sm font-medium leading-snug">
                                    {weatherAlert.type === 'rain' ? t('heavyRain') :
                                        weatherAlert.type === 'wind' ? "High winds expected. Secure your loads during transport." :
                                            "Ideal harvest weather today. Book transport early to avoid the rush."}
                                </p>
                            </div>
                        </div>

                        {/* Market Insight */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-start space-x-3">
                            <div className="bg-gray-500 p-1.5 rounded-lg text-white mt-0.5">
                                <IndianRupee className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Market Insight</p>
                                <p className="text-sm text-gray-700 leading-snug">Prices in **{t(targetMandi)}** are fluctuating. Compare with other Mandis for the best deal.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Get Quote Section */}
                <div className="space-y-6 order-1 lg:order-2">
                    <div className="glass-card p-6 md:p-8 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <Truck className="w-6 h-6 text-emerald-500" />
                                <h2 className="text-2xl font-bold text-gray-800">{t('getQuote')}</h2>
                            </div>
                            {farmerProfile && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{t('welcome')},</p>
                                    <p className="font-semibold text-emerald-700">{farmerProfile.name}</p>
                                </div>
                            )}
                        </div>

                        {/* Input Controls */}
                        <div className="space-y-6">
                            {/* Location Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" /> {t('farmer')} {t('Village')}
                                    </label>
                                    <select
                                        value={sourceVillage}
                                        onChange={(e) => setSourceVillage(e.target.value)}
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        {VILLAGES.map(v => <option key={v} value={v}>{t(v)}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center">
                                        <Navigation className="w-3 h-3 mr-1" /> {t('driver')} {t('Mandi')}
                                    </label>
                                    <select
                                        value={targetMandi}
                                        onChange={(e) => setTargetMandi(e.target.value)}
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        {MANDIS.map(m => <option key={m} value={m}>{t(m)}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Weight */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-600">Load Weight</label>
                                    <span className="font-bold text-emerald-600">{weight} kg</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>

                            {/* Distance */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-600">Distance</label>
                                    <span className="font-bold text-blue-600">{distance} km</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>

                        {/* Visual Output */}
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500">{t('standardPrice')}</span>
                                <span className="text-lg font-semibold text-red-400 line-through">
                                    ₹{standardPrice.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 ring-1 ring-emerald-200 shadow-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="text-emerald-800 font-medium">{t('krishiLink')}</span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-600">
                                    ₹{krishiPrice.toLocaleString()}
                                </span>
                            </div>

                            <div className={cn(
                                "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                                savings > 500 ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-gray-100 text-gray-600"
                            )}>
                                <div className="flex items-center space-x-2">
                                    <IndianRupee className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('savings')}</span>
                                </div>
                                <span className="font-bold">₹{savings.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-green-600 text-sm mt-2">
                                <Leaf className="w-4 h-4" />
                                <span>Matches decrease CO2 by <b>{co2Saved.toFixed(1)} kg</b></span>
                            </div>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={isBooked}
                            className={cn(
                                "w-full mt-6 py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]",
                                isBooked ? "bg-emerald-700 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            )}
                        >
                            {isBooked ? (
                                <span className="flex items-center justify-center">Request Sent!</span>
                            ) : (
                                <span className="flex items-center justify-center">{t('bookNow')} <ArrowRight className="ml-2 w-5 h-5" /></span>
                            )}
                        </button>
                    </div>

                    {/* Booking Receipt */}
                    {bookingDetails && (
                        <div className="glass-card p-6 bg-white animate-in slide-in-from-bottom duration-500">
                            <div className="text-center space-y-4">
                                <div className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold inline-block">
                                    {t('bookingConfirmed')}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{t('scanToVerify')}</h3>
                                <div className="flex justify-center p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                                    <QRCode
                                        value={JSON.stringify({
                                            id: bookingDetails.id,
                                            price: bookingDetails.krishiPrice,
                                            weight: bookingDetails.weight
                                        })}
                                        size={128}
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Booking ID: {bookingDetails.id}</p>

                                <div className="border-t border-gray-100 pt-4 mt-4 text-left space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{t('Village')}:</span>
                                        <span className="font-medium">{t(bookingDetails.sourceVillage)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{t('Mandi')}:</span>
                                        <span className="font-medium">{t(bookingDetails.targetMandi)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleWhatsAppShare}
                                    className="w-full flex items-center justify-center space-x-2 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-md group mt-4 text-sm"
                                >
                                    <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    <span>{t('sendWhatsApp')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
