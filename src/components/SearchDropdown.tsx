import { memo } from "react";

import SearchIcon from "assets/SearchIcon";
import RecentIcon from "assets/RecentIcon";

import type { ISearchSuggestion } from "lib/types";

interface ISuggestion {
  name: string;
  country: string;
  region: string;
  searched: boolean;
}

/**
 * Props for the SearchDropdown component.
 */
interface SearchDropdownProps {
  /**
   * List of recent and suggestion data from api.
   */
  suggestionList: ISuggestion[];
  /**
   * List of search suggestion data from api.
   */
  suggestionLocationData: ISearchSuggestion[] | [] | undefined;
  /**
   * Function to handle the selection of a list item.
   * @param location - The location string of the selected item.
   */
  handleSelectListItem: (location: string) => void;
}

/**
 * A dropdown component for displaying search suggestions and recent searches.
 * @param {SearchDropdownProps} props - The props for the component.
 * @returns {JSX.Element} - List of suggestions.
 */
function SearchDropdown({
  suggestionList,
  suggestionLocationData,
  handleSelectListItem,
}: SearchDropdownProps): JSX.Element {
  if (suggestionLocationData?.length === 0)
    return (
      <div className="z-10 bg-white rounded-lg shadow dark:bg-gray-700">
        <span className="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-slate-500 dark:text-slate-200">
          Location not found...
        </span>
      </div>
    );

  return (
    <>
      {suggestionList.length > 0 && (
        <div className="z-10 w-full absolute bg-white rounded-lg shadow dark:bg-gray-700">
          <ul
            className="max-h-48 h-auto overflow-y-auto"
            aria-labelledby="search-dropdown-suggestions"
          >
            {suggestionList.map((item, index: number) => (
              <li
                key={index}
                className="flex gap-2 items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSelectListItem(item.name)}
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
                    {`Country > ${item.country}`} {" - "}{" "}
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
}

export default memo(SearchDropdown);
