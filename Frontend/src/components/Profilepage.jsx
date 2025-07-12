/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/userSlice";
import { fetchUserSwapRequests, acceptSwapRequest, rejectSwapRequest, cancelSwapRequest } from "../redux/swapSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  MapPin,
  BookOpen,
  Clock,
  Eye,
  EyeOff,
  Check,
  X,
  MessageSquare,
  ArrowLeft,
  Settings
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { sentRequests, receivedRequests, loading } = useSelector((state) => state.swap);

  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    location: authUser?.location || "",
    skillsOffered: authUser?.skillsOffered || [],
    skillsWanted: authUser?.skillsWanted || [],
    availability: authUser?.availability || "",
    isPublic: authUser?.isPublic ?? true,
    profilePhoto: authUser?.profilePhoto || "https://avatar.iran.liara.run/public/boy",
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserSwapRequests());
    }
  }, [dispatch, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const items = e.target.value.split(",").map((item) => item.trim()).filter(item => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handlePublicToggle = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleSwapAction = async (action, requestId) => {
    try {
      if (action === 'accept') {
        await dispatch(acceptSwapRequest(requestId)).unwrap();
        toast.success("Swap request accepted!");
      } else if (action === 'reject') {
        await dispatch(rejectSwapRequest(requestId)).unwrap();
        toast.success("Swap request rejected!");
      } else if (action === 'cancel') {
        await dispatch(cancelSwapRequest(requestId)).unwrap();
        toast.success("Swap request cancelled!");
      }
    } catch (error) {
      toast.error(error || "Failed to process request");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h2>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <a href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </a>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Swap Requests ({receivedRequests.filter(r => r.status === 'pending').length})
          </button>
        </div>

        {activeTab === 'profile' ? (
          /* Profile Tab */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Location (Optional)
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availability" className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      Availability
                    </Label>
                    <Input
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      placeholder="e.g., Weekends, Evenings, Flexible"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skillsOffered" className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      Skills You Offer
                    </Label>
                    <Input
                      id="skillsOffered"
                      name="skillsOffered"
                      value={formData.skillsOffered.join(", ")}
                      onChange={(e) => handleArrayChange(e, "skillsOffered")}
                      placeholder="JavaScript, Photoshop, Excel (comma-separated)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skillsWanted" className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      Skills You Want
                    </Label>
                    <Input
                      id="skillsWanted"
                      name="skillsWanted"
                      value={formData.skillsWanted.join(", ")}
                      onChange={(e) => handleArrayChange(e, "skillsWanted")}
                      placeholder="Python, Machine Learning, Design (comma-separated)"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto mb-4">
                      <img
                        src={formData.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Profile photo will be updated automatically</p>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {formData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="font-medium">Profile Visibility</span>
                      </div>
                      <Switch checked={formData.isPublic} onCheckedChange={handlePublicToggle} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.isPublic
                        ? "Your profile is visible to all users"
                        : "Your profile is private and hidden from search"
                      }
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Swap Requests Tab */
          <div className="space-y-6">
            {/* Received Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Received Requests ({receivedRequests.filter(r => r.status === 'pending').length} pending)
              </h3>

              {receivedRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No swap requests received yet</p>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {request.fromUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-medium">{request.fromUser?.name}</h4>
                            <p className="text-sm text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-green-700">Offering</p>
                          <p className="text-sm">{request.skillOffered}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700">Wanting</p>
                          <p className="text-sm">{request.skillWanted}</p>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSwapAction('accept', request._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSwapAction('reject', request._id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sent Requests ({sentRequests.length})</h3>

              {sentRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No swap requests sent yet</p>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {request.toUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-medium">{request.toUser?.name}</h4>
                            <p className="text-sm text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-green-700">Offering</p>
                          <p className="text-sm">{request.skillOffered}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700">Wanting</p>
                          <p className="text-sm">{request.skillWanted}</p>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSwapAction('cancel', request._id)}
                        >
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
