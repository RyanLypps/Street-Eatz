import React, { Component } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import { HOST } from 'react-native-dotenv';
import io from 'socket.io-client';

export default class Owner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: false
    }
  }

  socketSwitch() {
    if (this.state.switchValue) {
      const socket = io.connect(`${HOST}`, {
        transports: ['websocket']
      })
      socket.on('connect', () => {
        alert('Your Food Truck is online!');
      })
      this.setState({ socket });
    } else {
      const { socket } = this.state;
      socket.disconnect();
      alert('Your Food Truck is offline!');
    }
  }

  handleToggleSwitch = newState => this.setState(newState, this.socketSwitch);
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Broadcast Food Truck</Text>
        <Switch
          onValueChange={(value) => this.handleToggleSwitch({ switchValue: value })}
          value={this.state.switchValue}
          trackColor={'orange'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
})
