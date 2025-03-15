import { useState, useCallback, useEffect } from "react";
import { moviesApi, type Movie } from "@/src/api/movies/api";
import { debounce } from "lodash";

interface UseMoviesQueryParams {
  initialKeyword?: string;
}

export const useMoviesQuery = ({
  initialKeyword = "car",
}: UseMoviesQueryParams = {}) => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(
    async (reset = false) => {
      if (isFetching) return;

      try {
        setIsFetching(true);
        if (reset) {
          setIsLoading(true);
          setPage(1);
        }

        const currentPage = reset ? 1 : page;
        const response = await moviesApi.getMovies({
          page: currentPage,
          keyword,
        });

        if (response.Response === "True") {
          setMovies((prev) =>
            reset ? response.Search : [...prev, ...response.Search]
          );
          setHasMore(Number(response.totalResults) > currentPage * 10);
        } else {
          setError(response.Error || "No results found");
          setHasMore(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [page, keyword, isFetching]
  );

  // Initial fetch
  useEffect(() => {
    fetchMovies(true);
  }, []);

  // Handle page changes
  useEffect(() => {
    if (page > 1) {
      fetchMovies(false);
    }
  }, [page]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  const handleRefresh = useCallback(() => {
    fetchMovies(true);
  }, [fetchMovies]);

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      setKeyword(searchTerm);
      setPage(1);
      setMovies([]);
      fetchMovies(true);
    }, 500),
    []
  );

  return {
    movies,
    isLoading,
    isFetching,
    error,
    hasMore,
    handleLoadMore,
    handleRefresh,
    handleSearch,
    currentFilters: {
      keyword,
      page,
    },
  };
};
