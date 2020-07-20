import React, { MouseEvent } from "react";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

interface IButtonProps {
  text: string;
  onClick: () => void;
}

class UIButton extends React.Component<IButtonProps> {
  /**
   *
   */
  constructor(props: IButtonProps) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: MouseEvent): void {
    e.preventDefault();
    this.props.onClick();
  }

  render(): JSX.Element {
    return (
      <button
        className="col-8 bg-light"
        style={{ boxShadow: Depths.depth8 }}
        onClick={this.handleClick}
      >
        {this.props.text}
      </button>
    );
  }
}

export default UIButton;
