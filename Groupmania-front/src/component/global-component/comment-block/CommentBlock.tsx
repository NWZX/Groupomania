import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import RowFluid from "../RowFluid";

import "./CommentBlock.scss";
import { IComment } from "../../../services/CommentServices";
import { AuthService } from "../../../services/AuthServices";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { MotionAnimations } from "@uifabric/fluent-theme/lib/fluent/FluentMotion";

interface ICommentBlockStates {
  error?: Error;
  username: string;
}

class CommentBlock extends Component<IComment, ICommentBlockStates> {
  /**
   *
   */
  constructor(props: IComment) {
    super(props);

    this.state = {
      error: undefined,
      username: "",
    };
    this.getUsername = this.getUsername.bind(this);
  }
  componentDidMount(): void {
    this.getUsername();
  }

  renderTimestamp(value: number): string {
    const time = Date.now() / 1000 - value;
    if (time < 60) {
      return `${time.toFixed(0)} s`;
    } else if (time < 3600) {
      return `${(time / 60).toFixed(0)} m`;
    } else if (time < 3600 * 24) {
      return `${(time / 3600).toFixed(0)} h`;
    } else {
      return `${(time / 3600 / 24).toFixed(0)} j`;
    }
  }

  async getUsername(): Promise<void> {
    const result = await AuthService.getUser(undefined, this.props.userId);
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ username: result.username });
    }
  }

  render(): JSX.Element {
    return (
      <RowFluid>
        <Container
          fluid
          className="ac-block mx-auto my-4 align-middle"
          style={{
            boxShadow: Depths.depth8,
            animation: MotionAnimations.slideRightIn.replace("100ms", "400ms"),
          }}
        >
          <Row className="justify-content-center">
            <h3 className="col-10 text-justify font-weight-bolder">
              {this.state.username}
            </h3>
          </Row>
          <Row className="justify-content-center">
            <span className="col-10 text-justify font-weight-light">
              {this.renderTimestamp(this.props.timestamp)}
            </span>
          </Row>
          <Row className="row justify-content-center">
            <p className="col-10 text-justify">{this.props.data}</p>
          </Row>
        </Container>
      </RowFluid>
    );
  }
}

export default CommentBlock;
