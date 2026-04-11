import API_BASE_URL from "../config/apiConfig";

export const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${symbol}`);
    if (!response.ok) {
      throw new Error(`Error fetching stock data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
