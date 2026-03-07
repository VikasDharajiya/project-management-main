import { useState, useEffect } from "react";

const Profile = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    designation: ""
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        name: storedUser.name || "User",
        email: storedUser.email || "",
        role: storedUser.role || "Member",
        designation: storedUser.designation || "Developer"
      });
    }
  }, []);

  const handleUpdateProfile = () => {

    localStorage.setItem("user", JSON.stringify(user));

    alert("Profile Updated Successfully");
  };

  const handleChangePassword = () => {
    alert("Password change feature coming soon");
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-zinc-900 p-6 rounded shadow">

      <h1 className="text-xl font-semibold mb-4">Profile</h1>

      <div className="space-y-4">

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e)=>setUser({...user, name:e.target.value})}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="border w-full p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="border w-full p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Designation</label>
          <input
            type="text"
            value={user.designation}
            onChange={(e)=>setUser({...user, designation:e.target.value})}
            className="border w-full p-2 rounded"
          />
        </div>

        <div className="flex gap-3 mt-4">

          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>

          <button
            onClick={handleChangePassword}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;