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
  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
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

  const handleSelectLocation = useCallback(
    (location: string) => {
      if (!location) return;
      setSearchQuery(location);

      // FIFO method
      const updatedRecentSearches = [...recentSearches];

      if (updatedRecentSearches.length === 3) {
        updatedRecentSearches.shift();
      }

      updatedRecentSearches.push({
        name: location,
        searched: true,
        country: "",
        region: "",
      });
      setRecentSearches(updatedRecentSearches);

      setLocalQuery("");
      setIsDropdownVisible(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recentSearches]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
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
    setIsInputFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsDropdownVisible(false);
      setIsInputFocused(false);
    }, 200);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-4 relative">
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
          ref={inputRef}
          type="search"
          id="default-search"
          aria-label="Search city weather"
          placeholder="Search location..."
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          value={localQuery}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {isInputFocused ? (
          <label className="absolute px-4 py-2 end-2.5 bottom-2.5 rounded-md font-medium text-sm text-slate-100 bg-slate-600 dark:bg-slate-800 dark:text-slate-300">
            ESC
          </label>
        ) : (
          <label className="absolute px-4 py-2 end-2.5 bottom-2.5 rounded-md font-medium text-sm text-slate-100 bg-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Ctrl K
          </label>
        )}
      </div>

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
