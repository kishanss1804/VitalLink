import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../convex/_generated/dataModel";
import "leaflet/dist/leaflet.css";

interface Donation {
  _id: Id<"donations">;
  _creationTime: number;
  foodType: string;
  quantity: string;
  status: string;
  address: string;
  notes?: string;
  expirationTime?: number;
  latitude: number;
  longitude: number;
}

export function ReceiverDashboard({ profile }: { profile: any }) {
  const donations = useQuery(api.donations.listActive) || [];
  const claimDonation = useMutation(api.donations.claim);

  const handleClaim = async (donationId: Id<"donations">) => {
    try {
      await claimDonation({ donationId });
      toast.success("Donation claimed successfully!");
    } catch (error) {
      toast.error("Failed to claim donation");
    }
  };

  if (!donations.length) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Active Donations</h3>
        <p className="text-gray-600">Check back later for available donations in your area.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Available Donations</h2>
            <div className="space-y-4">
              {donations.map((donation: Donation) => (
                <div
                  key={donation._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{donation.foodType}</h3>
                      <p className="text-gray-600">Quantity: {donation.quantity}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {donation.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {donation.address}
                    </p>
                    {donation.expirationTime && (
                      <p className="text-gray-600">
                        <span className="font-medium">Expires:</span>{" "}
                        {formatDistanceToNow(donation.expirationTime, { addSuffix: true })}
                      </p>
                    )}
                    {donation.notes && (
                      <p className="text-gray-600">
                        <span className="font-medium">Notes:</span> {donation.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Posted {formatDistanceToNow(donation._creationTime, { addSuffix: true })}
                    </p>
                    <button
                      onClick={() => handleClaim(donation._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      disabled={donation.status !== "available"}
                    >
                      {donation.status === "available" ? "Claim Donation" : "Claimed"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-[600px]">
              <MapContainer
                center={[donations[0].latitude, donations[0].longitude]}
                zoom={11}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {donations.map((donation: Donation) => (
                  <Marker
                    key={donation._id}
                    position={[donation.latitude, donation.longitude]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{donation.foodType}</h3>
                        <p className="text-sm">Quantity: {donation.quantity}</p>
                        <p className="text-sm">Status: {donation.status}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Map Guide:</span>
              <ul className="list-disc ml-5 mt-2">
                <li>Click on markers to see donation details</li>
                <li>Use +/- buttons to zoom in/out</li>
                <li>Drag the map to explore different areas</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
