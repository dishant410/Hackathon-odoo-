import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSwapRequest } from '../redux/swapSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, MapPin, Star, X } from 'lucide-react';
import { toast } from 'sonner';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.swap);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');

  const handleSwapRequest = async (e) => {
    e.preventDefault();

    if (!skillOffered.trim() || !skillWanted.trim()) {
      toast.error('Please fill in both skills');
      return;
    }

    try {
      await dispatch(createSwapRequest({
        toUserId: user._id,
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim()
      })).unwrap();

      toast.success('Swap request sent successfully!');
      setShowSwapModal(false);
      setSkillOffered('');
      setSkillWanted('');
    } catch (error) {
      toast.error(error || 'Failed to send swap request');
    }
  };

  const handleCloseModal = () => {
    setShowSwapModal(false);
    setSkillOffered('');
    setSkillWanted('');
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              {user.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Skills Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            )) || (
                <span className="text-gray-400 text-sm">No skills listed</span>
              )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Skills Wanted
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            )) || (
                <span className="text-gray-400 text-sm">No skills wanted</span>
              )}
          </div>
        </div>

        {/* Availability */}
        {user.availability && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Availability</h4>
            <p className="text-sm text-gray-600">{user.availability}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          {authUser && authUser._id !== user._id ? (
            <Button
              onClick={() => setShowSwapModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Swap
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {authUser ? 'Your Profile' : 'Sign in to Request'}
            </Button>
          )}
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Request Swap with {user.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSwapRequest}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="skillOffered">Skill you're offering</Label>
                  <Input
                    id="skillOffered"
                    value={skillOffered}
                    onChange={(e) => setSkillOffered(e.target.value)}
                    placeholder="e.g., JavaScript, Photoshop"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="skillWanted">Skill you want in return</Label>
                  <Input
                    id="skillWanted"
                    value={skillWanted}
                    onChange={(e) => setSkillWanted(e.target.value)}
                    placeholder="e.g., Python, Excel"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
