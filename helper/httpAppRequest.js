async function httpAppRequest(
  request,
  path,
  method = "GET",
  body = null,
  isNeedAuth = true,
  isFormData = false
) {
  try {
    const token = request.cookies.get("token") || {}; // Retrieve token from cookies
    if (!token?.value) {
      throw new Error("Token is missing!");
    }

    // Initialize headers object
    const headers = {};

    // Add Authorization header if needed
    if (isNeedAuth) {
      headers.Authorization = `Bearer ${token.value}`; // Add Bearer token
    }

    // Add Content-Type if not sending FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json"; // Set Content-Type to JSON
    }

    // Prepare the body for the request, serialized as JSON if it's not FormData
    const bodyData = isFormData ? body : body ? JSON.stringify(body) : null;

    // Request options setup
    const opt = {
      method: method,
      body: bodyData,
      headers: headers,
      cache: "no-store",
      credentials: "include",
    };

    // Ensure you use NEXT_PUBLIC_APP_URL as the base URL
    const url = process.env.NEXT_PUBLIC_APP_URL + path;
    console.log(url);

    // Make the request
    const response = await fetch(url, opt);

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.message || errorResponse.error || "Something went wrong";
      const status = errorResponse.statusCode || response.status;

      const error = new Error(errorMessage);

      error.status = status;
      throw error;
    }

    // Try to parse JSON if response is OK
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json(); // If JSON, parse and return it
    } else {
      // If not JSON, handle accordingly (maybe HTML)
      const text = await response.text();
      console.error("Unexpected response format:", text); // Log the unexpected response format
      throw new Error("Expected JSON response, but got something else.");
    }
  } catch (error) {
    console.error("Request failed:", error); // Log the error
    throw error; // Rethrow the error for the caller to handle
  }
}

export default httpAppRequest;
