import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import UIButton from "../global-component/UIButton";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

type Props = RouteComponentProps;

class Page404 extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount(): void {
    document.title = "Page 404";
  }
  handleBack(): void {
    this.props.history.push("/");
  }
  render(): JSX.Element {
    return (
      <Container
        className="ac-block align-vertical"
        style={{ boxShadow: Depths.depth8 }}
      >
        <Row>
          <Container className="align-vertical">
            <Row className="justify-content-center">
              <h1 className="h1">404</h1>
            </Row>
            <Row className="justify-content-center">
              <h2>Page not found</h2>
            </Row>
            <Row className="justify-content-center">
              <UIButton
                text="Retour"
                className="col-8"
                onClick={this.handleBack}
              />
            </Row>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default Page404;
