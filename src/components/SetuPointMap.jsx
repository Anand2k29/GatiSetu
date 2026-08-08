import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Layers, Info, CheckCircle2 } from 'lucide-react';

// Custom Map Auto-Fitter to zoom & center bounds
function MapAutoFit({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [bounds, map]);
  return null;
}

export default function SetuPointMap({ groups, heatmapMode = false }) {
  const { language } = useApp();
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'terrain'

  if (!groups || groups.length === 0) return null;

  // Extract all locations for map bounds
  const allPoints = groups.flatMap(g => [
    [g.setu_point.location.lat, g.setu_point.location.lng],
    ...g.farmers.map(f => [f.location.lat, f.location.lng])
  ]);

  const bounds = L.latLngBounds(allPoints);
  const center = bounds.getCenter();

  // Google Maps Tile URLs
  const tileUrls = {
    roadmap: {
      url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    },
    satellite: {
      url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps Satellite'
    },
    terrain: {
      url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps Terrain'
    }
  };

  // Create Custom HTML Markers using Leaflet divIcon
  const createSetuIcon = (name, farmerCount, weightKg) => {
    return L.divIcon({
      className: 'custom-setu-marker',
      html: `
        <div style="
          background-color: #0F172A;
          border: 2px solid #10B981;
          border-radius: 4px;
          padding: 4px 8px;
          color: white;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
          transform: translate(-50%, -100%);
        ">
          <div style="
            width: 10px;
            height: 10px;
            background-color: #10B981;
            border-radius: 2px;
          "></div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px;">${name}</div>
            <div style="font-size: 9px; color: #94A3B8; font-weight: 600;">${farmerCount} Kisans · ${weightKg}kg</div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  const createFarmerIcon = (name, crop, weight) => {
    return L.divIcon({
      className: 'custom-farmer-marker',
      html: `
        <div style="
          background-color: #0F172A;
          border: 1.5px solid #F59E0B;
          border-radius: 3px;
          padding: 2px 6px;
          color: white;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 4px;
          transform: translate(-50%, -50%);
        ">
          <div style="
            width: 6px;
            height: 6px;
            background-color: #F59E0B;
            border-radius: 50%;
          "></div>
          <div>
            <div style="font-size: 9.5px; font-weight: 700; color: #F8FAFC;">${name}</div>
            <div style="font-size: 8px; color: #F59E0B;">${crop} (${weight}kg)</div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  return (
    <div className="card-industrial p-5 space-y-4 border border-border bg-surface-elevated/95 shadow-2xl">
      {/* ─── Header & Map Layer Controls ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-xs ${heatmapMode ? 'bg-invention-orange/20 text-invention-orange' : 'bg-mint-green/20 text-mint-green'}`}>
            <Navigation size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-text-primary uppercase tracking-wider font-[Outfit] flex items-center gap-2">
              Google Maps Interactive Logistics Interface
              <span className="px-2 py-0.5 text-[9px] bg-invention-orange/20 text-invention-orange border border-invention-orange/30 rounded-xs">
                Live Tiles
              </span>
            </h3>
            <p className="text-[10px] text-text-muted">
              {language === 'en' ? 'Interactive Google Maps with Setu Points, Farmer loads, and pooling routes' : 'गूगल मैप्स पर वर्चुअल सेतु पॉइंट्स और रूट ट्रैकिंग'}
            </p>
          </div>
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center gap-1 bg-surface p-1 border border-border rounded-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all ${
              mapType === 'roadmap' ? 'bg-invention-orange text-surface' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Google Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all ${
              mapType === 'satellite' ? 'bg-invention-orange text-surface' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all ${
              mapType === 'terrain' ? 'bg-invention-orange text-surface' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* ─── Leaflet Container with Google Maps Tiles ─── */}
      <div className="relative border border-border/80 rounded-xs overflow-hidden shadow-inner h-[440px] z-10">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', backgroundColor: '#0F172A' }}
        >
          <MapAutoFit bounds={allPoints} />

          {/* Google Maps Layer */}
          <TileLayer
            url={tileUrls[mapType].url}
            subdomains={tileUrls[mapType].subdomains}
            attribution={tileUrls[mapType].attribution}
            maxZoom={20}
          />

          {/* Virtual Setu Point Radius Circles & Markers */}
          {groups.map((group, gi) => {
            const spLat = group.setu_point.location.lat;
            const spLng = group.setu_point.location.lng;

            return (
              <React.Fragment key={`sp-group-${gi}`}>
                {/* 10km Pooling Radius Overlay */}
                <Circle
                  center={[spLat, spLng]}
                  radius={2500} // 2.5km visual radius around Setu Point
                  pathOptions={{
                    color: '#10B981',
                    fillColor: '#10B981',
                    fillOpacity: 0.15,
                    weight: 1.5,
                    dashArray: '4 4'
                  }}
                />

                {/* Setu Point Marker */}
                <Marker
                  position={[spLat, spLng]}
                  icon={createSetuIcon(group.setu_point.name, group.farmer_count, group.total_weight_kg)}
                >
                  <Popup>
                    <div className="p-1 font-[Outfit] space-y-1">
                      <div className="text-xs font-black text-emerald-600 uppercase">{group.setu_point.name}</div>
                      <div className="text-[11px] text-slate-700">Landmark: <strong>{group.setu_point.landmark_type}</strong></div>
                      <div className="text-[11px] text-slate-700">Total Weight: <strong>{group.total_weight_kg} kg</strong></div>
                      <div className="text-[11px] text-slate-700">Kisans Pooled: <strong>{group.farmer_count}</strong></div>
                      <div className="text-[10px] text-emerald-700 font-bold pt-1 border-t">
                        ✓ Save {group.total_distance_km - group.optimized_distance_km} km freight travel
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Farmer Markers & Polylines */}
                {group.farmers.map((farmer, fi) => {
                  const fLat = farmer.location.lat;
                  const fLng = farmer.location.lng;

                  return (
                    <React.Fragment key={`farmer-${gi}-${fi}`}>
                      {/* Connection Line from Farmer to Setu Point */}
                      <Polyline
                        positions={[
                          [fLat, fLng],
                          [spLat, spLng]
                        ]}
                        pathOptions={{
                          color: '#F59E0B',
                          weight: 2,
                          dashArray: '5 5',
                          opacity: 0.8
                        }}
                      />

                      {/* Farmer Marker */}
                      <Marker
                        position={[fLat, fLng]}
                        icon={createFarmerIcon(farmer.name, farmer.crop, farmer.weight_kg)}
                      >
                        <Popup>
                          <div className="p-1 font-[Outfit] space-y-1">
                            <div className="text-xs font-bold text-amber-600 font-[Outfit]">{farmer.name}</div>
                            <div className="text-[11px] text-slate-700">Village: <strong>{farmer.village}</strong></div>
                            <div className="text-[11px] text-slate-700">Crop: <strong>{farmer.crop} ({farmer.weight_kg} kg)</strong></div>
                            <div className="text-[11px] text-slate-700">Destination: <strong>{farmer.destination_mandi}</strong></div>
                            <div className="text-[10px] text-amber-700 font-semibold pt-1 border-t">
                              Routed via {group.setu_point.name}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* ─── Bottom Summary Toolbar ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xs border border-border bg-surface hover:border-mint-green/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-text-primary font-[Outfit] truncate">
                {group.setu_point.name}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-mint-green/20 text-mint-green rounded-xs">
                {group.farmer_count} Kisans
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary">
              <span>Total Cargo: <strong className="text-text-primary">{group.total_weight_kg} kg</strong></span>
              <span className="text-invention-orange font-semibold">Save {group.optimized_distance_km} km</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
