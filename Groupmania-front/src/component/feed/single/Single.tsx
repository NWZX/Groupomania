import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import RowFluid from "../../global-component/RowFluid";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { PostServices, IPost } from "../../../services/PostServices";

import FeedBlock from "../../global-component/feed-block/FeedBlock";
import { RouteComponentProps, Redirect } from "react-router-dom";
import UIButton from "../../global-component/UIButton";
import CommentBlock from "../../global-component/comment-block/CommentBlock";
import CommentServices from "../../../services/CommentServices";

import store from "store";
import { AuthService, IUser } from "../../../services/AuthServices";

type IParam = {
  postId: string;
};

interface ISingleStates {
  id: number;
  data?: IPost;
  error?: Error;
  commentText: string;
  user?: IUser;
}

class Single extends React.Component<
  RouteComponentProps<IParam>,
  ISingleStates
> {
  constructor(props: RouteComponentProps<IParam>) {
    super(props);
    this.state = {
      id: Number.parseFloat(props.match.params.postId),
      data: undefined,
      error: undefined,
      commentText: "",
      user: undefined,
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.getUser = this.getUser.bind(this);
    window.onscroll = () => {
      const header = document.getElementById("header");
      if (header) {
        if (window.pageYOffset - 30 > header.offsetTop) {
          header.classList.add("stick");
        } else {
          header.classList.remove("stick");
        }
      }
    };
  }

  componentDidMount(): void {
    document.title = "Post - Groupomania";
    this.getUser();
    this.getData(this.state.id);
  }

  async getData(id: number): Promise<void> {
    const result = await PostServices.getPost(id);
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ data: result });
    }
  }
  async getUser(): Promise<void> {
    const result = await AuthService.getUser(store.get("user", ""));
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ user: result });
    }
  }

  renderData(): JSX.Element | null {
    const e = this.state.data;
    if (e) {
      const check =
        typeof this.state.user !== "undefined" &&
        (this.state.user.authorization === 1 ||
          this.state.user.username === e.user.username);
      return (
        <FeedBlock
          history={this.props.history}
          showButton={{
            edit: check,
            comment: false,
            delete: check,
          }}
          id={e.id}
          user={e.user}
          title={e.title}
          data={e.data}
          url={e.url}
          type={e.type}
          timestamp={e.timestamp}
          categorie={e.categorie}
        />
      );
    }
    if (this.state.error) {
      return <Redirect to="/404" />;
    }
    return null;
  }
  renderComment(): JSX.Element[] | null {
    const e = this.state.data;
    if (e) {
      const comments: JSX.Element[] = [];
      if (e.comments) {
        for (let i = 0; i < e.comments.length; i++) {
          const c = e.comments[i];
          comments.push(<CommentBlock key={i} {...c} />);
        }
        return comments;
      }
    }
    return null;
  }

  handleBack(): void {
    this.props.history.push("/");
  }
  handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ commentText: e.target.value });
  }
  async handleNewComment(): Promise<void> {
    if (this.state.data) {
      const username: string = store.get("user", "");
      const result = await CommentServices.addComment(
        username,
        this.state.data.id,
        this.state.commentText
      );
      if (result instanceof Error) {
        this.setState({ error: result });
      } else {
        const temp = this.state.data;
        temp.comments?.push(result);
        this.setState({ data: temp, commentText: "" });
      }
    }
  }

  render(): JSX.Element {
    return (
      <Container fluid className="p-0">
        <RowFluid>
          <Container
            fluid
            className="ac-block align-middle"
            style={{ boxShadow: Depths.depth8 }}
            id="header"
          >
            <Row className="justify-content-center">
              <div className="col-4 p-0">
                <UIButton
                  text="Back"
                  onClick={this.handleBack}
                  className="m-0 col-8"
                ></UIButton>
              </div>
              <h1 className="col-8 p-0 text-justify m-0 align-vertical">
                Groupomania
              </h1>
            </Row>
          </Container>
        </RowFluid>
        <div style={{ marginTop: "4vh" }}></div>
        {this.renderData()}
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            <Row className="justify-content-center">
              <label htmlFor="comment" className="font-weight-bolder">
                Vous souhaiter réagire ?{" "}
              </label>
            </Row>
            <Row className="justify-content-center">
              <textarea
                className="col-8"
                id="comment"
                onChange={this.handleTextChange}
                value={this.state.commentText}
                placeholder="Texte (3-300 character)"
              ></textarea>
            </Row>
            <Row className="justify-content-center">
              <UIButton
                text="Envoyer"
                className="col-8"
                onClick={this.handleNewComment}
              />
            </Row>
          </Container>
        </RowFluid>
        {this.renderComment()}
      </Container>
    );
  }
}

export default Single;
