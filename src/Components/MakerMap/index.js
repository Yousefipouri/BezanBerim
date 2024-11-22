  import React, { useEffect, useState , useRef} from 'react';

  const MapComponent = ({ initialLat, initialLng, onLocationChange }) => { 
    const mapRef = useRef(null); // Use a ref to store the map instance
  
    const [lat, setLat] = useState(initialLat); 
    const [lng, setLng] = useState(initialLng); 
  
    useEffect(() => { 
      const loadScript = () => { 
        const script = document.createElement('script'); 
        script.src = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js'; 
        script.async = true; 
        script.onload = () => { 
          initializeMap(); 
          console.log('Script loaded successfully'); 
        }; 
        script.onerror = () => { 
          console.error('Failed to load the script'); 
        }; 
        document.body.appendChild(script); 
  
        const link = document.createElement('link'); 
        link.rel = 'stylesheet'; 
        link.href = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css'; 
        link.onload = () => console.log('Stylesheet loaded successfully'); 
        link.onerror = () => console.error('Failed to load the stylesheet'); 
        document.head.appendChild(link); 
      }; 
  
      if (!window.L) { 
        loadScript(); 
      } else { 
        initializeMap(); 
      } 
  
      return () => { 
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null; // Reset ref
        }
        
      }; 
    }, []); 
  
    useEffect(() => {
      if (mapRef.current) {
        // Update the map center and marker when initialLat or initialLng changes
        mapRef.current.setView([initialLat, initialLng]);
        setLat(initialLat);
        setLng(initialLng);
      }
    }, [initialLat, initialLng]); 
  
    const initializeMap = () => { 
      if (mapRef.current) return; // Prevent re-initializing the map 

      const mapInstance = new window.L.Map('map', { 
        key: 'web.38bb090b5a5241fb97fdba3d1920cccc', 
        maptype: 'dreamy', 
        poi: true, 
        traffic: false, 
        center: [lat, lng], 
        zoom: 14, 
      }); 
  
      const marker = new window.L.Marker([lat, lng]).addTo(mapInstance); 
      mapRef.current = mapInstance; // Store the map instance in ref
  
      onLocationChange(lat, lng); 
      
  
      mapInstance.on('moveend', () => { 
        const center = mapInstance.getCenter(); 
        setLat(center.lat); 
        setLng(center.lng); 
        marker.setLatLng([center.lat, center.lng]); 
        onLocationChange(center.lat, center.lng); 
      }); 
    }; 
  
    return ( 
      <div> 
        <div id="map" style={{ width: '80%', height: '400px', maxWidth: '600px', margin: '0 auto' }}></div> {/* Set map size */} 
      </div> 
    ); 
  }; 
  
  export default MapComponent;
