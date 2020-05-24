import qs from 'qs';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Charset: 'utf-8',
};

const TOKEN_KEY = 'paper-token';

class Service {
  constructor() {
    this._host = process.env.REACT_APP_API_HOST || 'http://localhost:4000';
  }

  getToken() {
    return 'TEST';
  }

  setToken(token) {
    return localStorage.setItem(TOKEN_KEY, token);
  }

  resetToken() {
    return localStorage.removeItem(TOKEN_KEY);
  }

  async get(path, query) {
    const options = { method: 'GET' };
    return await this.request(path, options, query);
  }

  async post(path, body, query) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    return await this.request(path, options, query);
  }

  async delete(path, body, query) {
    const options = {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
    };

    return await this.request(path, options, query);
  }

  async auth(email, password) {
    const endpoint = `${this._host}/user/login`;
    const options = {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email, password }),
    };
    const response = await fetch(endpoint, options);
    const { id: token, type } = await response.json();
    const validLogin = type === 'read-write';

    if (validLogin) {
      // We should have a write access to perform our next operations
      this.setToken(token);
    }

    return validLogin;
  }

  async register(name, email, password) {
    const endpoint = `${this._host}/user/register`;
    const options = {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ name, email, password }),
    };

    const response = await fetch(endpoint, options);
    const { token, status, error } = await response.json();

    if (token) {
      this.setToken(token);
    }

    return { status, error };
  }

  async request(path, options, query) {
    if (!this.getToken()) {
      // We can't do anything since we don't have token. Let the component
      // handle reauthorization logic
      throw new Error('No token found');
    }

    const endpoint = this.getParsedUrl(path, query);
    const response = await fetch(endpoint, options);
    const res = await response.json();

    if (res.status === 'failed' && res.error.match(/not authorized/i)) {
      this.resetToken();
      throw new Error('Token expired');
    }

    return res;
  }

  // Wrap API endpoint with token query string
  getParsedUrl(path, query = {}) {
    const absolutePath = path.charAt(0) === '/' ? path : `/${path}`;

    const queryString = qs.stringify(
      Object.assign(query, { token: this.getToken() }),
    );
    return `${this._host}${absolutePath}?${queryString}`;
  }
}

export default new Service();
