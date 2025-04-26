import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function RoleSelection() {
  const createProfile = useMutation(api.users.createProfile);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"donor" | "receiver" | null>(null);

  const handleSubmit = async () => {
    if (!name || !selectedRole) {
      toast.error("Please provide your name and select a role");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProfile({ 
        role: selectedRole, 
        name,
        address
      });
      toast.success("Profile created!");
    } catch (error) {
      toast.error("Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg max-w-md w-full relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Welcome to Vital Link
        </h2>
        <p className="text-gray-600 text-center mb-8">Complete your profile to get started</p>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Your Address (Optional)
            </label>
            <input
              id="address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us connect you with nearby donations/receivers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Your Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("donor")}
                className={`p-4 border rounded-lg transition-all ${
                  selectedRole === "donor"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className={`w-8 h-8 ${selectedRole === "donor" ? "text-green-600" : "text-gray-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Donor</h3>
                <p className="text-sm text-gray-600">Share surplus food with those in need</p>
              </button>

              <button
                onClick={() => setSelectedRole("receiver")}
                className={`p-4 border rounded-lg transition-all ${
                  selectedRole === "receiver"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className={`w-8 h-8 ${selectedRole === "receiver" ? "text-green-600" : "text-gray-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Receiver</h3>
                <p className="text-sm text-gray-600">Connect with donors to receive food</p>
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name || !selectedRole || isSubmitting}
            className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Profile...
              </span>
            ) : (
              "Get Started"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
