import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  FC,
  useMemo,
} from "react";

import { useDebounce, useSuggestionLocation } from "lib/hooks";
import SearchDropdown from "components/SearchDropdown";
import SearchIcon from "assets/SearchIcon";

interface IRecentSearch {
  name: string;
  country: string;
  region: string;
  searched: boolean;
}

interface SearchProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar: FC<SearchProps> = ({ setSearchQuery }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localQuery, setLocalQuery] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<IRecentSearch[]>([]);

  const debouncedLocalQuery: string = useDebounce<string>(localQuery, 500);
  const { data: suggestionLocationData } =
    useSuggestionLocation(debouncedLocalQuery);

  const suggestionList: IRecentSearch[] = useMemo(
    () => [
      ...recentSearches,
      ...(suggestionLocationData ?? []).map((item) => ({
        name: item.name,
        country: item.country,
        region: item.region,
        searched: false,
      })),
    ],
    [recentSearches, suggestionLocationData]
  );

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

      setLocalQuery("");
      setIsDropdownVisible(false);
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

      setLocalQuery("");
      setIsDropdownVisible(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recentSearches]
  );

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

  const handleFocus = useCallback(() => {
    setIsDropdownVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 200);
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
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
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
        <SearchDropdown
          suggestionList={suggestionList}
          suggestionLocationData={suggestionLocationData}
          handleSelectListItem={handleSelectLocation}
        />
      )}
    </div>
  );
};

export default SearchBar;
