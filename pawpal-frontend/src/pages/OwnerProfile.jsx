import { useState } from "react";
import "./OwnerProfile.css";

function OwnerProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("janedoe@example.com");
  const [location, setLocation] = useState("Oklahoma City, OK");

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="owner-profile">
      <h2>Pet Owner Profile</h2>

      <div className="profile-header">
        <div className="profile-pic">
          {profilePic ? (
            <img src={profilePic} alt="Profile" />
          ) : (
            <div className="placeholder">Upload Photo</div>
          )}
          <input type="file" accept="image/*" onChange={handlePicChange} />
        </div>

        <div className="profile-info">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about you and your pets..."
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default OwnerProfile;
