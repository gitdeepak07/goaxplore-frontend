import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";


const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? "";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  height?: string;   // e.g. "300px"
}

export function LocationMap({
  latitude,
  longitude,
  locationName,
  height = "300px",
}: LocationMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-2xl bg-[#0d1726] border border-white/10 text-slate-400 text-sm"
      >
        Loading map...
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };

  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "100%", height, borderRadius: "16px" }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [                          // dark theme to match your UI
          { elementType: "geometry",       stylers: [{ color: "#0d1726" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#07111f" }] },
          { elementType: "labels.text.fill",   stylers: [{ color: "#94a3b8" }] },
          { featureType: "water",          elementType: "geometry", stylers: [{ color: "#0f2035" }] },
          { featureType: "road",           elementType: "geometry", stylers: [{ color: "#1e3a5f" }] },
          { featureType: "poi",            stylers: [{ visibility: "off" }] },
        ],
      }}
    >
      {/* <Marker */}
        {/* // position={center} */}
        {/* // title={locationName} */}
    {/* //   /> */}
    </GoogleMap>
  );
}