export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationData extends LocationCoords {
  address?: string;
  accuracy?: number;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser. Please use manual location entry.'));
      return;
    }

    // Check if we're on HTTPS or localhost (required for geolocation in modern browsers)
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isSecure) {
      reject(new Error('Geolocation requires HTTPS. Please use manual location entry or access via localhost.'));
      return;
    }

    let attempts = 0;
    const maxAttempts = 3;

    const tryGetLocation = (useHighAccuracy: boolean, timeout: number) => {
      attempts++;
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Validate coordinates
          if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            if (attempts < maxAttempts) {
              console.warn(`Invalid coordinates received, retrying... (attempt ${attempts})`);
              setTimeout(() => tryGetLocation(false, 20000), 1000);
              return;
            } else {
              reject(new Error('Invalid location data received. Please use manual location entry.'));
              return;
            }
          }
          
          try {
            // Try to get address using reverse geocoding
            const address = await reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              address,
              accuracy
            });
          } catch (error) {
            // If reverse geocoding fails, still return coordinates
            console.warn('Reverse geocoding failed:', error);
            resolve({
              latitude,
              longitude,
              accuracy,
              address: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error(`Geolocation error (attempt ${attempts}):`, error);
          
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'Location access denied. Please:\n• Allow location access in your browser\n• Check browser settings\n• Use manual location entry';
              reject(new Error(errorMessage));
              return;
              
            case 2: // POSITION_UNAVAILABLE
              if (attempts < maxAttempts) {
                console.warn(`Position unavailable, retrying with different settings... (attempt ${attempts})`);
                // Try with different settings
                setTimeout(() => {
                  if (attempts === 1) {
                    // Second attempt: disable high accuracy, increase timeout
                    tryGetLocation(false, 20000);
                  } else {
                    // Third attempt: very permissive settings
                    tryGetLocation(false, 30000);
                  }
                }, 2000);
                return;
              } else {
                errorMessage = 'Location services unavailable. This may be due to:\n• GPS/location services disabled on your device\n• Poor GPS signal\n• Network connectivity issues\n• Browser restrictions\n\nPlease use manual location entry.';
              }
              break;
              
            case 3: // TIMEOUT
              if (attempts < maxAttempts) {
                console.warn(`Location request timed out, retrying... (attempt ${attempts})`);
                setTimeout(() => tryGetLocation(false, timeout + 10000), 1000);
                return;
              } else {
                errorMessage = 'Location request timed out. Please:\n• Check your internet connection\n• Try again in a few moments\n• Use manual location entry';
              }
              break;
              
            default:
              errorMessage = 'Location detection failed. Please use manual location entry.';
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: useHighAccuracy,
          timeout: timeout,
          maximumAge: attempts === 1 ? 60000 : 300000 // Use cached location for retries
        }
      );
    };

    // Start with high accuracy
    tryGetLocation(true, 10000);
  });
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding (free)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`,
      {
        headers: {
          'User-Agent': 'PashuRakshak/1.0 (Animal Rescue App)',
          'Accept': 'application/json',
        },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Reverse geocoding API failed with status:', response.status);
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.warn('Reverse geocoding API error:', data.error);
      throw new Error(data.error);
    }
    
    if (data.display_name) {
      return data.display_name;
    }
    
    // Fallback to constructing address from components
    const address = data.address;
    if (address) {
      const parts = [
        address.house_number,
        address.road || address.pedestrian || address.path,
        address.neighbourhood || address.suburb || address.quarter,
        address.city || address.town || address.village || address.municipality,
        address.state || address.province,
        address.postcode,
        address.country
      ].filter(Boolean);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Final fallback to coordinates
    throw new Error('No address data available');
  } catch (error: any) {
    console.warn('Reverse geocoding error:', error.message);
    
    // Return coordinates as fallback
    return `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};