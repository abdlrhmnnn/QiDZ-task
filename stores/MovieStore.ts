import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
}

class MovieStore {
  movies: Movie[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    try {
      this.loading = true;
      const response = await axios.get(
        "https://www.omdbapi.com/?apikey=741fd8d3&s=car"
      );
      runInAction(() => {
        this.movies = response.data.Search || [];
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to fetch movies";
        this.loading = false;
      });
    }
  }
}

export const movieStore = new MovieStore();
