import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserSwapRequests } from "../redux/swapSlice";
import { Link } from "react-router-dom";
import { Star, Users, MessageSquare, Settings, Search } from "lucide-react";

const UserDashboard = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { sentRequests, receivedRequests } = useSelector((state) => state.swap);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserSwapRequests());
    }
  }, [authUser, dispatch]);

  if (!authUser) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard.</h2>
        <Link to="/login" className="text-blue-600 underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Profile Overview */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <img
          src={authUser.profilePhoto || "https://avatar.iran.liara.run/public/boy"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-200 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{authUser.name}</h1>
          <p className="text-gray-600">{authUser.location || "Location not set"}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {authUser.isPublic ? "Public Profile" : "Private Profile"}
            </span>
            <Link to="/profile" className="ml-4 text-blue-600 underline flex items-center gap-1">
              <Settings className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Skills Offered</h2>
          <div className="flex flex-wrap gap-2">
            {authUser.skillsOffered && authUser.skillsOffered.length > 0 ? (
              authUser.skillsOffered.map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No skills listed</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Skills Wanted</h2>
          <div className="flex flex-wrap gap-2">
            {authUser.skillsWanted && authUser.skillsWanted.length > 0 ? (
              authUser.skillsWanted.map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No skills wanted</span>
            )}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Availability</h2>
          <p className="text-gray-700">{authUser.availability || "Not specified"}</p>
        </div>
      </div>

      {/* Swap Requests Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Received Swap Requests</h2>
          </div>
          <p className="text-gray-600 mb-2">
            Pending: <span className="font-bold">{receivedRequests.filter(r => r.status === "pending").length}</span>
          </p>
          <Link to="/profile" className="text-blue-600 underline">Manage Requests</Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">Sent Swap Requests</h2>
          </div>
          <p className="text-gray-600 mb-2">
            Pending: <span className="font-bold">{sentRequests.filter(r => r.status === "pending").length}</span>
          </p>
          <Link to="/profile" className="text-blue-600 underline">View Sent Requests</Link>
        </div>
      </div>

      {/* Feedback & Ratings */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Feedback & Ratings</h2>
        </div>
        <p className="text-gray-600 mb-2">
          View your feedback and ratings after completed swaps.
        </p>
        <Link to="/profile" className="text-blue-600 underline">See Feedback</Link>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          <Search className="w-4 h-4" /> Browse Users
        </Link>
        <Link to="/profile" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
          <Users className="w-4 h-4" /> My Profile & Swaps
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
