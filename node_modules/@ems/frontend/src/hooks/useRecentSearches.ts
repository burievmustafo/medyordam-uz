import { useState, useEffect } from 'react';

interface RecentSearch {
    passportId: string;
    patientName: string;
    searchedAt: string;
}

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = 'ems_recent_searches';

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse recent searches:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Add a new search
    const addSearch = (passportId: string, patientName: string) => {
        setRecentSearches((prev) => {
            // Remove duplicate if exists
            const filtered = prev.filter((s) => s.passportId !== passportId);

            // Add new search at the beginning
            const updated = [
                {
                    passportId,
                    patientName,
                    searchedAt: new Date().toISOString(),
                },
                ...filtered,
            ].slice(0, MAX_RECENT_SEARCHES);

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            return updated;
        });
    };

    // Clear all searches
    const clearSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Remove a specific search
    const removeSearch = (passportId: string) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((s) => s.passportId !== passportId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return {
        recentSearches,
        addSearch,
        clearSearches,
        removeSearch,
    };
}
