import "./pages.css";
import React, { useState } from 'react';
import { makeRequest } from "../makeRequest";

const Tags = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionTor, setDescriptionTor] = useState('');
    const [and, setAnd] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [tags, setTags] = useState([]);
    const [torrents, setTorrents] = useState([]);

    const handleCheck = () => {
        setIsChecked(!isChecked);
        if (!isChecked) {
            console.log("and is true");
            setAnd(true);
        } else {
            console.log("and is false");
            setAnd(false);
        }
    }
    const handleSelect = async () => {
        console.log("selecting tags");
        try {
            console.log("name", name, "description", description, "and", and);
            const response = await makeRequest('/select', 'POST', {"name": name, "description": description, "and": and});
            setTags(response.tags);
            if (response.tags === null) {
                setTags([]);
            } else {
                setTags(response.tags);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleJoin = async () => {
        console.log("selecting tags");
        try {
            // console.log("name", name, "description", description, "and", and);
            // const response = await makeRequest('/select', 'POST', {"name": name, "description": description, "and": and});
            const response = await makeRequest('/join', 'POST', {"tagDescription": description});
            if (response.torrents === null) {
                setTorrents([]);
            } else {
                setTorrents(response.torrents);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div>
            <div className="text">
                <h1>Tags</h1>
                <p>Filter Tags by name and description</p>
                <input
                        className="button-space-right login-space-top"
                        placeholder="name (inclusive)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="button-space-right"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheck}
                        />
                        <label>AND</label>
                        <label>AND (Will use OR if not checked)</label>
                    <button type="submit" onClick={handleSelect}>Filter Tags</button>
                    {tags.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Name</th>
                                    <th scope="col">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.map(tag => (
                                    <tr key={tag[0]}>
                                        <td>{tag[0]}</td>
                                        <td>{tag[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No tags found.</p>
                    )}
            </div>
        </div>
            <div className="text">
                <p>Filter Torrents by tag description</p>
                    <input
                        className="button-space-right"
                        placeholder="Description"
                        value={descriptionTor}
                        onChange={(e) => setDescriptionTor(e.target.value)}
                    />
                    <button className="button-space-left" type="submit" onClick={handleJoin}>Filter Torrents</button>
                    {tags.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Name</th>
                                    <th scope="col">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {torrents.map(torrent => (
                                    <tr key={torrent[0]}>
                                        <td>{torrent[0]}</td>
                                        <td>{torrent[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No torrents found.</p>
                    )}

            </div>
        </div>
    );
}

export default Tags