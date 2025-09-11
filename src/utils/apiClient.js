export async function apiClient(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      window.location.href = "/login";
      return { data: null, error: "Unauthorized" };
    }

    if (response.status === 404) {
      throw new Error("Not Found");
    }

    if (response.status === 500) {
      throw new Error("Server Error");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Unknown error");
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      return { data: null, error: "Network Error" };
    }
    return { data: null, error: error.message || "Unknown Error" };
  }
}
