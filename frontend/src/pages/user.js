import { useState } from "react";
import "./pages.css";
import { useNavigate } from "react-router-dom";

const User = () => {
    // const [deleteTorrents, setDeleteTorrents] = useState(false);
    // const [showDeleteTorrents, setShowDeleteTorrents] = useState(false);
    const [showRunDeletion, setShowRunDeletion] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDeleteUser = () => {
        setShowRunDeletion(true);
    };

    // const handleDeleteTorrentsTrue = () => {
    //     setDeleteTorrents(true);
    //     setShowRunDeletion(true);
    // };

    // const handleDeleteTorrentsFalse = () => {
    //     setDeleteTorrents(false);
    //     setShowRunDeletion(true);
    // };

    const handleRunDeletion = async () => {
        try {
            const response = await fetch (`http://localhost:8000/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Unable to delete user');
            }
            setSuccess('User deleted successfully');
        } catch (error) {
            console.log(error);
            setError("Unable to delete user");

        }

        // setDeleteTorrents(false);
        // setShowDeleteTorrents(false);
        setShowRunDeletion(false);
    };

    return (
        <div className="user-text">
            <h3>Would you like to delete your account?</h3>
            <button class="btn btn-danger" onClick={handleDeleteUser}>
                Yes, delete my account.
            </button>

            {/* {showDeleteTorrents && (
                <div className="confirmation-modal">
                    <p class="torrent-text">Do you want to delete all associated torrents?</p>
                    <button class="btn btn-secondary button-space-right" onClick={handleDeleteTorrentsTrue}>
                        Yes, delete associated torrents
                    </button>
                    <button class="btn btn-dark" onClick={handleDeleteTorrentsFalse}>
                        No, only delete user
                    </button>
                </div>
            )} */}

            {showRunDeletion && (
                <div className="confirmation-modal">
                    <button class="btn btn-warning button-space-top" onClick={handleRunDeletion}>
                        Run deletion
                    </button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    )
}

export default User