import React from 'react';
import PropTypes from 'prop-types';

const WeatherCard = ({ weatherData }) => {
  // Early return if weatherData is null or undefined
  if (!weatherData) {
    return null;
  }

  // Safely destructure with default values
  const {
    main = {},
    weather = [],
    wind = {},
    name = 'Unknown Location',
    sys = {}
  } = weatherData;

  // Get weather details with fallbacks
  const weatherDetails = weather[0] || {};
  const weatherIcon = weatherDetails.icon || '01d';
  const description = weatherDetails.description || 'No description available';
  const country = sys.country || '';

  // Get numeric values with fallbacks
  const temperature = Math.round(main.temp || 0);
  const feelsLike = Math.round(main.feels_like || 0);
  const humidity = main.humidity || 0;
  const windSpeed = wind.speed || 0;
  const pressure = main.pressure || 0;

  // Get current time
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="weather-card">
      <div className="location-time">
        <h3>{name}, {country}</h3>
        <p className="time">{currentTime}</p>
      </div>
      
      <div className="weather-icon">
        <img
          src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
          alt={description}
        />
      </div>

      <div className="temperature">
        {temperature}°C
        <span className="feels-like">Feels like {feelsLike}°C</span>
      </div>

      <div className="weather-info">
        <div className="info-item">
          <span className="label">Humidity</span>
          <span className="value">{humidity}%</span>
        </div>
        <div className="info-item">
          <span className="label">Wind</span>
          <span className="value">{windSpeed} m/s</span>
        </div>
        <div className="info-item">
          <span className="label">Pressure</span>
          <span className="value">{pressure} hPa</span>
        </div>
      </div>

      <p className="description">{description}</p>
    </div>
  );
};

WeatherCard.propTypes = {
  weatherData: PropTypes.shape({
    main: PropTypes.shape({
      temp: PropTypes.number,
      feels_like: PropTypes.number,
      humidity: PropTypes.number,
      pressure: PropTypes.number,
    }),
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        icon: PropTypes.string,
      })
    ),
    wind: PropTypes.shape({
      speed: PropTypes.number,
    }),
    name: PropTypes.string,
    sys: PropTypes.shape({
      country: PropTypes.string,
    }),
  }),
};

export default WeatherCard; 