import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from "../components/Navigation";

function Profile() {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`);
        console.log(id);

        if (!response.ok) {
          throw new Error("User profile not found");
        }
        const data = await response.json();
        setProfileUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation searchbar={true} />
        <main className="account-loading">
          <p>Loading profile...</p>
        </main>
      </>
    );
  }

  if (error || !profileUser) {
    return (
      <>
        <Navigation searchbar={true} />
        <main className="account-loading">
          <p style={{ color: 'var(--text-error)' }}>{error || "User not found"}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation searchbar={true} />

      <main className="account-page">
        <div className="account-group">
          <h2 className="account-group-title">Profile: {profileUser.username}</h2>
          
          {profileUser.profilePhoto && (
            <div className="account-row" style={{ justifyContent: 'center', padding: '20px' }}>
              <img 
                src={profileUser.profilePhoto} 
                alt={`${profileUser.username}'s profile`} 
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="account-row">
            <span className="account-label">Display name</span>
            <span className="account-value-preview">{profileUser.username}</span>
          </div>

          <div className="account-row">
            <span className="account-label">About me</span>
            <span className="account-value-preview">{profileUser.about || "No bio provided"}</span>
          </div>

          <div className="account-row">
            <span className="account-label">Socials</span>
            <span className="account-value-preview">
              {profileUser.socials && Object.keys(profileUser.socials).length > 0 
                ? Object.entries(profileUser.socials).map(([platform, handle]) => `${platform}: ${handle}`).join(' | ') 
                : "None linked"}
            </span>
          </div>
        </div>

        <div className="account-group">
          <h2 className="account-group-title">Information</h2>
          
          <div className="account-row">
            <span className="account-label">Email address</span>
            <span className="account-value-preview">{profileUser.email}</span>
          </div>

          <div className="account-row">
            <span className="account-label">Gender</span>
            <span className="account-value-preview">{profileUser.gender || "Not specified"}</span>
          </div>

          <div className="account-row">
            <span className="account-label">Member since</span>
            <span className="account-value-preview">
              {profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : "Unknown"}
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;