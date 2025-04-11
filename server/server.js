const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// GeoDB Cities API configuration
const GEODB_API_KEY = process.env.RAPIDAPI_KEY;
const GEODB_HOST = 'wft-geo-db.p.rapidapi.com';

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

// Cities autocomplete endpoint
app.get('/api/cities', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    const response = await axios.get(`https://${GEODB_HOST}/v1/geo/cities`, {
      params: {
        namePrefix: query,
        limit: 5,
        sort: '-population'
      },
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': GEODB_HOST
      }
    });

    const cities = response.data.data.map(city => 
      `${city.city}${city.countryCode ? `, ${city.countryCode}` : ''}`
    );
    res.json(cities);
  } catch (err) {
    next(err);
  }
});

// Weather route
app.get('/api/weather/:city', async (req, res, next) => {
  try {
    const { city } = req.params;
    if (!city) {
      throw { status: 400, message: 'City parameter is required' };
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      name: response.data.name,
      main: {
        temp: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        temp_min: response.data.main.temp_min,
        temp_max: response.data.main.temp_max,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure
      },
      weather: response.data.weather,
      wind: response.data.wind
    };

    res.json(weatherData);
  } catch (err) {
    if (err.response?.status === 404) {
      next({ status: 404, message: 'City not found' });
    } else {
      next(err);
    }
  }
});

// Forecast route
app.get('/api/forecast/:city', async (req, res, next) => {
  try {
    const { city } = req.params;
    if (!city) {
      throw { status: 400, message: 'City parameter is required' };
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    // Process the forecast data to get daily forecasts
    const dailyForecasts = {};
    response.data.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = forecast;
      }
    });

    const processedData = {
      city: response.data.city,
      list: Object.values(dailyForecasts).slice(0, 5)
    };

    res.json(processedData);
  } catch (err) {
    if (err.response?.status === 404) {
      next({ status: 404, message: 'City not found' });
    } else {
      next(err);
    }
  }
});

// Use error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 