import React, { useState, useEffect } from "react";
import { makeRequest } from "../makeRequest";
import "./pages.css";

const Stats = () => {
    const [division, setDivision] = useState([]);
    const [aggregationNested, setAggregationNested] = useState([]);
    const [aggregationHaving, setAggregationHaving] = useState([]);
    const [aggregationGroup, setAggregationGroup] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const divisionResponse = await makeRequest('/division', 'GET');
            const aggregationNestedResponse = await makeRequest('/aggregationNested', 'GET');
            const aggregationHavingResponse = await makeRequest('/aggregationHaving', 'GET');
            const aggregationGroupResponse = await makeRequest('/aggregationGroup', 'GET');
            console.log("divisionResponse", divisionResponse);
            console.log("aggregationNestedResponse", aggregationNestedResponse);
            console.log("aggregationHavingResponse", aggregationHavingResponse);
            console.log("aggregationGroupResponse", aggregationGroupResponse);
            if (divisionResponse.users === null) {
                setDivision([]);
            } else {
                setDivision(divisionResponse.users);
            }
            setAggregationNested(aggregationNestedResponse.counts);
            setAggregationHaving(aggregationHavingResponse.counts);
            setAggregationGroup(aggregationGroupResponse.counts);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
}, []);

    return (
        <div className="text">
            <h1>Stats</h1>
            <h3>All users who have downloaded all torrents</h3>
            {division.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {division.map(d => (
                                    <tr key={d[0]}>
                                        <td>{d}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
            <h3> Avg number of comments per category </h3>
            {aggregationNested.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Category</th>
                                    <th scope="col">Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aggregationNested.map(d => (
                                    <tr key={d[0]}>
                                        <td>{d[0]}</td>
                                        <td>{d[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No categories found.</p>
                    )}
            <h3> Torrent counts fo each type of category having torrent size larger than 1</h3>
            {aggregationHaving.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Category</th>
                                    <th scope="col">Torrent Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aggregationHaving.map(d => (
                                    <tr key={d[0]}>
                                        <td>{d[0]}</td>
                                        <td>{d[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No categories found.</p>
                    )}
            <h3> Torrent counts for each type of category </h3>
            {aggregationGroup.length > 0 ? (
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-12 col-lg-7">Category</th>
                                    <th scope="col">Torrent Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aggregationGroup.map(d => (
                                    <tr key={d[0]}>
                                        <td>{d[0]}</td>
                                        <td>{d[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No categories found.</p>
                    )}
        </div>
    )
};

export default Stats;

