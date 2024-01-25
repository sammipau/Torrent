import "./pages.css";
import React, { useState, useEffect } from 'react';

const Categories = () => {
    const [torrents, setTorrents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    // const apiURL = "http://localhost:4321"; # might be incorrect

    useEffect(() => {
        // API call to get all added categories - rn this is hard coded
        setCategories(['Category1', 'Category2', 'Category3', 'All']);
        const fetchTorrentsByCategories = (categories) => {
            // API call to get torrents where category == selected categories
            const fetchedTorrents = [
                { name: 'test 1', category: 'Category1', size: '1 GB', age: '2 days' },
                { name: 'test 2', category: 'Category2', size: '500 MB', age: '1 day' },
                { name: 'test 3', category: 'Category3', size: '1 MB', age: '10 days' },
            ];

            // const requestOptions = {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //     }
            // };

            // fetch(apiURL + "/getTorrents", requestOptions)
            //     .then(response => response.json())
            //     .then(data => {
            //         setTorrents(data);
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });

            if (categories.includes('All')) {
                setTorrents(fetchedTorrents);
            } else {
                const filteredTorrents = fetchedTorrents.filter(torrent => categories.includes(torrent.category));
                setTorrents(filteredTorrents);
            }
        };

        fetchTorrentsByCategories(selectedCategories);
    }, [selectedCategories]);

    const handleCategoryChange = (category) => {
        let updatedCategories;
        if (category === 'All') {
            updatedCategories = selectedCategories.includes('All') ? [] : ['All'];
        } else {
            if (selectedCategories.includes(category)) {
                updatedCategories = selectedCategories.filter(item => item !== category);
            } else {
                updatedCategories = [...selectedCategories, category];
            }
        }
        setSelectedCategories(updatedCategories);
    };

    return (
        <div>
            <div className="text">
                <h1>Categories</h1>
                <div className="category-bubbles">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`btn btn-outline-primary button-space-right ${selectedCategories.includes(category) ? 'active' : ''
                                }`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col" class="col-12 col-lg-7">Name</th>
                                <th scope="col">Size</th>
                                <th scope="col">Age</th>
                                <th scope="col">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {torrents.map(torrent => (
                                <tr key={torrent.id}>
                                    <td>{torrent.name}</td>
                                    <td>{torrent.size}</td>
                                    <td>{torrent.age}</td>
                                    <td>{torrent.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Categories