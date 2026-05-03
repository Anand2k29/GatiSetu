import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Shield, Leaf, Clock, IndianRupee, Truck, ArrowRight, Users } from 'lucide-react';

const BENCHMARK_DATA = [
  { metric: 'Cost to Farmer', traditional: 100, gatisetu: 42, unit: '₹/km', icon: IndianRupee },
  { metric: 'Driver Income', traditional: 15000, gatisetu: 23800, unit: '₹/month', icon: TrendingUp },
  { metric: 'CO₂ Emissions', traditional: 100, gatisetu: 38, unit: 'kg/trip', icon: Leaf },
  { metric: 'Delivery Time', traditional: 8, gatisetu: 3.5, unit: 'hours', icon: Clock },
  { metric: 'Spoilage Rate', traditional: 16, gatisetu: 4, unit: '%', icon: Shield },
];

const CHART_DATA = BENCHMARK_DATA.map(d => ({
  name: d.metric.split(' ').slice(0, 2).join(' '),
  Traditional: d.traditional,
  GatiSetu: d.gatisetu,
}));

export default function BenchmarkPage() {
  const { language } = useApp();

  const steps = language === 'en'
    ? ['Farmer books via Voice/App', 'Walk to nearest Setu Point', 'Sarathi picks up pooled load', 'Deliver to Mandi', 'Backhaul return goods']
    : ['किसान आवाज़/ऐप से बुक करें', 'निकटतम सेतु पॉइंट पर जाएं', 'सारथी पूल किया भार उठाए', 'मंडी में पहुँचाए', 'वापसी में सामान लाएं'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 border-l-2 border-l-invention-orange">
        <h1 className="text-2xl font-black text-text-primary font-[Outfit]">
          {language === 'en' ? 'GatiSetu vs Traditional Middlemen' : 'गतिसेतु बनाम पारंपरिक बिचौलिये'}
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          {language === 'en'
            ? 'Data-driven comparison proving the economic viability of predictive resource pooling.'
            : 'डेटा-आधारित तुलना जो प्रिडिक्टिव रिसोर्स पूलिंग की आर्थिक व्यवहार्यता साबित करती है।'}
        </p>
      </div>

      {/* Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BENCHMARK_DATA.map((item, i) => {
          const improvement = item.metric === 'Driver Income'
            ? ((item.gatisetu - item.traditional) / item.traditional * 100).toFixed(0)
            : ((item.traditional - item.gatisetu) / item.traditional * 100).toFixed(0);
          const isGain = item.metric === 'Driver Income';

          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon size={16} className="text-invention-orange" />
                  <h3 className="text-sm font-bold text-text-primary">{item.metric}</h3>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 ${
                  Number(improvement) > 0
                    ? 'text-mint-green bg-mint-green/10 border border-mint-green/20'
                    : 'text-danger bg-danger/10 border border-danger/20'
                }`}>
                  {isGain ? '+' : '-'}{Math.abs(improvement)}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Traditional</span>
                  <span className="text-danger font-bold">{item.traditional} {item.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-danger/20">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full bg-danger/50" />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">GatiSetu</span>
                  <span className="text-mint-green font-bold">{item.gatisetu} {item.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-mint-green/20">
                  <motion.div initial={{ width: 0 }}
                    animate={{ width: `${(item.metric === 'Driver Income' ? item.gatisetu / item.traditional : item.gatisetu / item.traditional) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    className="h-full bg-mint-green" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          {language === 'en' ? 'Comparative Analysis' : 'तुलनात्मक विश्लेषण'}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#7a7a95', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <Tooltip contentStyle={{ background: '#14141f', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f5', fontSize: 12 }} />
              <Bar dataKey="Traditional" fill="#FF4D6A" radius={0} />
              <Bar dataKey="GatiSetu" fill="#2CFFA7" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* How It Works Flow */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          {language === 'en' ? 'How GatiSetu Works' : 'गतिसेतु कैसे काम करता है'}
        </h3>
        <div className="flex flex-col md:flex-row items-stretch gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex-1 bg-white/3 border border-border p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[80px]">
                <span className="w-6 h-6 flex items-center justify-center text-xs font-black bg-invention-orange text-white">
                  {i + 1}
                </span>
                <p className="text-xs text-text-secondary font-medium leading-tight">{step}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center py-1 md:py-0 md:px-1 text-text-muted">
                  <ArrowRight size={14} className="rotate-90 md:rotate-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Key Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="glass-card p-6 text-center border-t-2 border-t-mint-green">
          <p className="text-3xl font-black text-mint-green"><CountUp end={58} duration={2} />%</p>
          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider">
            {language === 'en' ? 'Cost Reduction' : 'लागत में कमी'}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="glass-card p-6 text-center border-t-2 border-t-invention-orange">
          <p className="text-3xl font-black text-invention-orange"><CountUp end={62} duration={2} />%</p>
          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider">
            {language === 'en' ? 'CO₂ Reduction' : 'CO₂ कमी'}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="glass-card p-6 text-center border-t-2 border-t-mint-green">
          <p className="text-3xl font-black text-mint-green">+<CountUp end={59} duration={2} />%</p>
          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider">
            {language === 'en' ? 'Driver Profit' : 'सारथी लाभ'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
