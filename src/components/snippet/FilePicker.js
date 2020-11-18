import React, { PureComponent } from 'react';

export default class FilePicker extends PureComponent {
  constructor() {
    super();
    this.state = {
      key: 0,
    };
  }

  handleChange = () => {
    this.props.onChange(this.refs.file.files[0]);
    this.setState({
      key: this.state.key + 1,
    });
  };

  render() {
    return (
      <label>
        {this.props.children}
        <input
          type='file'
          key={this.state.key}
          ref='file'
          onChange={this.handleChange}
          style={{ display: 'none' }}
          accept='audio/mp3,audio/wav'
        />
      </label>
    );
  }

  static defaultProps = {
    onChange() {},
  };
}
