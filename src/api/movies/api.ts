import axios from "axios";

const API_KEY = "741fd8d3";
const BASE_URL = "https://www.omdbapi.com/";

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Type: string;
}

export interface MovieResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

export const moviesApi = {
  getMovies: async (params: { page: number; keyword?: string }) => {
    const response = await axios.get<MovieResponse>(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: params.keyword || "car",
        page: params.page,
      },
    });
    return response.data;
  },
};
