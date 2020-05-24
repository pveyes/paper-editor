import service from './Service';

class UserService {
  getUserData() {
    // TODO Real API
    return service.getToken();
  }

  isLoggedIn() {
    return service.getToken() !== null;
  }

  register(name, email, password) {
    return service.register(name, email, password);
  }

  login(email, password) {
    return service.auth(email, password);
  }

  logout() {
    service.resetToken();
  }
}

export default new UserService();
