/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */

jest.mock("NativeAnimatedHelper");

jest.mock("TextInput", () => {
  const RealComponent = require.requireActual("TextInput");
  const React = require("React");
  class TextInput extends React.Component {
    blur() {}

    render() {
      return React.createElement("TextInput", this.props, this.props.children);
    }
  }
  TextInput.propTypes = RealComponent.propTypes;
  return TextInput;
});
