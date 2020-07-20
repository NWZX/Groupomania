import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import UIButton from "../../global-component/UIButton";
import {
  AuthService,
  IAuthServiceResponse,
} from "../../../services/AuthServices";

interface ISignUpProps {
  onSign: (response: IAuthServiceResponse) => void;
}
interface ISignUpState {
  error?: Error;
  username: string;
  password_1: string;
  password_2: string;
}

export default class SignUp extends Component<ISignUpProps, ISignUpState> {
  /**
   *
   */
  constructor(props: ISignUpProps) {
    super(props);
    this.state = {
      error: undefined,
      username: "",
      password_1: "",
      password_2: "",
    };
    this.handleSign = this.handleSign.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword_1 = this.handleChangePassword_1.bind(this);
    this.handleChangePassword_2 = this.handleChangePassword_2.bind(this);
  }

  async handleSign(): Promise<void> {
    if (this.state.password_1 !== this.state.password_2) {
      this.setState({ error: new Error("Unmatch password") });
    } else {
      const result = await AuthService.createUser(
        this.state.username,
        this.state.password_1
      );
      if (result instanceof Error) {
        this.setState({ error: result });
      } else {
        this.props.onSign(result);
      }
    }
  }
  handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ username: e.target.value, error: undefined });
  }
  handleChangePassword_1(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ password_1: e.target.value, error: undefined });
  }
  handleChangePassword_2(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ password_2: e.target.value });
    if (e.target.value !== "" && this.state.password_1 !== e.target.value) {
      this.setState({ error: new Error("Unmatch password") });
    } else {
      this.setState({ error: undefined });
    }
  }

  renderError(): JSX.Element | null {
    if (this.state.error) {
      return (
        <Row className="justify-content-center">
          <Alert variant="danger">{this.state.error.message}</Alert>
        </Row>
      );
    } else {
      return null;
    }
  }

  render(): JSX.Element {
    return (
      <Container className="align-vertical">
        {this.renderError()}
        <Row className="justify-content-center">
          <input
            type="text"
            id="username"
            className="col-8"
            placeholder="Nom d'utilisateur"
            value={this.state.username}
            onChange={this.handleChangeUsername}
          />
        </Row>
        <Row className="justify-content-center">
          <input
            type="password"
            id="password"
            className="col-8"
            placeholder="Mot de passe"
            value={this.state.password_1}
            onChange={this.handleChangePassword_1}
          />
        </Row>
        <Row className="justify-content-center">
          <input
            type="password"
            id="password-confirmation"
            className="col-8"
            placeholder="Confirmer le mot de passe"
            value={this.state.password_2}
            onChange={this.handleChangePassword_2}
          />
        </Row>
        <Row className="justify-content-center">
          <UIButton
            text="Valider"
            className="col-8"
            onClick={this.handleSign}
          />
        </Row>
      </Container>
    );
  }
}
