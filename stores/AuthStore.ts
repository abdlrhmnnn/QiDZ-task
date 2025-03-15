import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStore {
  isLoggedIn = false;
  initialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async initializeAuth() {
    try {
      const storedAuth = await AsyncStorage.getItem("isLoggedIn");
      runInAction(() => {
        this.isLoggedIn = storedAuth === "true";
        this.initialized = true;
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      runInAction(() => {
        this.initialized = true;
      });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    if (username === "ivaldi" && password === "testtest") {
      runInAction(() => {
        this.isLoggedIn = true;
      });
      await AsyncStorage.setItem("isLoggedIn", "true");
      return true;
    }
    return false;
  }

  async logout() {
    runInAction(() => {
      this.isLoggedIn = false;
    });
    await AsyncStorage.setItem("isLoggedIn", "false");
  }
}

export const authStore = new AuthStore();
