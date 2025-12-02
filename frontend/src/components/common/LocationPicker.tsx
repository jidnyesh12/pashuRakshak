import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, Loader } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Component to handle map clicks and marker dragging
const LocationMarker: React.FC<{ 
  position: [number, number] | null, 
  setPosition: (pos: [number, number]) => void 
}> = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          setPosition([newPos.lat, newPos.lng]);
        },
      }}
    />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialLat, 
  initialLng 
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  // Reverse geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
        );
        const data = await response.json();
        const newAddress = data.display_name || 'Unknown Location';
        setAddress(newAddress);
        onLocationSelect(position[0], position[1], newAddress);
      } catch (err) {
        console.error('Failed to fetch address:', err);
        setAddress('Location selected (Address unavailable)');
        onLocationSelect(position[0], position[1], 'Location selected (Address unavailable)');
      }
    };

    fetchAddress();
  }, [position, onLocationSelect]);

  const handleAutoDetect = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setIsLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = 'Unable to retrieve your location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={isLoading}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 mr-1" />
          )}
          Auto Detect
        </button>
      </div>

      <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
        <MapContainer 
          center={position || defaultCenter} 
          zoom={position ? 15 : 5} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {address && (
        <div className="flex items-start p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <MapPin className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
          <p>{address}</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default LocationPicker;
