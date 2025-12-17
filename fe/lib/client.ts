import { client } from "@/sdk/output/client.gen";

// Check if we are in a browser environment
const isBrowser = typeof window !== "undefined";

// Configure the base URL
// In development, the backend is likely at http://localhost:8000
// In production, it might be different.
client.setConfig({
  baseURL: isBrowser ? "http://localhost:8000" : "http://localhost:8000",
});

if (isBrowser) {
  const token = localStorage.getItem("access_token");
  if (token) {
    client.setConfig({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export { client };
