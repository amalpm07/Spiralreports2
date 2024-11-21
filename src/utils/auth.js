// utils/auth.js
import axios from 'axios';

export const refreshAuthToken = async (userId, refreshToken) => {
  try {
    const response = await axios.post('https://app.spiralreports.com/api/auth/user/refresh', {
      userId: userId,
      refreshToken: refreshToken,
    });

    if (response.data && response.data.accessToken && response.data.refreshToken) {
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;  // Throw error to handle failure in App.js
  }
};
