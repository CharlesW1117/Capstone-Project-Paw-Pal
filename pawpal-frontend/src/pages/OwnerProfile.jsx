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
      <main className="owner-profile owner-profile--status">
        <p className="owner-profile__error" role="alert">
          {loadError}
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="owner-profile owner-profile--status">
        <p>Loading profile...</p>
      </main>
    );
  }

  const photoSrc = preview
    ? preview
    : user.hasProfilePhoto
      ? getProfilePhotoUrl(user.id)
      : "/default-profile.svg";

  const hasCustomPhoto = Boolean(preview || user.hasProfilePhoto);

  return (
    <main className="owner-profile">
      <header className="owner-profile__header">
        <p className="owner-profile__eyebrow">Account</p>
        <h1>Pet Owner Profile</h1>
        <p>Keep your contact details current so sitters can reach you when needed.</p>
      </header>

      <section className="owner-profile__card" aria-label="Pet owner profile details">
        <aside className="owner-profile__photo-panel">
          <div className="owner-profile__avatar">
            <img src={photoSrc} alt={`${user.name}'s profile`} />
          </div>

          <div className="owner-profile__summary">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <input
            id="owner-profile-photo"
            className="owner-profile__file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
          />
          <label
            className={`owner-profile__photo-button${
              uploadingPhoto ? " owner-profile__photo-button--disabled" : ""
            }`}
            htmlFor="owner-profile-photo"
            aria-disabled={uploadingPhoto}
          >
            <i className="fi fi-rr-camera" aria-hidden="true" />
            {uploadingPhoto
              ? "Uploading..."
              : hasCustomPhoto
                ? "Change photo"
                : "Add photo"}
          </label>

          <p className="owner-profile__photo-help">
            JPEG, PNG, or WebP. Maximum 5 MB.
          </p>

          {uploadingPhoto && (
            <p className="owner-profile__status" role="status">
              Your new photo is being uploaded.
            </p>
          )}

          {photoError && (
            <p className="owner-profile__error" role="alert">
              {photoError}
            </p>
          )}
        </aside>

        <div className="owner-profile__details">
          <div className="owner-profile__section-heading">
            <div>
              <h2>Contact details</h2>
              <p>This information helps coordinate your pet’s care.</p>
            </div>
          </div>

          <div className="owner-profile__identity">
            <div>
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="owner-profile__form-grid">
            <div className="owner-profile__field">
              <label htmlFor="profile-city">City</label>
              <input
                id="profile-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                maxLength={100}
                placeholder="Your city"
                required
              />
            </div>

            <div className="owner-profile__field">
              <label htmlFor="profile-state">State</label>
              <input
                id="profile-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                maxLength={2}
                placeholder="State"
                required
              />
            </div>

            <div className="owner-profile__field owner-profile__field--full">
              <label htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="Your phone number"
              />
            </div>

            <div className="owner-profile__field owner-profile__field--full">
              <label htmlFor="profile-bio">About you</label>
              <textarea
                id="profile-bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={2000}
                rows={5}
                placeholder="Share anything a sitter should know about you and your pets."
              />
            </div>
          </div>

          {saveError && (
            <p className="owner-profile__error" role="alert">
              {saveError}
            </p>
          )}

          <div className="owner-profile__actions">
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
