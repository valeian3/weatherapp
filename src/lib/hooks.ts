import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import weatherApiInstance from "./api";

import type { ICurrentAndForecast, ISearchSuggestion } from "lib/types";

const getCurrentConditionsAndForecast = async (
  location: string
): Promise<ICurrentAndForecast | null> => {
  if (!location) return null;
  try {
    const response = await weatherApiInstance.get<ICurrentAndForecast>(
      "/forecast.json",
      {
        params: { q: location, aqi: "yes", days: 3 },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data?.error?.message ?? "An unexpected error occurred"
      );
    } else {
      console.log("An unexpected error occurred");
    }
    return null;
  }
};

export const useCurrentConditions = (location: string) => {
  return useQuery({
    queryKey: [`search-location-${location}`],
    queryFn: () => getCurrentConditionsAndForecast(location),
    enabled: !!location,
  });
};

const getSuggestionLocations = async (
  location: string
): Promise<ISearchSuggestion[] | []> => {
  if (!location) return [];
  try {
    const response = await weatherApiInstance.get<ISearchSuggestion[]>(
      "/search.json",
      {
        params: { q: location },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data?.error?.message ?? "An unexpected error occurred"
      );
    } else {
      console.log("An unexpected error occurred");
    }
    return [];
  }
};

export const useSuggestionLocation = (location: string) => {
  return useQuery({
    queryKey: [`${location}`],
    queryFn: () => getSuggestionLocations(location),
    enabled: !!location,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue] as const;
};

export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
