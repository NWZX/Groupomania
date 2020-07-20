import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import UIButton from "../../global-component/UIButton";
import { SelectTypes } from "../Auth";
import "./Selector.scss";

interface ISelectorProps {
  onSelect: (state: SelectTypes) => void;
}

class Selector extends React.Component<ISelectorProps> {
  constructor(props: ISelectorProps) {
    super(props);
    this.state = {};
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e: SelectTypes): void {
    this.props.onSelect(e);
  }

  /**
   * render
   */
  public render(): JSX.Element {
    return (
      <Container className="align-vertical">
        <h1 className="text-dark">Groupomania</h1>
        <Row className="justify-content-center">
          <UIButton
            text="Connexion"
            className="col-8"
            onClick={() => {
              this.handleSelect(SelectTypes.SignIn);
            }}
          />
        </Row>
        <Row className="justify-content-center">
          <UIButton
            text="Crée un compte"
            className="col-8"
            onClick={() => {
              this.handleSelect(SelectTypes.SignUp);
            }}
          />
        </Row>
      </Container>
    );
  }
}

export default Selector;
