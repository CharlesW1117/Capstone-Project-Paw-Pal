import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getProfilePhotoUrl,
  updateCurrentUser,
  uploadProfilePhoto,
} from "../services/userService";
import { getPhotoFileError } from "../utils/photoValidation";
import "./OwnerProfile.css";

const emptyProfile = {
  bio: "",
  phone: "",
  city: "",
  state: "",
};

export default function OwnerProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyProfile);
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

        if (cancelled) {
          return;
        }

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
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");

    try {
      const updatedUser = await updateCurrentUser({
        ...form,
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      });

      setUser(updatedUser);
      setForm({
        bio: updatedUser.bio || "",
        phone: updatedUser.phone || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
      });
    } catch (error) {
      setSaveError(error.message || "Unable to save your changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const validationError = getPhotoFileError(file);

    if (validationError) {
      setPhotoError(validationError);
      event.target.value = "";
      return;
    }

    setPhotoError("");

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const nextPreview = URL.createObjectURL(file);
    setPreview(nextPreview);
    setUploadingPhoto(true);

    try {
      const updatedUser = await uploadProfilePhoto(file);
      setUser(updatedUser);
    } catch (error) {
      URL.revokeObjectURL(nextPreview);
      setPreview(null);
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

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const photoSrc = preview
    ? preview
    : user.hasProfilePhoto
      ? getProfilePhotoUrl(user.id)
      : "/default-profile.svg";

  return (
    <div className="owner-profile">
      <h2>Pet Owner Profile</h2>

      <div className="profile-header">
        <div className="profile-pic">
          <img src={photoSrc} alt={`${user.name}'s profile`} />

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

          <label htmlFor="profile-city">City:</label>
          <input
            id="profile-city"
            name="city"
            value={form.city}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <label htmlFor="profile-state">State:</label>
          <input
            id="profile-state"
            name="state"
            value={form.state}
            onChange={handleChange}
            maxLength={2}
            required
          />

          <label htmlFor="profile-phone">Phone:</label>
          <input
            id="profile-phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            maxLength={20}
          />

          <label htmlFor="profile-bio">Bio:</label>
          <textarea
            id="profile-bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={2000}
          />

          {saveError && (
            <p className="owner-profile__error" role="alert">
              {saveError}
            </p>
          )}

          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}