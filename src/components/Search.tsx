import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDebounce, useSearchLocation } from "lib/hooks";

import SearchIcon from "assets/SearchIcon";
import RecentIcon from "assets/RecentIcon";

interface SearchItem {
  name: string;
  searched: boolean;
}

const Dropdown = ({
  debouncedLocalQuery,
  handleSelectLocation,
  recentSearches,
}: {
  debouncedLocalQuery: string;
  handleSelectLocation: (location: string) => void;
  recentSearches: SearchItem[];
}) => {
  const { data, isLoading, isError } = useSearchLocation(debouncedLocalQuery);

  const combinedData = [
    ...recentSearches,
    ...(data || []).map((item: any) => ({
      name: item.name,
      country: item.country,
      region: item.region,
      searched: false,
    })),
  ];

  if (combinedData.length === 0)
    return (
      <div className="z-10 h-8 bg-white rounded-lg shadow dark:bg-gray-700"></div>
    );

  if (isError)
    return (
      <div className="z-10 bg-white rounded-lg shadow dark:bg-gray-700">
        <span className="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:text-red-400">
          Something went wrong when fetching location...
        </span>
      </div>
    );

  if (isLoading)
    return (
      <div className="z-10 bg-white rounded-lg shadow dark:bg-gray-700">
        <span className="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-slate-500 dark:text-slate-200">
          Loading...
        </span>
      </div>
    );

  if (data?.length === 0)
    return (
      <div className="z-10 bg-white rounded-lg shadow dark:bg-gray-700">
        <span className="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-slate-500 dark:text-slate-200">
          Location not found...
        </span>
      </div>
    );

  return (
    <>
      {combinedData?.length > 0 && (
        <div className="z-10 w-full absolute bg-white rounded-lg shadow dark:bg-gray-700">
          <ul
            className="max-h-48 h-auto overflow-y-auto"
            aria-labelledby="dropdownLocationResults"
          >
            {combinedData.map((item: any, index: number) => (
              <li
                key={index}
                className="flex gap-2 items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSelectLocation(item.name)}
              >
                {item.searched ? <RecentIcon /> : <SearchIcon />}
                <span
                  className={`${
                    item.searched
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {item.name}
                </span>
                {!item.searched && (
                  <span className="text-xs italic text-gray-500">
                    {`Country > ${item.country}`}
                    {" - "}
                    {`Region > ${item.region}`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

interface SearchProps {
  setSearchQuery: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ setSearchQuery }) => {
  const [localQuery, setLocalQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedLocalQuery = useDebounce<string>(localQuery, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(event?.target?.value);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(localQuery);

      if (localQuery) {
        if (!recentSearches.find((item) => item.name === localQuery)) {
          const updatedRecentSearches = [...recentSearches];

          if (updatedRecentSearches.length === 3) {
            updatedRecentSearches.shift();
          }

          updatedRecentSearches.push({ name: localQuery, searched: true });
          setRecentSearches(updatedRecentSearches);
        }
      }

      setDropdownVisible(false);
      setLocalQuery("");
    },
    [localQuery, recentSearches]
  );

  const handleSelectLocation = useCallback(
    (location: string) => {
      setSearchQuery(location);
      if (location && !recentSearches.find((item) => item.name === location)) {
        setRecentSearches([
          ...recentSearches,
          { name: location, searched: true },
        ]);
      }
      setDropdownVisible(false);
      setLocalQuery("");
    },
    [recentSearches]
  );

  const handleFocus = () => {
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        event.currentTarget.blur();
        formRef.current?.requestSubmit();
        break;

      case "Escape":
        event.currentTarget.blur();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto relative">
      <form
        ref={formRef}
        className="my-4"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="search"
            id="default-search"
            ref={inputRef}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-700 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-500"
            placeholder="Search location..."
            required
            aria-label="Search city weather"
            value={localQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <span className="text-gray-400 absolute end-20 bottom-2.5 font-medium text-sm px-4 py-2">
            Ctrl K
          </span>
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      {isDropdownVisible && (
        <Dropdown
          debouncedLocalQuery={debouncedLocalQuery}
          handleSelectLocation={handleSelectLocation}
          recentSearches={recentSearches}
        />
      )}
    </div>
  );
};

export default Search;
