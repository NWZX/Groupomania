import React, { Component } from "react";
import { Redirect } from "react-router-dom";

interface IProtectedRouteProps {
  isAuth: boolean;
  path: string;
}

class ProtectedRoute extends Component<IProtectedRouteProps> {
  render(): JSX.Element {
    let result;
    if (this.props.isAuth) {
      result = <div className="mx-auto w-100">{this.props.children}</div>;
    } else {
      result = <Redirect to={this.props.path} />;
    }

    return result;
  }
}

export default ProtectedRoute;
