/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProfilePage = () => {
  const { authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    location: authUser?.location || "",
    skillsOffered: authUser?.skillsOffered || [],
    skillsWanted: authUser?.skillsWanted || [],
    availability: authUser?.availability || {
      weekends: false,
      evenings: false,
      custom: "",
    },
    isPublic: authUser?.isPublic ?? true,
    profilePhoto: authUser?.profilePhoto || "https://avatar.iran.liara.run/public/boy",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleAvailabilityToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [key]: !prev.availability[key],
      },
    }));
  };

  const handlePublicToggle = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8080/api/v1/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Navbar */}
      <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-8">
        <div className="flex gap-4 text-lg">
          <button onClick={handleSave} className="text-green-400 hover:underline">Save</button>
        </div>
        <div className="flex gap-8 text-lg">
          <a href="/swap-requests" className="hover:underline">Swap request</a>
          <a href="/" className="hover:underline">Home</a>
          <img src={formData.profilePhoto || "/avatar.png"} alt="profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Details */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} className="bg-black border-white text-white" />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <Input name="location" value={formData.location} onChange={handleChange} className="bg-black border-white text-white" />
          </div>

          <div>
            <label className="block font-medium">Skills Offered</label>
            <Input
              name="skillsOffered"
              value={formData.skillsOffered.join(", ")}
              onChange={(e) => handleArrayChange(e, "skillsOffered")}
              className="bg-black border-white text-white"
            />
          </div>

          <div>
            <label className="block font-medium">Availability</label>
            <div className="flex gap-4 mt-1">
              <Switch checked={formData.availability.weekends} onCheckedChange={() => handleAvailabilityToggle("weekends")} />
              <span>Weekends</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Switch checked={formData.isPublic} onCheckedChange={handlePublicToggle} />
            <span>Profile: {formData.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>

        {/* Right: Skills + Avatar */}
        <div className="space-y-6 flex flex-col items-center">
          <span className="text-sm bg-green-800 px-3 py-1 rounded-full">Assured Scorpion</span>
          <div className="w-32 h-32 rounded-full overflow-hidden border border-white">
            <img
              src={formData.profilePhoto || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3 text-sm">
            <button className="text-blue-400 hover:underline">Add/Edit</button>
            <button className="text-red-400 hover:underline">Remove</button>
          </div>

          <div className="w-full">
            <label className="block font-medium">Skills Wanted</label>
            <Input
              name="skillsWanted"
              value={formData.skillsWanted.join(", ")}
              onChange={(e) => handleArrayChange(e, "skillsWanted")}
              className="bg-black border-white text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
