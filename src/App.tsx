import { useState } from "react";

import { useCurrentConditions } from "lib/hooks";
import { getDayOfWeek } from "lib/utils";

import Header from "components/Header";
import SearchBar from "components/SearchBar";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: weatherData,
    isError,
    isLoading,
  } = useCurrentConditions(searchQuery);

  return (
    <div className="h-dvh flex flex-col bg-slate-200 dark:bg-slate-800 tablet:items-center transition-colors duration-100">
      <Header />
      <div className="px-4 py-4 tablet:w-full laptop:w-2/4 flex-grow">
        <SearchBar setSearchQuery={setSearchQuery} />

        <div className="max-w-md mx-auto mt-4">
          {isLoading && (
            <div className="flex flex-col items-center mt-12 animate-pulse">
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="my-2 h-5 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="flex flex-row items-center">
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-4 h-12 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="my-2 h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-2/4 mt-4 flex flex-row justify-around">
                <div className="flex flex-col items-center">
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="mt-1 h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-5 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="mt-1 h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <span className="block py-2 rounded-lg text-sm text-red-500 dark:text-red-400">
              Something went wrong when fetching location data...
            </span>
          )}

          {!isError && weatherData && (
            <>
              <div className="flex flex-col items-center mt-6">
                <span className="text-2xl text-slate-800 dark:text-slate-300">
                  {weatherData.location.name}
                </span>
                <span className="my-2 text-sm text-slate-600 dark:text-slate-400">
                  {`${weatherData.location.region}, ${weatherData.location.country}`}
                </span>
                <div className="flex flex-row items-center">
                  {weatherData.current.condition.icon && (
                    <img
                      className="w-20 h-20"
                      src={weatherData.current.condition.icon}
                      alt={weatherData.current.condition.text}
                    />
                  )}
                  <span className="text-4xl text-slate-800 dark:text-slate-300">
                    {weatherData.current.temp_c}°C
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {weatherData.current.condition.text}
                </p>
                <div className="w-2/4 mt-4 flex flex-row justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Feels Like
                    </span>
                    <span className="text-base text-slate-800 dark:text-slate-300">
                      {weatherData.current.feelslike_c}°C
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      UV
                    </span>
                    <span className="text-base text-slate-800 dark:text-slate-300">
                      {weatherData.current.uv}
                    </span>
                  </div>
                </div>

                <div className="w-full divide-y divide-solid divide-slate-500 px-4 py-2 mt-8 rounded-md flex flex-col bg-gray-50 dark:bg-gray-700">
                  <span className="text-xs pb-2 text-gray-700 dark:text-gray-200">
                    DAILY FORECAST
                  </span>
                  {weatherData.forecast.forecastday.map((item, index) => (
                    <div
                      key={index}
                      className="h-12 flex flex-row justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <span className="w-8 grow text-gray-700 dark:text-gray-200">
                        {getDayOfWeek(item.date)}
                      </span>
                      <div className="flex grow items-center justify-center">
                        <img
                          className="w-8 h-8"
                          src={item.day.condition.icon}
                          alt={item.day.condition.text}
                        />
                      </div>
                      <span className="w-8 grow text-gray-700 dark:text-gray-200">
                        {`L: ${item.day.mintemp_c}°C`}
                      </span>
                      <span className="w-8 grow text-gray-700 dark:text-gray-200">
                        {`H: ${item.day.maxtemp_c}°C`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-1 justify-center mt-auto mb-4">
        <span className="text-slate-600 dark:text-slate-200">Powered by</span>
        <a
          aria-label="weather-api-website-link"
          className="text-blue-700 dark:text-blue-400"
          href="https://www.weatherapi.com/"
          title="Weather API"
          target="_blank"
          rel="noopener noreferrer"
        >
          WeatherAPI.com
        </a>
      </div>
    </div>
  );
}

export default App;
