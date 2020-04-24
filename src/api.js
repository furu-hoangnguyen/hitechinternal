import axios from "axios";

const BASE_INTANSE = axios.create({
  baseURL: "https://vue-app-demo.herokuapp.com",
});
BASE_INTANSE.defaults.withCredentials = true;
export default BASE_INTANSE;
