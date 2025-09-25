import { useState } from "react";
import Hero from "./Components/Hero.jsx";
import WeatherApp from "./Components/weatherapp.jsx";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex justify-center items-center">
      {!started ? (
        <Hero onStart={() => setStarted(true)} />
      ) : (
        <WeatherApp onBack={() => setStarted(false)} />
      )}
    </div>
  );
}

export default App;
