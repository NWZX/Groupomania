import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "store";

const host = "http://207.180.251.133:5000";

export interface IAuthServiceResponse {
  token: string;
  username: string;
}
interface ICreateUserResponse {
  data: {
    createUser: IAuthServiceResponse;
  };
}
interface ILoginUserResponse {
  data: {
    loginUser: IAuthServiceResponse;
  };
}
interface IGetUserResponse {
  data: {
    user: IUser;
  };
}
interface IDelUserResponse {
  data: {
    delUser: boolean;
  };
}
export interface IUser {
  id: number;
  username: string;
  authorization: number;
}

export class AuthService {
  static async getUser(
    username?: string,
    userId?: number
  ): Promise<IUser | Error> {
    try {
      let param = "";
      if (!username && !userId) {
        param = ``;
      } else if (username) {
        param = `(username: "${username}")`;
      } else if (userId) {
        param = `(userId: ${userId})`;
      }
      const data = JSON.stringify({
        query: `{
            user${param}{
              id
              username
              authorization
            }
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: host + "/graphql",
        headers: {
          Authorization: `Bearer ${store.get("token", "")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<IGetUserResponse> = await axios(config);
      return response.data.data.user;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
  static async createUser(
    username: string,
    password: string
  ): Promise<IAuthServiceResponse | Error> {
    try {
      const data = JSON.stringify({
        query: `mutation{
            createUser(username: "${username}", password: "${password}"){
              token
              username
            }
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: host + "/graphql",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<ICreateUserResponse> = await axios(config);
      return response.data.data.createUser;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }

  static async loginUser(
    username: string,
    password: string
  ): Promise<IAuthServiceResponse | Error> {
    try {
      const data = JSON.stringify({
        query: `mutation{
            loginUser(username: "${username}", password: "${password}"){
              token
              username
            }
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: host + "/graphql",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<ILoginUserResponse> = await axios(config);
      return response.data.data.loginUser;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
  static async delUser(username: string): Promise<boolean | Error> {
    try {
      const data = JSON.stringify({
        query: `mutation{
            delUser(username: "${username}")
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: host + "/graphql",
        headers: {
          Authorization: `Bearer ${store.get("token", "")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<IDelUserResponse> = await axios(config);
      return response.data.data.delUser;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
}
function checkAuth(error: any) {
  if (error.request.status === 401) {
    store.remove("user");
    store.remove("token");
    store.set("isAuth", false);
    window.location.replace("/");
  }
}
