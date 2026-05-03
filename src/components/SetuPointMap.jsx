import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { MapPin, Truck, Users } from 'lucide-react';

export default function SetuPointMap({ groups }) {
  const { language } = useApp();
  if (!groups || groups.length === 0) return null;

  // SVG dimensions
  const W = 800, H = 400;
  const PAD = 60;

  // Normalize coordinates to SVG space
  const allLats = groups.flatMap(g => [g.setu_point.location.lat, ...g.farmers.map(f => f.location.lat)]);
  const allLngs = groups.flatMap(g => [g.setu_point.location.lng, ...g.farmers.map(f => f.location.lng)]);
  const minLat = Math.min(...allLats), maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs), maxLng = Math.max(...allLngs);
  const latRange = maxLat - minLat || 0.1;
  const lngRange = maxLng - minLng || 0.1;

  const toX = (lng) => PAD + ((lng - minLng) / lngRange) * (W - 2 * PAD);
  const toY = (lat) => H - PAD - ((lat - minLat) / latRange) * (H - 2 * PAD);

  const COLORS = ['#2CFFA7', '#FF6B2C', '#60A5FA', '#FBBF24', '#A78BFA', '#F472B6'];

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <MapPin size={16} className="text-mint-green" />
          {language === 'en' ? 'Setu Point Operations Map' : 'सेतु पॉइंट ऑपरेशन मैप'}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-mint-green inline-block" /> {language === 'en' ? 'Setu Point' : 'सेतु पॉइंट'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-invention-orange inline-block" /> {language === 'en' ? 'Farmer' : 'किसान'}
          </span>
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minHeight: 280 }}>
          {/* Grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line x1={PAD + i * ((W - 2 * PAD) / 7)} y1={PAD} x2={PAD + i * ((W - 2 * PAD) / 7)} y2={H - PAD}
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={PAD} y1={PAD + i * ((H - 2 * PAD) / 7)} x2={W - PAD} y2={PAD + i * ((H - 2 * PAD) / 7)}
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </React.Fragment>
          ))}

          {/* Connection lines: farmers → setu point */}
          {groups.map((group, gi) => {
            const spX = toX(group.setu_point.location.lng);
            const spY = toY(group.setu_point.location.lat);
            const color = COLORS[gi % COLORS.length];

            return group.farmers.map((farmer, fi) => {
              const fX = toX(farmer.location.lng);
              const fY = toY(farmer.location.lat);
              return (
                <motion.line
                  key={`line-${gi}-${fi}`}
                  x1={fX} y1={fY} x2={spX} y2={spY}
                  stroke={color} strokeWidth="1" opacity="0.3"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1, delay: gi * 0.2 + fi * 0.1 }}
                />
              );
            });
          })}

          {/* Farmer dots */}
          {groups.map((group, gi) => {
            const color = COLORS[gi % COLORS.length];
            return group.farmers.map((farmer, fi) => (
              <motion.g key={`farmer-${gi}-${fi}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.2 + fi * 0.1 + 0.5 }}>
                <circle cx={toX(farmer.location.lng)} cy={toY(farmer.location.lat)}
                  r="4" fill={color} opacity="0.7" />
                <text x={toX(farmer.location.lng)} y={toY(farmer.location.lat) - 8}
                  fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle" fontFamily="Inter">
                  {farmer.name.split(' ')[0]}
                </text>
              </motion.g>
            ));
          })}

          {/* Setu Point nodes */}
          {groups.map((group, gi) => {
            const x = toX(group.setu_point.location.lng);
            const y = toY(group.setu_point.location.lat);
            const color = COLORS[gi % COLORS.length];
            return (
              <motion.g key={`sp-${gi}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.3, type: 'spring' }}>
                {/* Glow */}
                <circle cx={x} cy={y} r="18" fill={color} opacity="0.08" />
                <circle cx={x} cy={y} r="12" fill={color} opacity="0.15" />
                {/* Node */}
                <rect x={x - 8} y={y - 8} width="16" height="16" fill={color} opacity="0.9" />
                {/* Label */}
                <text x={x} y={y + 26} fill="rgba(255,255,255,0.7)" fontSize="8"
                  textAnchor="middle" fontWeight="bold" fontFamily="Outfit">
                  {group.setu_point.name.split(' ').slice(0, 2).join(' ')}
                </text>
                <text x={x} y={y + 36} fill="rgba(255,255,255,0.35)" fontSize="7"
                  textAnchor="middle" fontFamily="Inter">
                  {group.farmer_count} farmers · {group.total_weight_kg}kg
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
