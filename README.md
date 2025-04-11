# Weather Dashboard

A real-time weather dashboard that allows users to search for weather information by city name.

## Features

- Search for weather information by city name
- Display current temperature, weather condition, humidity, and wind speed
- Real-time weather updates
- Responsive and modern UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenWeatherMap API key

## Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies for both server and client:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. Create a `.env` file in the server directory with your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
```

## Running the Application

1. Start the server:

```bash
cd server
npm start
```

2. Start the client:

```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Reference

The application uses the OpenWeatherMap API to fetch weather data. You can get an API key by signing up at [OpenWeatherMap](https://openweathermap.org/appid).

## Technologies Used

- Frontend: React.js
- Backend: Node.js, Express
- API: OpenWeatherMap
- Styling: CSS
