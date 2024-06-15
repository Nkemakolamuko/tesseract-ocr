import React, { useState } from "react";
import { useAuth } from "../UserContext";
import { updatePassword } from "firebase/auth";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const Settings = () => {
  const { currentUser, userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error("Password cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(currentUser, newPassword);
      toast.success("Password updated successfully!");
      setShowModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating password: ", error);
      toast.error(
        "Error updating password.\nLogout and Login again then retry."
      );
      setLoading(false);
    }
  };

  return (
    <>
      {userData.churchName ? (
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg">
            {/* Profile Section */}
            <div className="flex flex-col items-center">
              <img
                src={
                  userData?.profilePicture ||
                  "https://images.pexels.com/photos/3025593/pexels-photo-3025593.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt="Profile"
                className="rounded-full h-24 w-24 mb-4 border-4"
              />
              <h2 className="text-xl font-semibold mb-2 text-[#0000f1]">
                {userData?.churchName || "User Name"}
              </h2>
              <p className="text-gray-600">
                {userData?.email || "user@example.com"}
              </p>
            </div>

            {/* Settings Sections */}
            <div className="mt-6 space-y-6">
              {/* Account Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Account Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Change Password</span>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowModal(true)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Two-Factor Authentication</span>
                    <button className="text-blue-500 hover:underline">
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Email Notifications</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>SMS Notifications</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Privacy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Profile Visibility</span>
                    <select className="border border-gray-300 rounded-md outline-none">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Search Visibility</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-red-500">Danger Zone</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Delete Account</span>
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for changing password */}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handlePasswordChange}
            loading={loading}
          >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-300 focus:border-2 transition-all duration-300"
              />
            </div>
          </Modal>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <FiLoader className="w-24 h-24 animate-spin" />
        </div>
      )}
    </>
  );
};

export default Settings;
