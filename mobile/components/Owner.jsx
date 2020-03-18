import React, { Component } from 'react';
import { View, StyleSheet, Switch, Text, YellowBox, Image, Picker } from 'react-native';
import { HOST } from 'react-native-dotenv';
import io from 'socket.io-client';
import { Header, Icon, Button } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export default class Owner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: false,
      location: null,
      loading: false,
      sideMenuView: false,
      name: '',
      businesses: [],
      selected: 0,
      liveTruck: ''
    }

    this.socket = io.connect(`${HOST}`, { transports: ['websocket'] })

    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ])
  }

  componentDidMount() {
    const self = this;
    axios.get(`${HOST}/api/Owners/${this.props.userId}`)
      .then(res => self.setState({ name: res.data.name }))
    axios.get(`${HOST}/api/Owners/${this.props.userId}/businesses`)
      .then(res => {
        self.setState({
          businesses: res.data
        }, this.socketCheck)
      })
  }

  socketCheck() {
    this.socket.emit('checkPosition', this.state.businesses.map(business => business.id))

    this.socket.on('checkPosition', liveTruck => {
      console.log(liveTruck);
      this.setState({
        location: {
          latitude: liveTruck[0].latitude,
          longitude: liveTruck[0].longitude
        },
        switchValue: true,
        loading: true,
        selected: liveTruck[0].selected,
        liveTruck: liveTruck[0].businessIds
      })
    })
  }

  connectSocket() {
    this.socket.emit('position', this.state.location, { businessIds: this.state.businesses[this.state.selected].id }, { selected: this.state.selected });
    this.socket.on('position', () => this.setState({ loading: true, liveTruck: this.state.businesses[this.state.selected].id }));
  }

  socketSwitch() {
    if (this.state.switchValue) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }, this.connectSocket);
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 }
      );
    } else {
      this.socket.emit('disconnectUser', this.state.liveTruck)
      this.socket.on('disconnectUser', () => this.setState({ loading: false }))
    }
  }

  handleToggleSwitch = newState => this.setState(newState, this.socketSwitch);
  toggleSideMenu = sideMenuView => this.setState({ sideMenuView: !sideMenuView })
  
  logOut() {
    axios.post(`${HOST}/api/Owners/logout?access_token=${this.props.token}`)
    .then(res => {
      this.socketCheck;
      this.socket.emit('disconnectUser', this.state.liveTruck);
      this.goToLogin();
    })
  }

  goToLogin = () => Actions.login();
  goToSettings = () => Actions.ownerSettings();

  render() {
    let count = 0

    return (
      <View style={styles.container}>
        <Header
          containerStyle={{
            backgroundColor: '#980000',
            justifyContent: 'space-around',
          }}
          leftComponent={<Icon
            name='menu'
            onPress={() => this.toggleSideMenu(this.state.sideMenuView)}
          />}
          centerComponent={{ style: { color: '#fff', fontSize: 20 }, text: this.state.name }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        {this.state.sideMenuView ?
          <View style={styles.menu}>
            <Button title="Settings" onPress={() => this.goToSettings()} buttonStyle={{ backgroundColor: '#980000' }} />
            <Button title="Logout" onPress={() => this.logOut()} buttonStyle={{ backgroundColor: '#980000' }} />
          </View>
          : <View></View>}
        <View>
          <Image
            style={styles.image}
            source={this.state.businesses.length > 0 ? { uri: (this.state.businesses[this.state.selected]).image } : { uri: 'You dont have an image' }} />
        </View>
        {this.state.loading ?
          <View  style={{ height: 50, width: '75%' }}></View> :
          <Picker
            selectedValue={this.state.selected}
            style={{ height: 50, width: '75%' }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selected: itemValue })
            }>
            {this.state.businesses.map(business => {
              { count++ }
              return (
                <Picker.Item label={business.name} value={count - 1} key={count} />
              )
            })}
          </Picker>
        }
        <View style={styles.switch}>
          <Text style={ styles.switchButtonText }>Broadcast Food Truck</Text>
          <Switch
            onValueChange={(value) => this.handleToggleSwitch({ switchValue: value })}
            value={this.state.switchValue}
            trackColor={'orange'}
          />
        </View>
        {this.state.loading ?
          <Text style={styles.online}>{this.state.businesses.length > 0 ?`${this.state.businesses[this.state.selected].name} is online`: ''}</Text>
          :
          <Text style={styles.offline}>{this.state.businesses.length > 0 ?`${this.state.businesses[this.state.selected].name} is offline`: ''}</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffe599',
  },
  online: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 80

  },
  offline: {
    color: '#980000',
    fontWeight: 'bold',
    fontSize: 25,
    justifyContent: 'space-between',
    marginTop: 80

  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 170
  },
  menu: {
    backgroundColor: '#980000',
    alignSelf: 'stretch',
  
  },
  image: {
    width: 500,
    height: 300,
  },
  switchButtonText: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 20
  }
})
