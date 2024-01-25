import React, { useState, useEffect } from "react";
import { makeRequest } from "../makeRequest";
import "./pages.css";

const Projection = () => {
    const [tables, setTables] = useState([]);
    const [selectedValueTables, setSelectedValueTables] = useState('');
    const [projection, setProjection] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [selectedValueAttributes, setSelectedValueAttributes] = useState([]);
    const [content, setContent] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await makeRequest('/projection', 'GET');
            let tableNames = Object.keys(response.tables);
            setTables(tableNames);

            const projectionData = tableNames.map((tableName) => ({
                name: tableName,
                contents: response.tables[tableName],
            }));
            // console.log("projectionData", projectionData);
            setProjection(projectionData);
        } catch (error) {
            console.error(error);
        }
    };
        fetchData();
    }, []);

    const handleTableDropdownChange = (event) => {
        setSelectedValueTables(event.target.value);
        for (let i = 0; i < projection.length; i++) {
            if (projection[i].name === event.target.value) {
                setAttributes(projection[i].contents);
            }
        }
    };

    const handleAttributeDropdownChange = async (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedValueAttributes(selectedOptions);
        try {
            const response = await makeRequest('/projection', 'POST', {"table": selectedValueTables, "columns": selectedOptions});
            console.log("test", response.values);
            setContent(response.values);
            if (response.values.length > 0) {
                setColumns(Object.keys(response.values[0]));
            }
            
        } catch (error) {
            console.error(error);
        }
    }


    
    return (
        <div className="text">
        <label>Choose an table:</label>
        <select id="dropdown" value={selectedValueTables} onChange={handleTableDropdownChange}>
            <option value="">Select table</option>
            {tables.map((t) => (
            <option>
                {t}
            </option>
            ))}
        </select>

        {selectedValueTables && (
            <div>
                <label>Choose attributes:</label>
                <select 
                    id="attributeDropdown" 
                    value={selectedValueAttributes} 
                    onChange={handleAttributeDropdownChange}
                    multiple>
                    <option value="">Select attributes</option>
                    {attributes.map((attribute) => (
                        <option>
                            {attribute}
                        </option>
                    ))}
                </select>
            </div>
        )}
        <p>You selected: Table: {selectedValueTables} <br></br> Attribute:{selectedValueAttributes} <br></br> Values:</p>
        <div>
            <h2>Data Table</h2>
            <table className="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>Index</th>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {content.map((data, ri) => (
                        <tr key={ri}>
                            <td>{ri}</td>
                            {columns.map((column, ci) => (
                                <td key={ci}>{data[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        </div>
    );
    };



export default Projection;