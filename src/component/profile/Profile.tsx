import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import RowFluid from "../global-component/RowFluid";
import Row from "react-bootstrap/Row";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import UIButton from "../global-component/UIButton";
import { AuthService } from "../../services/AuthServices";
import Alert from "react-bootstrap/Alert";
import store from "store";
import Col from "react-bootstrap/Col";

type IParam = {
  username: string;
};
type IProfileProps = RouteComponentProps<IParam>;
interface IProfileState {
  error?: Error;
  username: string;
  authorization: number;
}

class Profile extends Component<IProfileProps, IProfileState> {
  /**
   *
   */
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      error: undefined,
      username: props.match.params.username,
      authorization: 0,
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount(): void {
    this.getAuthorization();
    document.title = "Profile - Groupomania";
  }
  async getAuthorization(): Promise<void> {
    const result = await AuthService.getUser(this.state.username);
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ authorization: result.authorization });
    }
  }
  renderAuthorization(authorization: number): string {
    switch (authorization) {
      case 1:
        return "Moderateur";

      default:
        return "Utilisateur";
    }
  }
  renderData(): JSX.Element[] | JSX.Element {
    if (!this.state.error) {
      return [
        <Row key={0} className="justify-content-center">
          <p className="col-12 col-sm-3 font-weight-bolder">Utilisateur :</p>
          <p className="col-sm-3">{this.state.username}</p>
        </Row>,
        <Row key={1} className="justify-content-center">
          <p className="col-12 col-sm-3 font-weight-bolder">Status :</p>
          <p className="col-sm-3">
            {this.renderAuthorization(this.state.authorization)}
          </p>
        </Row>,
      ];
    } else {
      return (
        <Row className="justify-content-center">
          <Alert variant="danger">{this.state.error.message}</Alert>
        </Row>
      );
    }
  }
  handleBack(): void {
    this.props.history.push("/");
  }
  handleLogOut(): void {
    store.remove("user");
    store.remove("token");
    store.set("isAuth", false);
    window.location.replace("/");
  }
  async handleDelete(): Promise<void> {
    const result = await AuthService.delUser(this.state.username);
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      if (result) {
        this.props.history.push("/");
      } else {
        this.setState({ error: new Error("Une erreur c'est produite.") });
      }
    }
    this.handleLogOut();
  }

  render(): JSX.Element {
    return (
      <Container fluid className="p-0">
        <RowFluid>
          <Container
            fluid
            className="ac-block align-middle"
            style={{ boxShadow: Depths.depth8 }}
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
                Profile
              </h1>
            </Row>
          </Container>
        </RowFluid>
        <div style={{ marginTop: "4vh" }}></div>
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            {this.renderData()}
          </Container>
        </RowFluid>
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            {(this.state.username === store.get("user", "") && (
              <Row className="justify-content-center">
                <Col sm={6}>
                  <UIButton
                    text="Deconnexion"
                    className="col-8"
                    onClick={this.handleLogOut}
                  />
                </Col>
                <Col sm={6}>
                  <UIButton
                    text="Supprimer votre compte"
                    className="col-8"
                    onClick={this.handleDelete}
                  />
                </Col>
              </Row>
            )) ||
              null}
          </Container>
        </RowFluid>
      </Container>
    );
  }
}

export default Profile;
