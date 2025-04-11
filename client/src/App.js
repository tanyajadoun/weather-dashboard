import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import './App.css';

const API_BASE_URL = 'http://localhost:5001/api/weather';

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (city) => {
        if (!city.trim()) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/${city}`);
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            if (response.data.cod === '404' || response.data.cod === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            }

            setWeatherData(response.data);
        } catch (err) {
            console.error('Error fetching weather data:', err);
            if (err.code === 'ERR_NETWORK') {
                setError('Unable to connect to the server. Please make sure the server is running on port 5001.');
            } else if (err.response?.status === 404) {
                setError('City not found. Please check the spelling and try again.');
            } else {
                setError(err.message || 'An error occurred while fetching weather data');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <div className="weather-container">
                <h1>Weather Dashboard</h1>
                <SearchBar onSearch={handleSearch} />
                {loading && <div className="loading-spinner"></div>}
                {error && <div className="error">{error}</div>}
                {weatherData && <WeatherCard weatherData={weatherData} />}
            </div>
        </div>
    );
}

export default App; 