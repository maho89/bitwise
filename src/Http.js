class Http {
  constructor() {
    this.baseURL = "http://apiserv.bitwise.ge/api/";
  }

  getHeaders(isFormData = false) {
    const headers = new Headers();
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("sessionToken", token);
    }

    if (!isFormData) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  }

  async get(endpoint) {
    return this.request(endpoint, "GET");
  }

  async post(endpoint, data = {}, isFormData = false) {
    return this.request(endpoint, "POST", data, isFormData);
  }

  async request(endpoint, method = "GET", data = null, isFormData = false) {
    const url = this.baseURL + endpoint;
    const headers = this.getHeaders(isFormData);

    const options = {
      method,
      headers,
    };

    if (data && method !== "GET") {
      options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const message = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("Request failed:", error.message);
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }
}


// Vue Plugin
export default {
  install(app) {
    const http = new Http();
    app.config.globalProperties.$http = http;
    app.provide('$http', http);
  }
};
