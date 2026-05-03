import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, Leaf, Clock, IndianRupee, FileText } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header — Audit Style */}
      <div className="card-industrial p-6 border-t-3 border-t-invention-orange">
        <div className="flex items-center gap-3 mb-3">
          <FileText size={20} className="text-invention-orange" />
          <div>
            <h1 className="text-lg font-black text-text-primary font-[Outfit] tracking-wider uppercase m-0">
              {language === 'en' ? 'Logistics Efficiency Audit' : 'लॉजिस्टिक्स दक्षता ऑडिट'}
            </h1>
            <p className="text-xs text-text-muted tracking-wider uppercase" style={{ fontFamily: 'Outfit' }}>
              {language === 'en' ? 'GatiSetu vs Traditional Middlemen' : 'गतिसेतु बनाम पारंपरिक बिचौलिये'}
            </p>
          </div>
        </div>
        <p className="text-xs text-text-secondary border-l-2 border-invention-orange pl-3">
          {language === 'en'
            ? 'Data-driven comparison proving the economic viability of predictive resource pooling.'
            : 'डेटा-आधारित तुलना जो प्रिडिक्टिव रिसोर्स पूलिंग की आर्थिक व्यवहार्यता साबित करती है।'}
        </p>
      </div>

      {/* ─── Audit Table ─── */}
      <div className="card-industrial overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Metric' : 'मापदंड'}</th>
              <th className="text-right">{language === 'en' ? 'Traditional' : 'पारंपरिक'}</th>
              <th className="text-right">GatiSetu</th>
              <th className="text-right">{language === 'en' ? 'Improvement' : 'सुधार'}</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARK_DATA.map((item, i) => {
              const isGain = item.metric === 'Driver Income';
              const improvement = isGain
                ? ((item.gatisetu - item.traditional) / item.traditional * 100).toFixed(0)
                : ((item.traditional - item.gatisetu) / item.traditional * 100).toFixed(0);

              return (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className="text-invention-orange" />
                      <span className="font-semibold">{item.metric}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-danger font-bold">{item.traditional.toLocaleString()} {item.unit}</span>
                  </td>
                  <td className="text-right">
                    <span className="text-mint-green font-bold">{item.gatisetu.toLocaleString()} {item.unit}</span>
                  </td>
                  <td className="text-right">
                    <span className={`font-black text-sm px-2 py-0.5 border ${
                      Number(improvement) > 0
                        ? 'text-mint-green border-mint-green/20 bg-mint-green/5'
                        : 'text-danger border-danger/20 bg-danger/5'
                    }`} style={{ borderRadius: '2px' }}>
                      {isGain ? '+' : '−'}{Math.abs(improvement)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Bar Chart ─── */}
      <div className="card-industrial p-5 space-y-4">
        <h3 className="header-label text-text-muted">
          {language === 'en' ? 'Comparative Analysis' : 'तुलनात्मक विश्लेषण'}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Inter' }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Inter' }} axisLine={{ stroke: '#334155' }} />
              <Tooltip
                contentStyle={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '2px',
                  color: '#F1F5F9',
                  fontSize: 12,
                  fontFamily: 'Inter',
                }}
              />
              <Bar dataKey="Traditional" fill="#EF4444" radius={0} />
              <Bar dataKey="GatiSetu" fill="#10B981" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 text-[10px] text-text-muted uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-danger inline-block" style={{ borderRadius: '1px' }} /> Traditional</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-mint-green inline-block" style={{ borderRadius: '1px' }} /> GatiSetu</span>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card kpi-card-mint text-center space-y-1">
          <p className="text-3xl font-black text-mint-green">58%</p>
          <p className="header-label">{language === 'en' ? 'Cost Reduction' : 'लागत में कमी'}</p>
        </div>
        <div className="kpi-card kpi-card-orange text-center space-y-1">
          <p className="text-3xl font-black text-invention-orange">62%</p>
          <p className="header-label">{language === 'en' ? 'CO₂ Reduction' : 'CO₂ कमी'}</p>
        </div>
        <div className="kpi-card kpi-card-mint text-center space-y-1">
          <p className="text-3xl font-black text-mint-green">+59%</p>
          <p className="header-label">{language === 'en' ? 'Driver Profit' : 'सारथी लाभ'}</p>
        </div>
      </div>
    </div>
  );
}
