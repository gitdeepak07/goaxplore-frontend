import { X, Plus, Trash2, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const API = "${API}/api";
const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? "";

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: any) => void
  editingActivity?: any
  providerId?: number | string
}

// Default center — Goa
const GOA_CENTER = { lat: 15.2993, lng: 74.1240 };

function LocationMapPicker({
  centerCoords,
  value,
  onChange,
}: {
  centerCoords: { lat: number; lng: number } | null;
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(value);
  const center = centerCoords || GOA_CENTER;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(coords);
    onChange(coords);
  };

  if (!isLoaded) return (
    <div className="flex h-[260px] items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-sm">
      Loading map...
    </div>
  );

  return (
    <div>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "260px", borderRadius: "12px" }}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0d1726" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#07111f" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f2035" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3a5f" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        {markerPos && <Marker position={markerPos} />}
      </GoogleMap>
      {markerPos ? (
        <p className="text-xs text-green-400 mt-2">
          ✓ Pinned at {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-2">
          Click anywhere on the map to pin your exact meeting point
        </p>
      )}
    </div>
  );
}

export function AddActivityModal({
  isOpen,
  onClose,
  onSave,
  editingActivity,
  providerId
}: AddActivityModalProps) {

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    location_id: '',
    price: '',
    maxParticipants: '',
    duration: '',
    description: '',
    safetyGuidelines: [''],
    inclusions: [''],
    exclusions: [''],
    image: ''
  });

  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([
        { category_id: 1, name: 'Water Sports' },
        { category_id: 3, name: 'Aerial Adventures' },
        { category_id: 4, name: 'Underwater' },
        { category_id: 5, name: 'Paddling' },
        { category_id: 6, name: 'Group Fun' },
      ]));

    fetch(`${API}/locations`)
      .then(r => r.json())
      .then(data => setLocations(Array.isArray(data) ? data : []))
      .catch(() => setLocations([
        { location_id: 1, name: 'Baga Beach' },
        { location_id: 2, name: 'Calangute Beach' },
        { location_id: 3, name: 'Anjuna Beach' },
      ]));

    if (!editingActivity) {
      setFormData({
        name: '', category_id: '', location_id: '',
        price: '', maxParticipants: '', duration: '',
        description: '', safetyGuidelines: [''],
        inclusions: [''], exclusions: [''], image: ''
      });
      setCustomCoords(null);
      setShowMapPicker(false);
      setSubmitError('');
      setSubmitSuccess('');
    } else {
      setFormData({
        name: editingActivity.name || editingActivity.title || '',
        category_id: editingActivity.category_id || '',
        location_id: editingActivity.location_id || '',
        price: editingActivity.price || editingActivity.price_per_person || '',
        maxParticipants: editingActivity.maxParticipants || editingActivity.max_participants || '',
        duration: editingActivity.duration || editingActivity.duration_minutes || '',
        description: editingActivity.description || '',
        safetyGuidelines: editingActivity.safetyGuidelines || [''],
        inclusions: editingActivity.inclusions || [''],
        exclusions: editingActivity.exclusions || [''],
        image: editingActivity.image || editingActivity.image_url || ''
      });
    }
  }, [isOpen, editingActivity]);

  // When location dropdown changes, pre-center map on that location's coords
  const handleLocationChange = (location_id: string) => {
    setFormData({ ...formData, location_id });
    setCustomCoords(null);
    // Center map on the selected beach
    const selected = locations.find(l => String(l.location_id) === location_id);
    if (selected?.latitude && selected?.longitude) {
      setMapCenter({ lat: Number(selected.latitude), lng: Number(selected.longitude) });
      setShowMapPicker(true); // auto-open map when beach is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    // If custom coords were pinned on map, update the location in DB first
    // Otherwise just use the selected location_id
    if (!editingActivity && providerId) {
      try {
        // If provider pinned a custom location, update that location's coords


        const res = await fetch(`${API}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider_id: providerId,
            category_id: parseInt(formData.category_id) || 1,
            location_id: parseInt(formData.location_id) || 1,
            title: formData.name,
            description: formData.description,
            duration_minutes: parseInt(formData.duration) || 30,
            price_per_person: parseFloat(formData.price),
            max_participants: parseInt(formData.maxParticipants),
            image_url: formData.image || null,
            custom_latitude: customCoords?.lat || null,   // ← ADD
            custom_longitude: customCoords?.lng || null,   // ← ADD
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setSubmitError(data.message || data.sqlMessage || 'Failed to save. Check all fields.');
          setIsSubmitting(false);
          return;
        }

        setSubmitSuccess(`✓ Activity "${formData.name}" created successfully!`);
        onSave({ ...formData, id: data.activity_id, activity_id: data.activity_id });
        setTimeout(() => onClose(), 1200);

      } catch (err) {
        setSubmitError('Could not reach server. Check if backend is running.');
      }
    } else {
      onSave({
        ...formData,
        id: editingActivity?.id || Date.now().toString(),
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        status: 'active',
        createdAt: new Date().toISOString()
      });
      onClose();
    }

    setIsSubmitting(false);
  };

  const addField = (field: 'safetyGuidelines' | 'inclusions' | 'exclusions') =>
    setFormData({ ...formData, [field]: [...formData[field], ''] });

  const removeField = (field: 'safetyGuidelines' | 'inclusions' | 'exclusions', index: number) =>
    setFormData({ ...formData, [field]: formData[field].filter((_: any, i: number) => i !== index) });

  const updateField = (field: 'safetyGuidelines' | 'inclusions' | 'exclusions', index: number, value: string) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {editingActivity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        {submitSuccess && (
          <div className="mx-6 mt-4 bg-green-900/30 border border-green-600 text-green-400 px-4 py-3 rounded-lg">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="mx-6 mt-4 bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="text-white font-semibold mb-2 block">Activity Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="e.g., Jet Skiing"
                  required
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Category * {categories.length === 0 && <span className="text-gray-500 text-xs">(loading...)</span>}
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="1500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Maximum Participants *</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

            </div>
          </div>

          {/* Location Section with Map Picker */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Location</h3>

            <div className="mb-4">
              <label className="text-white font-semibold mb-2 block">
                Select Location * {locations.length === 0 && <span className="text-gray-500 text-xs">(loading...)</span>}
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc.location_id} value={loc.location_id}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Map Pin Toggle */}
            <button
              type="button"
              onClick={() => setShowMapPicker(!showMapPicker)}
              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
            >
              <MapPin size={16} />
              {showMapPicker ? 'Hide map' : 'Pin exact location on map (optional)'}
            </button>

            {showMapPicker && (
              <LocationMapPicker
                centerCoords={mapCenter}
                value={customCoords}
                onChange={(coords) => setCustomCoords(coords)}
              />
            )}
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Describe your activity..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Image URL *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://images.unsplash.com/photo-...?w=800&q=80"
              required
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-md"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-gray-500 text-xs mt-1">Paste any image URL — Unsplash works great</p>
          </div>

          {/* Safety Guidelines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-semibold">Safety Guidelines</label>
              <button type="button" onClick={() => addField('safetyGuidelines')} className="text-red-600 hover:text-red-500 flex items-center gap-1 text-sm">
                <Plus size={16} /> Add Guideline
              </button>
            </div>
            <div className="space-y-2">
              {formData.safetyGuidelines.map((g: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={g} onChange={(e) => updateField('safetyGuidelines', i, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Enter safety guideline" />
                  {formData.safetyGuidelines.length > 1 && (
                    <button type="button" onClick={() => removeField('safetyGuidelines', i)} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-semibold">Inclusions</label>
              <button type="button" onClick={() => addField('inclusions')} className="text-red-600 hover:text-red-500 flex items-center gap-1 text-sm">
                <Plus size={16} /> Add Inclusion
              </button>
            </div>
            <div className="space-y-2">
              {formData.inclusions.map((inc: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={inc} onChange={(e) => updateField('inclusions', i, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="What's included" />
                  {formData.inclusions.length > 1 && (
                    <button type="button" onClick={() => removeField('inclusions', i)} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-semibold">Exclusions</label>
              <button type="button" onClick={() => addField('exclusions')} className="text-red-600 hover:text-red-500 flex items-center gap-1 text-sm">
                <Plus size={16} /> Add Exclusion
              </button>
            </div>
            <div className="space-y-2">
              {formData.exclusions.map((exc: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={exc} onChange={(e) => updateField('exclusions', i, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="What's not included" />
                  {formData.exclusions.length > 1 && (
                    <button type="button" onClick={() => removeField('exclusions', i)} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-md transition-colors font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition-colors font-semibold disabled:opacity-60">
              {isSubmitting ? 'Saving to DB...' : editingActivity ? 'Update Activity' : 'Create Activity'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}