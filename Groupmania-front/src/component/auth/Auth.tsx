import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import "./Auth.scss";

import logo from "../../ressource/logo_128.png";

import Selector from "./Selector/Selector";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import { IAuthServiceResponse } from "../../services/AuthServices";

export enum SelectTypes {
  "SignIn",
  "SignUp",
  "Empty",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ILoginProps {
  onAuth: (response: IAuthServiceResponse) => void;
}
interface ILoginStates {
  selection: SelectTypes;
}

class Auth extends React.Component<ILoginProps, ILoginStates> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      selection: SelectTypes.Empty,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }
  componentDidMount(): void {
    document.title = "SignIn/SignUp";
  }

  handleSelection(e: SelectTypes): void {
    this.setState({ selection: e });
  }
  handleSignIn(response: IAuthServiceResponse): void {
    this.props.onAuth(response);
  }
  handleSignUp(response: IAuthServiceResponse): void {
    this.props.onAuth(response);
  }
  renderSelected(selection: SelectTypes): JSX.Element {
    switch (selection) {
      case SelectTypes.SignIn:
        return <SignIn onSign={this.handleSignIn} />;
      case SelectTypes.SignUp:
        return <SignUp onSign={this.handleSignUp} />;
      default:
        return <Selector onSelect={this.handleSelection} />;
    }
  }
  render(): JSX.Element {
    return (
      <Container
        className="ac-block align-vertical"
        style={{ boxShadow: Depths.depth8 }}
      >
        <Row>
          <img
            className="m-auto"
            src={logo}
            alt=""
            width="100px"
            height="100px"
          ></img>
        </Row>
        <Row>{this.renderSelected(this.state.selection)}</Row>
      </Container>
    );
  }
}

export default Auth;
