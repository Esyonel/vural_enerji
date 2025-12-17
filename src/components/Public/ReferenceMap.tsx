import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Project } from '../../types';
import L from 'leaflet';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ReferenceMapProps {
    projects: Project[];
}

export const ReferenceMap: React.FC<ReferenceMapProps> = ({ projects }) => {
    // Filter projects that have coordinates
    const mapProjects = projects.filter(p => p.coordinates && p.coordinates.lat && p.coordinates.lng);

    // Default center (Turkey)
    const center: [number, number] = [39.0, 35.0];
    const zoom = 6;

    if (mapProjects.length === 0) {
        return null; // Don't render map if no location data
    }

    return (
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 z-0 relative">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapProjects.map((project) => (
                    <Marker
                        key={project.id}
                        position={[project.coordinates!.lat, project.coordinates!.lng]}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-slate-900 mb-2">{project.title}</h3>
                                {project.imageUrl && (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Güç:</span> {project.stats.power}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Konum:</span> {project.location}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
