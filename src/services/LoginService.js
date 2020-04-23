import http from "../http-common";

class LoginService {
  login(data) {
    return http.post("/authenticate", data);
  }


}

export default new LoginService();
