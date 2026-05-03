import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin } from 'lucide-react';

export default function SetuPointMap({ groups, heatmapMode = false }) {
  const { language } = useApp();
  if (!groups || groups.length === 0) return null;

  const W = 800, H = 400, PAD = 60;

  const allLats = groups.flatMap(g => [g.setu_point.location.lat, ...g.farmers.map(f => f.location.lat)]);
  const allLngs = groups.flatMap(g => [g.setu_point.location.lng, ...g.farmers.map(f => f.location.lng)]);
  const minLat = Math.min(...allLats), maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs), maxLng = Math.max(...allLngs);
  const latRange = maxLat - minLat || 0.1;
  const lngRange = maxLng - minLng || 0.1;

  const toX = (lng) => PAD + ((lng - minLng) / lngRange) * (W - 2 * PAD);
  const toY = (lat) => H - PAD - ((lat - minLat) / latRange) * (H - 2 * PAD);

  const maxFarmers = Math.max(...groups.map(g => g.farmer_count));

  const getDensityColor = (count) => {
    const ratio = count / maxFarmers;
    if (ratio > 0.7) return 'rgba(249, 115, 22, 0.6)';
    if (ratio > 0.4) return 'rgba(249, 115, 22, 0.35)';
    return 'rgba(249, 115, 22, 0.15)';
  };

  const getDensityRadius = (count) => {
    const ratio = count / maxFarmers;
    return 20 + ratio * 30;
  };

  return (
    <div className="card-industrial p-4 space-y-3">
      {!heatmapMode && (
        <div className="flex items-center justify-between">
          <h3 className="header-label text-mint-green flex items-center gap-2">
            <MapPin size={13} />
            {language === 'en' ? 'Setu Point Operations Map' : 'सेतु पॉइंट ऑपरेशन मैप'}
          </h3>
          <div className="flex items-center gap-3 text-[9px] text-text-muted uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-mint-green inline-block" style={{ borderRadius: '1px' }} /> {language === 'en' ? 'Setu Point' : 'सेतु पॉइंट'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-invention-orange inline-block" style={{ borderRadius: '1px' }} /> {language === 'en' ? 'Farmer' : 'किसान'}
            </span>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border overflow-hidden" style={{ borderRadius: '2px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minHeight: 260 }}>
          {/* Grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line x1={PAD + i * ((W - 2 * PAD) / 7)} y1={PAD} x2={PAD + i * ((W - 2 * PAD) / 7)} y2={H - PAD}
                stroke="rgba(51,65,85,0.3)" strokeWidth="1" />
              <line x1={PAD} y1={PAD + i * ((H - 2 * PAD) / 7)} x2={W - PAD} y2={PAD + i * ((H - 2 * PAD) / 7)}
                stroke="rgba(51,65,85,0.3)" strokeWidth="1" />
            </React.Fragment>
          ))}

          {/* Heatmap density circles (behind everything) */}
          {heatmapMode && groups.map((group, gi) => {
            const x = toX(group.setu_point.location.lng);
            const y = toY(group.setu_point.location.lat);
            const r = getDensityRadius(group.farmer_count);
            return (
              <circle key={`heat-${gi}`} cx={x} cy={y} r={r}
                fill={getDensityColor(group.farmer_count)} />
            );
          })}

          {/* Connection lines */}
          {groups.map((group, gi) => {
            const spX = toX(group.setu_point.location.lng);
            const spY = toY(group.setu_point.location.lat);
            return group.farmers.map((farmer, fi) => {
              const fX = toX(farmer.location.lng);
              const fY = toY(farmer.location.lat);
              return (
                <line key={`line-${gi}-${fi}`}
                  x1={fX} y1={fY} x2={spX} y2={spY}
                  stroke={heatmapMode ? 'rgba(249,115,22,0.2)' : 'rgba(16,185,129,0.25)'}
                  strokeWidth="1" strokeDasharray="4 4" />
              );
            });
          })}

          {/* Farmer dots */}
          {groups.map((group, gi) =>
            group.farmers.map((farmer, fi) => (
              <g key={`farmer-${gi}-${fi}`}>
                <rect
                  x={toX(farmer.location.lng) - 3}
                  y={toY(farmer.location.lat) - 3}
                  width="6" height="6"
                  fill={heatmapMode ? '#F97316' : '#10B981'}
                  opacity="0.7"
                />
                <text x={toX(farmer.location.lng)} y={toY(farmer.location.lat) - 8}
                  fill="rgba(241,245,249,0.4)" fontSize="7" textAnchor="middle" fontFamily="Inter">
                  {farmer.name.split(' ')[0]}
                </text>
              </g>
            ))
          )}

          {/* Setu Point nodes */}
          {groups.map((group, gi) => {
            const x = toX(group.setu_point.location.lng);
            const y = toY(group.setu_point.location.lat);
            return (
              <g key={`sp-${gi}`}>
                <rect x={x - 8} y={y - 8} width="16" height="16"
                  fill={heatmapMode ? '#F97316' : '#10B981'} opacity="0.9" />
                <text x={x} y={y + 24} fill="rgba(241,245,249,0.7)" fontSize="8"
                  textAnchor="middle" fontWeight="bold" fontFamily="Outfit">
                  {group.setu_point.name.split(' ').slice(0, 2).join(' ')}
                </text>
                <text x={x} y={y + 34} fill="rgba(241,245,249,0.35)" fontSize="7"
                  textAnchor="middle" fontFamily="Inter">
                  {group.farmer_count} farmers · {group.total_weight_kg}kg
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
