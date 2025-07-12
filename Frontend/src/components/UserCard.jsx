import { Button } from "@/components/ui/button";

const UserCard = ({ user }) => {
  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
      {/* Left Section: Profile + Info */}
      <div className="flex items-center gap-6">
        {/* Profile Photo */}
        <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
          Profile Photo
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>

          {/* Skills Offered */}
          <p className="text-green-400 text-sm mt-2">Skills Offered =&gt;</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {user.skillsOffered.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full border border-white text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Skills Wanted */}
          <p className="text-blue-400 text-sm mt-3">Skill Wanted =&gt;</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {user.skillsWanted.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full border border-white text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Request Button & Rating */}
      <div className="flex flex-col items-end justify-between h-full">
        <Button className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-md">
          Request
        </Button>
        <p className="text-sm mt-4">rating &nbsp;&nbsp; {user.rating}/5</p>
      </div>
    </div>
  );
};

export default UserCard;
