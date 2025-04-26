import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
        },
      }}
    >
      <Popup>Donation Location</Popup>
    </Marker>
  );
}

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export function DonorDashboard({ profile }: { profile: any }) {
  const createDonation = useMutation(api.donations.create);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    expirationTime: "",
    notes: "",
    address: profile.address || "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setPosition([37.7749, -122.4194]);
      }
    );
  }, []);

  const handleSearch = async () => {
    if (!formData.address) {
      toast.error("Please enter an address");
      return;
    }
    setIsSearching(true);
    const coords = await geocodeAddress(formData.address);
    setIsSearching(false);
    
    if (coords) {
      setPosition(coords);
      toast.success("Location found!");
    } else {
      toast.error("Could not find location. Please try a different address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      toast.error("Please select a location on the map");
      return;
    }

    try {
      await createDonation({
        ...formData,
        latitude: position[0],
        longitude: position[1],
        expirationTime: formData.expirationTime
          ? new Date(formData.expirationTime).getTime()
          : undefined,
      });
      toast.success("Donation posted successfully!");
      setFormData({
        foodType: "",
        quantity: "",
        expirationTime: "",
        notes: "",
        address: profile.address || "",
      });
    } catch (error) {
      toast.error("Failed to create donation");
    }
  };

  if (!position) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-green-600 mb-6">Share Your Donation</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Donation Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                  <input
                    type="text"
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g., Fresh Vegetables, Canned Goods"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g., 5 kg, 10 boxes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Time (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expirationTime}
                    onChange={(e) => setFormData({ ...formData, expirationTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Any special instructions or additional information"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter address"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Searching
                        </span>
                      ) : (
                        "Find Location"
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    You can also click on the map to set the location or drag the marker to adjust
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
                >
                  Create Donation
                </button>
              </form>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <MapContainer
                center={position}
                zoom={13}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Tip:</span> For accurate location placement, you can:
                <ul className="list-disc ml-5 mt-2">
                  <li>Enter an address and click "Find Location"</li>
                  <li>Click anywhere on the map to place the marker</li>
                  <li>Drag the marker to fine-tune the location</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
