// queryClientSingleton.js
import { QueryClient } from "@tanstack/react-query";

// Create a singleton QueryClient that can be reused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
