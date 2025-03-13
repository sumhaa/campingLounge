import { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
    const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
    const cityName = "Seoul";
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
                );
                setWeather(response.data);
            } catch (err) {
                setError("날씨 정보를 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <p>날씨 정보를 불러오는 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 border rounded-lg shadow-md max-w-sm">
            <h2 className="text-xl font-bold">{weather.name} 날씨</h2>
            <p className="text-lg">{weather.weather[0].description}</p>
            <p>온도: {weather.main.temp}°C</p>
            <p>습도: {weather.main.humidity}%</p>
            <p>풍속: {weather.wind.speed} m/s</p>
        </div>
    );
};

export default Weather;
