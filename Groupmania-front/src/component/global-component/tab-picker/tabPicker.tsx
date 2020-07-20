import React from "react";

interface IReactPickerProps {
  elementList: string[];
  ClassName?: string;
  onChange?: (id: number) => void;
}
interface IReactPickerStates {
  numberOfElement: number;
  elementPicked: number;
}

class TabPicker extends React.Component<IReactPickerProps, IReactPickerStates> {
  constructor(props: IReactPickerProps) {
    super(props);
    this.state = {
      numberOfElement: props.elementList.length,
      elementPicked: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id: number): void {
    this.setState({ elementPicked: id });
    if (this.props.onChange) {
      this.props.onChange(id);
    }
  }

  generateTab(id: number, name: string, selected: boolean): JSX.Element {
    if (selected) {
      return (
        <a
          className="flex-column mx-3 font-weight-bolder active"
          href="/#"
          key={id}
          onClick={() => {
            this.handleClick(id);
          }}
        >
          {name}
        </a>
      );
    } else {
      return (
        <a
          className="flex-column mx-3 font-weight-bolder"
          href="/#"
          key={id}
          onClick={() => {
            this.handleClick(id);
          }}
        >
          {name}
        </a>
      );
    }
  }
  generateList(): JSX.Element[] {
    const result = [];
    for (let index = 0; index < this.state.numberOfElement; index++) {
      const element = this.props.elementList[index];

      if (index === this.state.elementPicked)
        result.push(this.generateTab(index, element, true));
      else result.push(this.generateTab(index, element, false));
    }
    return result;
  }

  render(): JSX.Element {
    if (this.props.ClassName) {
      return <div className={this.props.ClassName}>{this.generateList()}</div>;
    } else {
      return <div>{this.generateList()}</div>;
    }
  }
}

export default TabPicker;
