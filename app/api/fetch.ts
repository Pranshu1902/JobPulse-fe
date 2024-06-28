import { backendBaseURL } from "@constants/constants";
import { NotificationManager } from "react-notifications";

type methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// main request function
export async function request(
  method: methods = "GET",
  data: any = {},
  endpoint: string,
  token?: string
) {
  let url;
  let payload: string;

  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join("&")}`
      : "";
    url = `${backendBaseURL}${endpoint}${requestParams}`;
    payload = "";
  } else {
    url = `${backendBaseURL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }

  // Token Authentication
  const auth = token ? "Token " + token : "";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: method !== "GET" ? payload : null,
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      const errorJson = await response.json();

      if (errorJson.detail === "Invalid token.") {
        return errorJson;
      }

      const result = Object.entries<string[]>(errorJson)
        .map(
          ([key, value]) =>
            `${key}: ${value.map((msg) => `'${msg}'`).join(" ")}`
        )
        .join(", ");
      NotificationManager.error(result, "Error");

      return errorJson;
    }
  } catch (error) {
    return error;
  }
}
