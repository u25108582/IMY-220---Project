import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/Navigation";

function Account() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      nav('/login');
    }
  }, [nav]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        alert("User ID not found");
        return;
      }

      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.removeItem('user');
      alert("Account deleted successfully");
      nav('/login');
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Could not delete account");
    }
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <main className="account-loading">
          <p>Loading account details...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation logout={true} />

      <main className="account-page">
        <div className="account-group">
          <h2 className="account-group-title">Profile</h2>
          
          <div className="account-row">
            <span className="account-label">Display name</span>
            <span className="account-value-preview">
              {user.username} <span className="arrow">&gt;</span>
            </span>
          </div>

          <div className="account-row">
            <span className="account-label">Profile photo</span>
            <span className="account-value-preview">
              {user.profilePhoto ? "Set" : "None"} <span className="arrow">&gt;</span>
            </span>
          </div>

          <div className="account-row">
            <span className="account-label">About me</span>
            <span className="account-value-preview">
              {user.about ? "Provided" : "Empty"} <span className="arrow">&gt;</span>
            </span>
          </div>

          <div className="account-row">
            <span className="account-label">Socials</span>
            <span className="account-value-preview">
              {user.socials && Object.keys(user.socials).length > 0 ? `${Object.keys(user.socials).length} linked` : "None"} <span className="arrow">&gt;</span>
            </span>
          </div>
        </div>

        <div className="account-group">
          <h2 className="account-group-title">Account</h2>
          
          <div className="account-row">
            <span className="account-label">Email address</span>
            <span className="account-value-preview">
              {user.email} <span className="arrow">&gt;</span>
            </span>
          </div>

          <div className="account-row">
            <span className="account-label">Gender</span>
            <span className="account-value-preview">
              {user.gender || "Not specified"} <span className="arrow">&gt;</span>
            </span>
          </div>
        </div>

        <div className="account-group">
          <div className="account-row account-delete-row" onClick={handleDeleteAccount}>
            <span className="account-label text-danger">Delete account</span>
            <span className="account-value-preview text-danger">
              <span className="arrow">&gt;</span>
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export default Account;