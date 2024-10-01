import { useState } from "react";

import { useCurrentConditions } from "lib/hooks";

import Header from "components/Header";
import Search from "components/Search";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isError, isLoading } = useCurrentConditions(searchQuery);

  return (
    <div className="h-dvh flex flex-col bg-slate-100 dark:bg-slate-700 tablet:items-center transition-colors duration-100">
      <Header />
      <div className="px-4 py-4 tablet:w-full laptop:w-2/4">
        <Search setSearchQuery={setSearchQuery} />

        <div className="max-w-md mx-auto mt-4">
          {isLoading && (
            <span className="block py-2 rounded-lg text-sm dark:text-slate-200">
              Loading...
            </span>
          )}

          {isError && (
            <span className="block py-2 rounded-lg text-sm text-red-500 dark:text-red-400">
              Something went wrong when fetching location data...
            </span>
          )}

          {!isError && data && (
            <>
              <div className="flex flex-col items-center mt-12">
                <span className="text-2xl text-slate-600 dark:text-slate-300">
                  {data.location.name}
                </span>
                <span className="my-2 text-sm text-slate-400 dark:text-slate-500">
                  {`${data.location.region}, ${data.location.country}`}
                </span>
                <div className="flex flex-row items-center">
                  {data.current.condition.icon && (
                    <img
                      className="w-20 h-20"
                      src={data.current.condition.icon}
                      alt={data.current.condition.text}
                    />
                  )}
                  <span className="text-4xl text-slate-600 dark:text-slate-300">
                    {data.current.temp_c}°C
                  </span>
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  {data.current.condition.text}
                </p>
                <div className="w-2/4 mt-4 flex flex-row justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-400 dark:text-slate-500">
                      Feels Like
                    </span>
                    <span className="text-base text-slate-600 dark:text-slate-300">
                      {data.current.feelslike_c}°C
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-slate-400 dark:text-slate-500">
                      UV
                    </span>
                    <span className="text-base text-slate-600 dark:text-slate-300">
                      {data.current.uv}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
