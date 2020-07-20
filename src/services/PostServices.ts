import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "store";
import { IComment } from "./CommentServices";

export interface IPost {
  id: number;
  user: {
    username: string;
  };
  type: number;
  categorie: string;
  title: string;
  url: string;
  data: string;
  timestamp: number;
  editUserId?: number;
  editTimestamp?: number;
  commentsNumber?: number;
  comments?: IComment[];
}
interface IPostsResponse {
  data: {
    posts: IPost[];
  };
}
interface IPostResponse {
  data: {
    post: IPost;
  };
}
interface IDelPostResponse {
  data: {
    delPost: boolean;
  };
}

export class PostServices {
  static async getPosts(
    limit?: number,
    timestamp?: number
  ): Promise<IPost[] | Error> {
    try {
      let param = "";
      if (limit && timestamp) {
        param = `(limit: ${limit}, timestamp: ${timestamp})`;
      } else if (limit && !timestamp) {
        param = `(limit: ${limit})`;
      } else if (!limit && timestamp) {
        param = `(timestamp: ${timestamp})`;
      }

      const data = JSON.stringify({
        query: `{
            posts${param}{
              id
              user{
                  username
              }
              title
              type
              categorie
              data
              url
              timestamp
              commentsNumber
            }
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: "http://localhost:4000/graphql",
        headers: {
          Authorization: `Bearer ${store.get("token", "")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<IPostsResponse> = await axios(config);
      return response.data.data.posts;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
  static async getPost(id: number): Promise<IPost | Error> {
    try {
      const data = JSON.stringify({
        query: `{
            post(id: ${id}){
              id
              title
              user {
                  username
              }
              type
              categorie
              data
              url
              timestamp
              comments{
                id  
                userId
                data
                timestamp
              }
            }
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: "http://localhost:4000/graphql",
        headers: {
          Authorization: `Bearer ${store.get("token", "")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<IPostResponse> = await axios(config);
      return response.data.data.post;
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
  static async addPost(
    username: string,
    type: number,
    categorie: string,
    title: string,
    data: string,
    file?: File
  ): Promise<IPost | Error> {
    try {
      let next = {
        result: true,
        fileUrl: "",
      };

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const configFile: AxiosRequestConfig = {
          method: "post",
          url: "http://localhost:4000/upload",
          headers: {
            Authorization: `Bearer ${store.get("token", "")}`,
          },
          data: formData,
        };
        const response: AxiosResponse<{
          result: boolean;
          fileUrl: string;
        }> = await axios(configFile);
        next = response.data;
      }

      if (next.result) {
        const dataQ = JSON.stringify({
          query: `mutation{
            addPost(username: "${username}", type:${type}, categorie:"${categorie}", title:"${title}", url:"${next.fileUrl}", data:"${data}"){
              id
              title
              type
              categorie
              url
              data
              timestamp
            }
        }`,
          variables: {},
        });
        console.log({ dataQ });

        const config: AxiosRequestConfig = {
          method: "post",
          url: "http://localhost:4000/graphql",
          headers: {
            Authorization: `Bearer ${store.get("token", "")}`,
            "Content-Type": "application/json",
          },
          data: dataQ,
        };

        const response: AxiosResponse<IPostResponse> = await axios(config);
        return response.data.data.post;
      }

      throw new Error("File upload error");
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }
  static async editPost(
    id: number,
    username: string,
    type: number,
    categorie: string,
    title: string,
    url: string,
    data: string,
    file?: File
  ): Promise<IPost | Error> {
    try {
      let next = {
        result: true,
        fileUrl: url,
      };

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const configFile: AxiosRequestConfig = {
          method: "post",
          url: "http://localhost:4000/upload",
          headers: {
            Authorization: `Bearer ${store.get("token", "")}`,
          },
          data: formData,
        };
        const response: AxiosResponse<{
          result: boolean;
          fileUrl: string;
        }> = await axios(configFile);
        next = response.data;
      }

      if (next.result) {
        const dataQ = JSON.stringify({
          query: `mutation{
            editPost(id: ${id}, username: "${username}", type:${type}, categorie:"${categorie}", title:"${title}", url:"${next.fileUrl}", data:"${data}"){
              id
              title
              type
              categorie
              url
              data
              timestamp
            }
        }`,
          variables: {},
        });

        const config: AxiosRequestConfig = {
          method: "post",
          url: "http://localhost:4000/graphql",
          headers: {
            Authorization: `Bearer ${store.get("token", "")}`,
            "Content-Type": "application/json",
          },
          data: dataQ,
        };

        const response: AxiosResponse<IPostResponse> = await axios(config);
        return response.data.data.post;
      }
      throw new Error("File upload error");
    } catch (error) {
      checkAuth(error);
      return new Error(error.response.data.errors[0].message);
    }
  }

  static async delPost(id: number, username: string): Promise<boolean | Error> {
    try {
      const data = JSON.stringify({
        query: `mutation{
            delPost(id: ${id}, username: "${username}")
        }`,
        variables: {},
      });

      const config: AxiosRequestConfig = {
        method: "post",
        url: "http://localhost:4000/graphql",
        headers: {
          Authorization: `Bearer ${store.get("token", "")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response: AxiosResponse<IDelPostResponse> = await axios(config);
      return response.data.data.delPost;
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
