import React from 'react';
import { StyleSheet, View } from "react-native";
import { Header, Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class CustomerSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideMenuView: false,
    }
  }

  toggleSideMenu= sideMenuView => this.setState({ sideMenuView: !sideMenuView });
  goToMap = token => Actions.map({ token: token });

  render() {
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
          rightComponent={<Icon
            name='home'
            onPress={() => this.goToMap(this.props.token)}
          />}
        />
        {this.state.sideMenuView ?
          <View style={styles.menu}>
            <Button title="Settings" buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
            <Button title="Logout" buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
          </View>
          : <View></View>}
        <View></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe599',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#980000',
    alignSelf: 'stretch',
  },
});
