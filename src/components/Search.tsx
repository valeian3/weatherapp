import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  FC,
  useMemo,
} from "react";

import { useDebounce, useSearchLocation } from "lib/hooks";

import SearchIcon from "assets/SearchIcon";
import RecentIcon from "assets/RecentIcon";

interface IRecentSearch {
  name: string;
  country: string;
  region: string;
  searched: boolean;
}

interface DropdownProps {
  debouncedLocalQuery: string;
  handleSelectLocation: (location: string) => void;
  recentSearches: IRecentSearch[];
}

const Dropdown: FC<DropdownProps> = ({
  debouncedLocalQuery,
  handleSelectLocation,
  recentSearches,
}) => {
  const { data, isLoading, isError } = useSearchLocation(debouncedLocalQuery);

  const combinedRecentAndSuggestionData: IRecentSearch[] = useMemo(
    () => [
      ...recentSearches,
      ...(data ?? []).map((item) => ({
        name: item.name,
        country: item.country,
        region: item.region,
        searched: false,
      })),
    ],
    [recentSearches, data]
  );

  if (combinedRecentAndSuggestionData.length === 0)
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
      {combinedRecentAndSuggestionData?.length > 0 && (
        <div className="z-10 w-full absolute bg-white rounded-lg shadow dark:bg-gray-700">
          <ul
            className="max-h-48 h-auto overflow-y-auto"
            aria-labelledby="dropdownLocationResults"
          >
            {combinedRecentAndSuggestionData.map(
              (item: IRecentSearch, index: number) => (
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
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
};

interface SearchProps {
  setSearchQuery: (query: string) => void;
}

const Search: FC<SearchProps> = ({ setSearchQuery }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localQuery, setLocalQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<IRecentSearch[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const debouncedLocalQuery = useDebounce<string>(localQuery, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(event?.target?.value);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(localQuery);

      if (localQuery) {
        const updatedRecentSearches = [...recentSearches];

        if (updatedRecentSearches.length === 3) {
          updatedRecentSearches.shift();
        }

        updatedRecentSearches.push({
          name: localQuery,
          searched: true,
          country: "",
          region: "",
        });
        setRecentSearches(updatedRecentSearches);
      }

      setDropdownVisible(false);
      setLocalQuery("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localQuery, recentSearches]
  );

  const handleSelectLocation = useCallback(
    (location: string) => {
      setSearchQuery(location);
      if (location && !recentSearches.find((item) => item.name === location)) {
        setRecentSearches([
          ...recentSearches,
          { name: location, searched: true, country: "", region: "" },
        ]);
      }
      setDropdownVisible(false);
      setLocalQuery("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recentSearches]
  );

  const handleFocus = useCallback(() => {
    setDropdownVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    []
  );

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
          <label className="text-slate-500 dark:text-slate-300 absolute end-20 bottom-2.5 font-medium text-sm px-4 py-2">
            Ctrl K
          </label>
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
