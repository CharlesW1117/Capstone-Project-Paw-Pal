import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getProfilePhotoUrl,
  updateCurrentUser,
  uploadProfilePhoto,
} from "../services/userService";
import { getPhotoFileError } from "../utils/photoValidation";
import "./OwnerProfile.css";

export default function OwnerProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ bio: "", phone: "", city: "", state: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const currentUser = await getCurrentUser();
        if (cancelled) return;

        setUser(currentUser);
        setForm({
          bio: currentUser.bio || "",
          phone: currentUser.phone || "",
          city: currentUser.city || "",
          state: currentUser.state || "",
        });
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Unable to load your profile.");
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");

    try {
      const updatedUser = await updateCurrentUser(form);
      setUser(updatedUser);
    } catch (error) {
      setSaveError(error.message || "Unable to save your changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validationError = getPhotoFileError(file);
    if (validationError) {
      setPhotoError(validationError);
      event.target.value = "";
      return;
    }

    setPhotoError("");
    setPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);

    try {
      const updatedUser = await uploadProfilePhoto(file);
      setUser(updatedUser);
    } catch (error) {
      setPhotoError(error.message || "Unable to upload your photo.");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  }

  if (loadError) {
    return (
      <div className="owner-profile">
        <p className="owner-profile__error" role="alert">
          {loadError}
        </p>
      </div>
    );
  }

  if (!user) return <p>Loading profile...</p>;

  const photoSrc = preview
    ? preview
    : user.hasProfilePhoto
      ? getProfilePhotoUrl(user.id)
      : "/default-profile.png";

  return (
    <div className="owner-profile">
      <h2>Pet Owner Profile</h2>
      <div className="profile-header">
        <div className="profile-pic">
          <img src={photoSrc} alt="Profile" />

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
          />

          {uploadingPhoto && (
            <p className="owner-profile__status">Uploading...</p>
          )}

          {photoError && (
            <p className="owner-profile__error" role="alert">
              {photoError}
            </p>
          )}
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

          {saveError && (
            <p className="owner-profile__error" role="alert">
              {saveError}
            </p>
          )}

          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
