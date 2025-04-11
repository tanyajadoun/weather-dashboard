import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const { isDarkMode } = useTheme();

    // Save search history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5001/api/weather/${searchInput}`);
            
            if (response.data && response.data.cod !== '404') {
                setWeatherData(response.data);
                // Add to search history
                setSearchHistory(prev => {
                    const newHistory = [searchInput, ...prev.filter(item => item !== searchInput)].slice(0, 5);
                    return newHistory;
                });
                setSearchInput('');
                setIsInputFocused(false); // Hide recent searches after successful search
            } else {
                throw new Error('City not found');
            }
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError(err.response?.data?.message || 'Failed to fetch weather data. Please try again.');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleHistoryClick = (city) => {
        setSearchInput(city);
        const event = { preventDefault: () => {} };
        handleSearch(event);
    };

    // Handle click outside of search container
    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(event.target)) {
                setIsInputFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
            <header className="app-header">
                <h1>Weather Dashboard</h1>
                <ThemeToggle />
            </header>
            <main className="app-main">
                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-input-wrapper">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            placeholder="Enter city name..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            Search
                        </button>
                    </form>
                    {isInputFocused && searchHistory.length > 0 && (
                        <div className="search-history">
                            <h3>Recent Searches</h3>
                            <div className="history-buttons">
                                {searchHistory.map((city, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleHistoryClick(city)}
                                        className="history-button"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
                {loading && <div className="loading"></div>}
                {weatherData && <WeatherCard weatherData={weatherData} />}
            </main>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App; 