import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Joystick } from 'react-joystick-component';
import './Gamepad.css';

class Gamepad extends Component {

  handleEvent(event) {
    const {handleEvent} = this.props;

    var output = {
      i: 'joystick', // input
      d: typeof event.direction === 'string' ? event.direction.substring(0, 1) : 'S',
      x: this.convertCoord(event.x),
      y: this.convertCoord(event.y)
    }
 
    handleEvent(output);
  }
  
  /**
   * Converts the raw joystick values to 0-1024 range with neutral being (512,512)
   * @param {integer} input 
   */
  convertCoord(input) {
    const {size} = this.props;
    // const divisor = 2 * (size / 100);
    const divisor = 2; // [TODO] FIGURE OUT THIS MATH!
    console.log(divisor);
    return Math.round((input + size/divisor)/2 / 100 * 1024);
  }

  render() {

    const {size} = this.props;

    return (
      <div className="gamepad">
        <Joystick
          size={size}
          baseColor="#999"
          stickColor="#282c34"
          move={this.handleEvent.bind(this)}
          stop={this.handleEvent.bind(this)}
        />
      </div>
    )
  }
}

Gamepad.defaultProps = {
  size: 200,
};

Gamepad.propTypes = {
  size: PropTypes.number,
  handleEvent: PropTypes.func,
};

export default Gamepad;