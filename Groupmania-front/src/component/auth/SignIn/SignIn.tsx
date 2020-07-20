import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import UIButton from "../../global-component/UIButton";
import {
  IAuthServiceResponse,
  AuthService,
} from "../../../services/AuthServices";

interface ISignInProps {
  onSign: (response: IAuthServiceResponse) => void;
}
interface ISignInState {
  error?: Error;
  username: string;
  password: string;
}

export default class SignIn extends Component<ISignInProps, ISignInState> {
  /**
   *
   */
  constructor(props: ISignInProps) {
    super(props);
    this.state = {
      error: undefined,
      username: "",
      password: "",
    };
    this.handleSign = this.handleSign.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  async handleSign(): Promise<void> {
    const result = await AuthService.loginUser(
      this.state.username,
      this.state.password
    );
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.props.onSign(result);
    }
  }
  async handleEnterPress(
    e: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> {
    if (e.key === "Enter") {
      await this.handleSign();
    }
  }
  handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ username: e.target.value, error: undefined });
  }
  handleChangePassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ password: e.target.value, error: undefined });
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
            value={this.state.password}
            onChange={this.handleChangePassword}
            onKeyPress={this.handleEnterPress}
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
