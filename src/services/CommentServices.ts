import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "store";

export interface IComment {
  id: number;
  userId: number;
  postId: number;
  data: string;
  timestamp: number;
}
interface IAddCommentResponse {
  data: {
    addComment: IComment;
  };
}

export default class CommentServices {
  static async addComment(
    username: string,
    postId: number,
    data: string
  ): Promise<IComment | Error> {
    try {
      const dataQ = JSON.stringify({
        query: `mutation{
            addComment(username: "${username}", postId:${postId}, data:"${data}"){
              id
              userId
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

      const response: AxiosResponse<IAddCommentResponse> = await axios(config);
      return response.data.data.addComment;
    } catch (error) {
      return new Error(error.response.data.errors[0].message);
    }
  }
}
