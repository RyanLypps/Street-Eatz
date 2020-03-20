import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { HOST } from 'react-native-dotenv';
import { Header, Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      businessName: '',
      businessNumber: '',
      businessImage: 'There is no image',
      businessUrl: ''
    }
  }

  componentDidMount() {
    const self = this;
    const businessId = this.props.businessId;
    axios.get(`${HOST}/api/Businesses/${businessId}`)
      .then(res => {
        const sortedItems = [...res.data.menu].map(item => {
          if (item.category == undefined) {
            item.category = 'Miscellaneous';
            return item;
          } else {
            return item;
          }
        })
          .sort((a, b) => a.category.toLowerCase() == "food" ? 1 : b.category.toLowerCase() == "food" ? 1 : a.category > b.category ? 1 : a.category == 'Miscellaneous' ? -1 : b.category == 'Miscellaneous' ? -1 : -1);
        self.setState({
          items: sortedItems.map(item => {
            return {
              item: item.item,
              image: item.image,
              desc: item.desc,
              price: item.price,
              category: item.category
            }
          }),
          businessName: res.data.name,
          businessNumber: res.data.number,
          businessImage: res.data.image,
          businessUrl: res.data.url
        })
      }
      );
  }

  goToDescriptionMenu = (image, desc, price, item, token, businessId, category) => Actions.descriptionMenu({ image: image, desc: desc, price: price, item: item, token: token, businessId: businessId, category: category });

  displayMenu() {
    let count = 0;
    const menu = this.state.items;
    return menu.map((item, i) => {
      count++
      return (
        <View style={{ flex: 1 }}>
          {menu[i - 1] !== undefined && item.category !== menu[i - 1].category ?
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.menuLabel}>{item.category}</Text>
            </View>
            :
            <View></View>
          }
          <TouchableOpacity
            onPress={() => this.goToDescriptionMenu(item.image, item.desc, item.price, item.item, this.props.token, this.props.businessId, item.category)}
            style={styles.containerFoodItem}
            key={count}>
            {item.image ?
              <View>
                <Image style={styles.photo}
                  source={{ uri: item.image }}
                />
              </View>
              :
              <View></View>
            }
            <View style={styles.containerItemInfo}>
              <Text style={styles.title}>{item.item}</Text>
              <Text style={styles.desc}>{item.desc && item.desc.length > 55 ? item.desc.slice(0, 55) + '...' : item.desc}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    })
  }

  logOut() {
    axios.post(`${HOST}/api/Customers/logout?access_token=${this.props.token}`)
      .then(res => this.goToLogin())
  }

  goToLogin = () => Actions.login();
  goToSettings = (token) => Actions.customerSettings({ token: token });
  toggleSideMenu = sideMenuView => this.setState({ sideMenuView: !sideMenuView });
  goToMap = (token) => Actions.map({ token: token });

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
          centerComponent={{ style: { color: '#fff', fontSize: 20 }, text: this.state.businessName }}
          rightComponent={<Icon
            name='home'
            onPress={() => this.goToMap(this.props.token)}
          />}
        />
        {this.state.sideMenuView ?
          <View style={styles.menu}>
            <Button title="Settings" onPress={() => this.goToSettings(this.props.token)} buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
            <Button title="Logout" onPress={() => this.logOut()} buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
          </View>
          : <View></View>}
        <View style={styles.headerContainer} >
          <Image style={styles.picture} source={{ uri: this.state.businessImage }} />
          <Text style={styles.text}>{this.state.businessNumber}</Text>
          <Text style={styles.text} onPress={() => Linking.openURL('http://' + this.state.businessUrl)}>{this.state.businessUrl}</Text>
        </View>
        <ScrollView scrollEnabled={true}>
          {this.state.items.length > 0 ?
            <Text style={styles.firstMenuLabel}>{this.state.items[0].category}</Text>
            :
            <View></View>
          }
          <View style={{ paddingTop: 40, flex: 1 }} >{this.displayMenu()}</View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe599',
    flex: 1,
    flexDirection: 'column',
  },
  containerFoodItem: {
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderColor: 'darkgrey',
    borderBottomWidth: 1,
    height: 140,
    width: '100%',
    flex: 1
  },
  containerItemInfo: {
    marginLeft: 0,
    flexDirection: 'column',
    paddingLeft: 10,
    width: '75%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  desc: {
    fontSize: 14,
    flexDirection: 'row',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 5,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 0,
    marginLeft: 0,
    flex: 0,
  },
  headerContainer: {
    flexDirection: 'column',
    flex: 0,
    height: 200,
    resizeMode: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#980000',
    paddingBottom: 10,
    borderBottomColor: 'white',
    borderWidth: .45
  },
  picture: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 15,
    paddingLeft: 10,
    color: 'white'
  },
  menuLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: '#980000',
    color: 'white',
    textAlign: 'center'
  },
  firstMenuLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: '#980000',
    color: 'white',
    textAlign: 'center',
    marginBottom: -30
  }
})
