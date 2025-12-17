import { ApiResponse } from "@/sdk/output/types.gen";
import { toast } from "sonner";

// Wrapper for the hey-api client response structure
type ApiCallResult<TResponse> = {
  data?: TResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
};

/**
 * Reusable API handler that extracts standardized error messages and shows toast notifications.
 * Uses the SDK's ApiResponse type for type safety.
 *
 * @param apiCall - The promise returned by the SDK function
 * @param options - Optional configuration
 * @returns The data object if success, or null if failed
 */
export async function safeApiCall<TResponse extends ApiResponse>(
  apiCall: Promise<ApiCallResult<TResponse>>,
  options?: {
    successMessage?: string;
    errorMessage?: string; // Fallback error message
    onSuccess?: (data: NonNullable<TResponse["data"]>) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void;
  }
): Promise<NonNullable<TResponse["data"]> | null> {
  try {
    const response = await apiCall;

    // Check for success in the response body (standardized backend format)
    if (response.data?.success) {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      const responseData = response.data.data as NonNullable<TResponse["data"]>;

      if (options?.onSuccess) {
        options.onSuccess(responseData);
      }
      // If data is null/undefined but success is true, we return it as is or handle it.
      // However, NonNullable might be too strict if data CAN be null?
      // Usually "success" implies we have what we want.
      // For empty responses (Post), data might be null.
      return responseData;
    }

    // Handle error returned in successful HTTP response (e.g. 200 OK but success: false)
    if (response.data && !response.data.success) {
      const msg =
        response.data.message || options?.errorMessage || "Operation failed";
      toast.error(msg);
      if (options?.onError) {
        options.onError(new Error(msg));
      }
      return null;
    }

    // If execution reached here and `data` is empty but `error` exists:
    if (response.error) {
      throw response.error;
    }

    return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let msg = options?.errorMessage || "An unexpected error occurred.";

    if (error instanceof Error) {
      // Standard error
      msg = error.message;
    }

    // Handle Axios Error Structure
    if (error?.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error?.body?.message) {
      // Hey-api sometimes puts body here
      msg = error.body.message;
    }

    toast.error(msg);

    if (options?.onError) {
      options.onError(error);
    }
    return null;
  }
}
