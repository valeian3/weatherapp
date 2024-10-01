import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import weatherApiInstance from "./api";

const getCurrentConditions = async (location: string) => {
  if (!location) return;
  try {
    const response = await weatherApiInstance.get("/current.json", {
      params: { q: location },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
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
    queryFn: () => getCurrentConditions(location),
    enabled: !!location,
  });
};

const getSearchLocation = async (location: string) => {
  if (!location) return [];
  try {
    const response = await weatherApiInstance.get("/search.json", {
      params: { q: location },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        error.response?.data?.error?.message ?? "An unexpected error occurred"
      );
    } else {
      console.log("An unexpected error occurred");
    }
    return null;
  }
};

export const useSearchLocation = (location: string) => {
  return useQuery({
    queryKey: [`${location}`],
    queryFn: () => getSearchLocation(location),
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
