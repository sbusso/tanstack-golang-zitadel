// src/services/apiClient.ts
// Non-hook based API client for use in loaders and other non-React contexts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface ProfileData {
  accountType: string;
  [key: string]: any;
}

// Centralized API client that doesn't use hooks
const apiClient = {
  getUserProfile: (): Promise<ProfileData> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    return fetch(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized: Please login again");
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      return response.json();
    });
  },

  fetchProtectedResource: () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    return fetch(`${API_BASE_URL}/protected-resource`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch protected resource: ${response.status}`
        );
      }
      return response.json();
    });
  },
};

export default apiClient;
