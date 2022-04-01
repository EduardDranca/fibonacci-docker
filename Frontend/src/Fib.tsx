import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Fib = () => {
    const [values, setValues] = useState({});
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        const fetchValues = await axios.get('/api/values/current');
        setValues(fetchValues.data);
    };

    const fetchIndexes = async () => {
        const fetchIndexes = await axios.get('/api/values/all');
        setSeenIndexes(fetchIndexes.data);
    };

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, [index]);

    const renderIndexes = (indexes: {number: number}[]) => {
        return (<ul>
            {indexes.map(index => {
                return <li key={index.number}>{index.number}</li>
            })}
        </ul>);
    }

    const renderValues = (values: any) => {
        return Object.keys(values).map(key => {
            return (
                <div key = {key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await axios.post('/api/values', {
            index: index
        });

        setIndex('');
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index: </label>
                <input
                    value = {index}
                    onChange = {(event) => {setIndex(event.target.value)}}
                ></input>
                <button>Submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            {renderIndexes(seenIndexes)}
            <h3>Calculated values:</h3>
            {renderValues(values)}
        </div>
    );
};

export default Fib;