import React from "react";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import "./UIButton.scss";

interface IButtonProps {
  text: string;
  className?: string;
  onClick: () => void | Promise<void>;
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

  handleClick(
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ): void {
    e.preventDefault();
    this.props.onClick();
  }

  render(): JSX.Element {
    const classItem = this.props.className ? " " + this.props.className : "";
    return (
      <button
        className={"bg-light" + classItem}
        style={{ boxShadow: Depths.depth8 }}
        onClick={this.handleClick}
      >
        {this.props.text}
      </button>
    );
  }
}

export default UIButton;
