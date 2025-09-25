import { useState, useCallback } from "react";

function Debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function WeatherApp({ onBack }) {
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [cityName, setCityName] = useState("--");
  const [dark, setDark] = useState(false);
  const [forecast, setForecast] = useState([]);

  const fetching = async (city) => {
    try {
      const apikey = "ba1f2eb9bf7c43dbbf190626251909";
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=4&aqi=no&alerts=no`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.current) {
        setTemperature(data.current.temp_c);
        setHumidity(data.current.humidity);
        setCityName(data.location.name);
        setForecast(data.forecast.forecastday);
        setStatus("");
      } else {
        throw new Error("Weather data not found");
      }
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  const debouncedFetch = useCallback(Debounce(fetching, 500), []);

  const handleToggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setStatus("Fetching weather data...");
    setTemperature("--");
    setHumidity("--");
    setCityName("--");
    setForecast([]);

    debouncedFetch(city);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 relative">
        <button type="button" onClick={onBack} className="absolute top-5 left-4 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-700 text-white dark:text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition">
          Back
        </button>

        <div className="flex justify-end">
          <button type="button" onClick={handleToggleDark} className="mb-4 px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black transition">
            <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} transition`}></i>
          </button>
        </div>

        <h1 className="mb-5 text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug text-gray-900 dark:text-white text-center break-words whitespace-normal">
          Sunny,Cloudy?
        </h1>

        <div className="relative mb-4">
          <input type="search" id="search" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name..." className="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Search
          </button>
        </div>

        {cityName !== "--" && (
          <div>
            <p className="text-gray-400 text-sm">{status}</p>
            <p className="text-gray-400 text-sm">Temperature: {temperature}°C</p>
            <p className="text-gray-400 text-sm">Humidity: {humidity}%</p>
            <p className="text-gray-400 text-sm">City: {cityName}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700 text-center">
              <img className="w-12 h-12 mx-auto my-2" src={`https:${day.day.condition.icon}`} />
              <p className="text-gray-600 dark:text-gray-300">
                {day.day.condition.text}
              </p>
              <p className="text-gray-800 dark:text-white">
                {day.day.avgtemp_c}°C
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Min: {day.day.mintemp_c}°C | Max: {day.day.maxtemp_c}°C
              </p>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default WeatherApp;
