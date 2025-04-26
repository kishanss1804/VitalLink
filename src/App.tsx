import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { RoleSelection } from "./RoleSelection";
import { DonorDashboard } from "./DonorDashboard";
import { ReceiverDashboard } from "./ReceiverDashboard";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold text-green-600">Vital Link</h2>
        <SignOutButton />
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const profile = useQuery(api.users.getProfile);
  const updateRole = useMutation(api.users.updateRole);

  // State for role toggle
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = async (newRole: "donor" | "receiver") => {
    if (!profile || profile === null) return;
    
    setIsLoading(true);
    try {
      await updateRole({ role: newRole });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Unauthenticated>
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gradient-to-b from-green-900/90 to-green-700/90">
            <div className="text-center max-w-4xl mx-auto py-16">
              <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
                Vital Link
              </h1>
              <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Bridging the gap between food surplus and scarcity.
                <span className="block mt-2">Join our mission to reduce waste and feed communities.</span>
              </p>
              <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                <SignInForm />
              </div>
            </div>
            <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-black/40"></div>
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c" 
                className="absolute top-0 left-0 w-full h-full object-cover" 
                alt="Food donation"
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Register</h3>
                  <p className="text-slate-600">Sign up as a donor or receiver to get started on your food-sharing journey</p>
                </div>
                <div className="text-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <p className="text-slate-600">Find nearby food donations or share your surplus with those in need</p>
                </div>
                <div className="text-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Share</h3>
                  <p className="text-slate-600">Make a meaningful difference in your community by reducing waste</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="py-20 px-4 bg-green-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">About Us</h2>
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-2xl font-bold text-green-700 mb-4">Our Mission</h3>
                  <p className="text-lg mb-6 text-gray-700">
                    At Vital Link, we're committed to creating a sustainable food ecosystem where surplus never goes to waste. 
                    Our platform connects food donors with those in need, making it seamless to share resources and build stronger communities.
                  </p>
                  <h3 className="text-2xl font-bold text-green-700 mb-4">Our Vision</h3>
                  <p className="text-lg text-gray-700">
                    We envision a world where no one goes hungry while food is thrown away. By bridging the gap between abundance and scarcity, 
                    we aim to transform how communities think about food resources and foster a culture of sharing and sustainability.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-700 mb-4">Our Goals</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-4 mt-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-1">Reduce Food Waste</h4>
                        <p className="text-gray-600">Minimize perfectly good food being thrown away by connecting donors with receivers</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 mt-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-1">Combat Food Insecurity</h4>
                        <p className="text-gray-600">Provide accessible pathways for nutritious food to reach those who need it most</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 mt-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-1">Build Community Connections</h4>
                        <p className="text-gray-600">Strengthen local bonds through the act of sharing and fostering relationships</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 mt-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-1">Environmental Impact</h4>
                        <p className="text-gray-600">Reduce the carbon footprint associated with food production and waste disposal</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-16">Join Our Impact</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-green-50 rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                  <p className="text-xl">Meals Shared</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
                  <p className="text-xl">Active Users</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">300+</div>
                  <p className="text-xl">Communities Served</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-green-800 text-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Vital Link</h3>
                  <p className="text-green-100 mb-4">This is a sustainable solution which was developed during CypherQuest 2k25</p>
                  <p className="text-green-100 mb-4">Team Moggers</p>
                  <p className="text-green-100 mb-4">Kishan SS</p>
                  <p className="text-green-100 mb-4">Chethana M</p>
                  <p className="text-green-100 mb-4">Bhadreesh S M</p>
                  <p className="text-green-100 mb-4">Charan SriHari P</p>
                  
                  
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-green-200 hover:text-white">Home</a></li>
                      <li><a href="#" className="text-green-200 hover:text-white">About</a></li>
                      <li><a href="#" className="text-green-200 hover:text-white">How It Works</a></li>
                      <li><a href="#" className="text-green-200 hover:text-white">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t border-green-700 text-center text-green-300">
                <p>&copy; {new Date().getFullYear()} Vital Link. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="max-w-7xl mx-auto p-6">
          {profile === null ? (
            <RoleSelection />
          ) : (
            <div>
              {/* Role Toggle */}
              <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-green-600">
                  {profile.role === "donor" ? "Donor Dashboard" : "Receiver Dashboard"}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Switch to:</span>
                  <button
                    onClick={() => handleRoleToggle(profile.role === "donor" ? "receiver" : "donor")}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 border border-green-500 rounded-md text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    )}
                    {profile.role === "donor" ? "Receiver Mode" : "Donor Mode"}
                  </button>
                </div>
              </div>
              {profile.role === "donor" ? (
                <DonorDashboard profile={profile} />
              ) : (
                <ReceiverDashboard profile={profile} />
              )}
            </div>
          )}
        </div>
      </Authenticated>
    </div>
  );
}