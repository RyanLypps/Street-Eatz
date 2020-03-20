import React from 'react';
import { StyleSheet, View } from "react-native";
import { Header, Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class OwnerSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideMenuView: false,
    }
  }

  toggleSideMenu = sideMenuView =>  this.setState({ sideMenuView: !sideMenuView });
  goToOwner = (token, userId, businessIds) => Actions.owner({ token: token, userId: userId, businessIds: businessIds });
  goToOwnerMap = (token, userId, businessIds) => Actions.ownerMap({ token: token, userId: userId, businessIds: businessIds });

  goToOwner = (token, userId, businessIds) => Actions.owner({ token: token, userId: userId, businessIds: businessIds });
  goToOwnerMap = (token, userId, businessIds) => Actions.ownerMap({ token: token, userId: userId, businessIds: businessIds });

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
            onPress={() => this.goToOwnerMap(this.props.token, this.props.userId, this.props.businessIds)}
          />}
        />
        {this.state.sideMenuView ?
          <View style={styles.menu}>
            <Button title="Broadcast" onPress={() => this.goToOwner(this.props.token, this.props.userId, this.props.businessIds)} buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
            <Button title="Settings" buttonStyle={{ backgroundColor: '#980000' }} />
            <Button title="Logout" buttonStyle={{ backgroundColor: '#980000' }} />
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
