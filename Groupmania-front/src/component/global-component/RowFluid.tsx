import React, { Component } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRowFluidProps {
  className?: string;
}

class RowFluid extends Component<IRowFluidProps> {
  render(): JSX.Element {
    const classItem = this.props.className ? " " + this.props.className : "";
    return <div className={"row-fluid" + classItem}>{this.props.children}</div>;
  }
}

export default RowFluid;
