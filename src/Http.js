class Http {
  constructor() {
    this.baseURL = "http://apiserv.bitwise.ge/api/";
    this.defaultHeaders = new Headers({
      "Content-Type": "application/json"
    });

    const token = localStorage.getItem("token");
    if (token) {
      this.defaultHeaders.set("sessionToken", `${token}`);
    }
  }

  async get(endpoint) {
    return this.request(endpoint, "GET");
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, "POST", data);
  }

  async request(endpoint, method = "GET", data = null) {
    const url = this.baseURL + endpoint;

    const options = {
      method,
      headers: this.defaultHeaders,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const message = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      return await response.json();
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
