import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FeedBlockContentType } from "../../../models/FeedBlock";
import RowFluid from "../RowFluid";

import "./FeedBlock.scss";
import UIButton from "../UIButton";
import { IPost, PostServices } from "../../../services/PostServices";
import * as H from "history";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { MotionAnimations } from "@uifabric/fluent-theme/lib/fluent/FluentMotion";
import store from "store";
interface IButtonSelect {
  edit: boolean;
  delete: boolean;
  comment: boolean;
}
interface IFeedBlock extends IPost {
  history: H.History<H.LocationState>;
  showButton: IButtonSelect;
  onDelete?: (id: number) => void;
}
interface IFeedBlockState {
  error?: Error;
}

class FeedBlock extends Component<IFeedBlock, IFeedBlockState> {
  /**
   *
   */
  constructor(props: IFeedBlock) {
    super(props);
    this.state = {
      error: undefined,
    };
    this.handleButtonEdit = this.handleButtonEdit.bind(this);
    this.handleButtonPost = this.handleButtonPost.bind(this);
    this.handleButtonDel = this.handleButtonDel.bind(this);
  }

  async handleButtonEdit(): Promise<void> {
    this.props.history.push(`/editPost/${this.props.id}`);
  }
  async handleButtonPost(): Promise<void> {
    this.props.history.push(`/post/${this.props.id}`);
  }
  async handleButtonDel(): Promise<void> {
    const result = await PostServices.delPost(
      this.props.id,
      store.get("user", "")
    );
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      if (result) {
        if (this.props.onDelete) {
          this.props.onDelete(this.props.id);
        } else {
          this.props.history.push("/");
        }
      } else {
        this.setState({ error: new Error("Une erreur c'est produite.") });
      }
    }
  }

  commentNumberConvert(value: number): string {
    if (value > 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value > 1000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return value.toString();
    }
  }

  renderTimestamp(value: number): string {
    const time = Date.now() / 1000 - value;
    if (time < 60) {
      return `${time.toFixed(0)} sec`;
    } else if (time < 3600) {
      return `${(time / 60).toFixed(0)} min`;
    } else if (time < 3600 * 24) {
      return `${(time / 3600).toFixed(0)} heure`;
    } else {
      return `${(time / 3600 / 24).toFixed(0)} jour`;
    }
  }
  renderByType(type: FeedBlockContentType): JSX.Element {
    switch (type) {
      case FeedBlockContentType.Text:
        return <p className="col-10">{this.props.data}</p>;
      case FeedBlockContentType.Image:
        return <img className="img-fluid col-10" src={this.props.url} alt="" />;
      case FeedBlockContentType.Video:
        return (
          <video
            className="embed-responsive col-10"
            src={this.props.url}
          ></video>
        );
      default:
        return <p>{"Content type error"}</p>;
    }
  }
  renderButton(showButton: IButtonSelect): JSX.Element {
    const cm_nb = this.props.commentsNumber ? this.props.commentsNumber : 0;
    const editButton = !showButton.edit ? null : (
      <Col>
        <UIButton
          text={"🖋 Editer"}
          className="mx-0 col-12"
          onClick={this.handleButtonEdit}
        />
      </Col>
    );
    const delButton = !showButton.delete ? null : (
      <Col>
        <UIButton
          text={"🗑 Effacer"}
          className="mx-0 col-12"
          onClick={this.handleButtonDel}
        />
      </Col>
    );
    const commentButton = !showButton.comment ? null : (
      <Col>
        <UIButton
          text={"💬" + this.commentNumberConvert(cm_nb)}
          className="mx-0 col-12"
          onClick={this.handleButtonPost}
        />
      </Col>
    );

    return (
      <Row className="justify-content-center space-row">
        {editButton}
        {commentButton}
        {delButton}
      </Row>
    );
  }

  render(): JSX.Element {
    return (
      <RowFluid>
        <Container
          fluid
          className="ac-block mx-auto my-4 align-middle"
          style={{
            boxShadow: Depths.depth8,
            animation: MotionAnimations.slideDownIn.replace("100ms", "400ms"),
          }}
        >
          <Row className="justify-content-center">
            <h2 className="col-10 text-center font-weight-bolder">
              {this.props.title}
            </h2>
            <p className="col-10 text-center">
              <em className="small">
                Envoyer par <strong>{this.props.user.username}</strong>, il y a{" "}
                {this.renderTimestamp(this.props.timestamp)}
              </em>
            </p>
          </Row>
          <Row className="justify-content-center">
            {this.renderByType(this.props.type)}
          </Row>
          {this.renderButton(this.props.showButton)}
        </Container>
      </RowFluid>
    );
  }
}

export default FeedBlock;
