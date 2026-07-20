import { useEffect, useState } from "react";
import "./OwnerProfile.css";

export default function OwnerProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ bio: "", phone: "", city: "", state: "" });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setForm({
        bio: data.bio || "",
        phone: data.phone || "",
        city: data.city || "",
        state: data.state || "",
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setUser(data);
    setSaving(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // show preview immediately
    setPreview(URL.createObjectURL(file));

    // upload to backend
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("http://localhost:3000/api/upload/profile-photo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setUser({ ...user, hasProfilePhoto: true });
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="owner-profile">
      <h2>Pet Owner Profile</h2>
      <div className="profile-header">
        <div className="profile-pic">
          <img
            src={
              preview
                ? preview
                : user.hasProfilePhoto
                  ? `http://localhost:3000/uploads/profiles/${user.id}.jpg`
                  : "/default-profile.png"
            }
            alt="Profile"
          />
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>

        <div className="profile-info">
          <label>Name:</label>
          <p>{user.name}</p>

          <label>Email:</label>
          <p>{user.email}</p>

          <label>City:</label>
          <input name="city" value={form.city} onChange={handleChange} />

          <label>State:</label>
          <input name="state" value={form.state} onChange={handleChange} />

          <label>Phone:</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <label>Bio:</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} />

          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
