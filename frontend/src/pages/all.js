import "./pages.css";
import React, { useState, useEffect } from 'react';
import { makeRequest } from "../makeRequest";

const All = () => {

    const [torrents, setTorrents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCategoryBox, setShowCategoryBox] = useState(false);
    const [uploadCategory, setUploadCategory] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedTorrent, setSelectedTorrent] = useState(null);
    const [updateCategory, setUpdateCategory] = useState('');

    const handleTorrentSelection = (torrent) => {
        setSelectedTorrent(torrent);
        setUpdateCategory('');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectionData = {"table": "torrents", "columns": ["hash", "name", "size", "uploaded", "categoryid"]};
                const response = await makeRequest('/projection', 'POST', projectionData); //json
                console.log("torrents", response.values);
                setTorrents(response.values);
                const categoryData = {"table": "categories", "columns": ["categoryid", "name"]};
                const response2 = await makeRequest('/projection', 'POST', categoryData); //json
                setCategories(response2.values);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    }, []);
    const uploadClick = () => {
        setShowCategoryBox(true);
    }

    const uploadTorrent = async () => {
        console.log("uploading torrent");
        try {
            if (!uploadCategory) {
                throw new Error("Category is required");
            }
            const randHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const insertData = { "hash": randHash, "categoryName": uploadCategory };
            const response = await makeRequest("/insert", "POST", insertData); //json
            setSuccess("Torrent uploaded successfully!");
        } catch (error) {
            console.log(error);
            setError(error.toString());
        }
    }

    const updateTorrent = async (torrentHash) => {
        console.log("updating torrent");
        try {
            if (!updateCategory) {
                throw new Error("Category is required");
            }
            const updateData = { "hash": torrentHash, "categoryName": updateCategory };
            const response = await makeRequest("/update", "POST", updateData); //json
            setSuccess("Torrent updated successfully!");
        } catch (error) {
            console.log(error);
            setError(error.toString());
        }
    }


    const categoryName = (torrentid) => {
        const category = categories.find(it => it.categoryid === torrentid);
        return category ? category.name : 'Unknown';
    }

    return (
        <div className="text">
            <h1>All Torrents</h1>
            <button className="btn btn-outline-primary button-space-right" onClick={uploadClick}>Upload</button>
           {showCategoryBox && (
            <div>
            <input 
                type="text" 
                className="form-control" 
                placeholder="Category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                />
                <button className="btn btn-outline-primary button-space-right" 
                onClick={uploadTorrent}>Submit</button> 
                </div>)}


            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th scope="col" class="col-12 col-lg-7">Name</th>
                        <th scope="col">Size</th>
                        <th scope="col">Uploaded</th>
                        <th scope="col">Category</th>
                    </tr>
                </thead>
                <tbody>
                    {torrents.map(torrent => (
                        <tr key={torrent.hash}>
                            <td>{torrent.name}</td>
                            <td>{torrent.size}</td>
                            <td>{torrent.uploaded}</td>
                            <td>{categoryName(torrent.categoryid)}</td>
                            <td>
                                <button
                                    className="btn btn-info"
                                    onClick={() => handleTorrentSelection(torrent)}>
                                    Update
                                </button>
                                {selectedTorrent && (
                                    <div>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Category"
                                            value={updateCategory}
                                            onChange={(e) => setUpdateCategory(e.target.value)}
                                            />
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => updateTorrent(selectedTorrent.hash)}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    )
}

export default All