const localStorageService = {
    // Method to get access token from local storage
    getAccessToken: (): string | null => {
      return localStorage.getItem('accessToken');
    },
  
    // Method to set access token in local storage
    setAccessToken: (accessToken: string): void => {
      localStorage.setItem('accessToken', accessToken);
    },
  
    // Method to remove access token from local storage
    removeAccessToken: (): void => {
      localStorage.removeItem('accessToken');
    },
  
    // Method to get refresh token from local storage
    getRefreshToken: (): string | null => {
      return localStorage.getItem('refreshToken');
    },
  
    // Method to set refresh token in local storage
    setRefreshToken: (refreshToken: string): void => {
      localStorage.setItem('refreshToken', refreshToken);
    },
  
    // Method to remove refresh token from local storage
    removeRefreshToken: (): void => {
      localStorage.removeItem('refreshToken');
    },
  
    // Method to clear all tokens from local storage
    clearTokens: (): void => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };
  
  export default localStorageService;
  