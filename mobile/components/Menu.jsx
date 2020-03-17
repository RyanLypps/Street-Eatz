import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { HOST } from 'react-native-dotenv';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      businessName: '',
      businessNumber: '',
      businessImage: '',
      businessUrl: ''
    }
  }

  componentDidMount() {
    const self = this;
    const businessId = this.props.businessId;
    axios.get(`${HOST}/api/Businesses/${businessId}`)
      .then(res => self.setState({
        items: res.data.menu.map(item => {
          return {
            item: item.item,
            image: item.image,
            desc: item.desc,
            price: item.price
          }
        }),
        businessName: res.data.name,
        businessNumber: res.data.number,
        businessImage: res.data.image,
        businessUrl: res.data.url
      })
      );
  }

  displayMenu() {
    let count = 0;
    const menu = this.state.items;
    return menu.map(item => {
      count++
      return (
        <View style={styles.containerFoodItem} key={count}>
          { item.image ? 
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
            <Text>{item.desc}</Text>
            <Text>${item.price}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 35 }}>{this.state.businessName}</Text>
        <Text>{this.state.businessNumber}</Text>
        <Text>{this.state.businessUrl}</Text>
        { this.state.businessImage ?
        <Image style={styles.truck} source={{ uri: this.state.businessImage }} />
        :
        <View></View>
        }
        <ScrollView scrollEnabled={true}>
          <View style={{ paddingTop: 40 }} >{this.displayMenu()}</View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe599',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 40,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'column'
  },
  containerFoodItem: {
    flex: 0,
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  containerItemInfo: {
    paddingLeft: 15,
    flex: 0,
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  photo: {
    width: 115,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  blue: {
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 65,
    fontSize: 10,
  },
  text: {
    paddingTop: 50
  },
  truck: {
    marginTop: 15,
    height: 100,
    width: 145,
  }
})
