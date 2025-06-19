import { useState } from "react";

function DashboardProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    username: user?.username || "",
    password: user?.password || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://api.ocrapp.biz.id/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...currentUser,
        full_name: formData.full_name,
        email: formData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your account information and settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info-header">
            <div className="large-avatar">
              {formData.full_name?.charAt(0) ||
                formData.username?.charAt(0) ||
                "U"}
            </div>
            <div className="profile-details">
              <h3>{formData.full_name || formData.username}</h3>
              <p className="profile-role">Role: {user?.role || "User"}</p>
              {/* <p className="profile-id">ID: {user?.id}</p> */}
            </div>
            <button
              className="edit-profile-button"
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {error && (
            <div
              className="alert alert-error"
              style={{
                margin: "1rem 0",
                padding: "0.75rem",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "0.375rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="alert alert-success"
              style={{
                margin: "1rem 0",
                padding: "0.75rem",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                borderRadius: "0.375rem",
              }}
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="profile-form"
            style={{ marginTop: "1rem" }}
          >
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  readOnly
                  style={{ backgroundColor: "#f3f4f6" }}
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isEditing ? "Enter new password" : "••••••••"}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div
                className="form-actions"
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;
