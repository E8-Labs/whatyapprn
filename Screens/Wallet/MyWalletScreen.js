import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Modal } from 'react-native'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import React, { useEffect, useState } from 'react'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import AddCardScreen from '../PaySattleFlow/AddCardScreen'
import moment from 'moment/moment'


const MyWalletScreen = ({ navigation }) => {

  const cardImage = require('../../assets/Images/visaIcon.png')

  const [selectedCard, setSelectedCard] = useState("")
  const [cards, setCards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [showAddCard, setShowAddCard] = useState(false)

  // let transactions = [
  //   {
  //     "id": 8,
  //     "userId": 20,
  //     "settlementOfferId": 4,
  //     "tax": 25,
  //     "settlementOfferAmount": 500,
  //     "totalAmount": 525,
  //     "status": "success",
  //     "paymentMethodId": null,
  //     "data": null,
  //     "createdAt": "2025-03-17T08:46:16.000Z",
  //     "updatedAt": "2025-03-17T08:46:16.000Z",
  //     "review": {
  //       "id": 8,
  //       "service": "Some Service",
  //       "amountOfTransaction": 1000,
  //       "dateOfTransaction": "2024-10-10",
  //       "mediaUrl": null,
  //       "thumbUrl": null,
  //       "yapScore": 5,
  //       "settlementOffer": true,
  //       "notesAboutCustomer": "Great customer, prompt payment.",
  //       "business": {
  //         "id": 3,
  //         "name": "Are",
  //         "profile_image": null,
  //         "full_profile_image": null,
  //         "email": "ars@gmail.com",
  //         "phone": "",
  //         "role": "business",
  //         "city": "",
  //         "state": "",
  //         "totalYapScore": 0,
  //         "totalReviews": 0,
  //         "createdAt": "2024-09-21T08:12:28.000Z",
  //         "totalSpent": 0,
  //         "yapScore3Digit": 0
  //       },
  //       "customer": {
  //         "id": 20,
  //         "name": "Umar",
  //         "profile_image": null,
  //         "full_profile_image": null,
  //         "email": "umar@whatyapp.com",
  //         "phone": "923263414531",
  //         "role": "customer",
  //         "city": "",
  //         "state": "",
  //         "totalYapScore": 0,
  //         "totalReviews": 0,
  //         "createdAt": "2024-11-19T07:54:53.000Z",
  //         "totalSpent": 1000,
  //         "yapScore3Digit": 0
  //       },
  //       "createdAt": "2024-11-10T07:23:38.000Z",
  //       "updatedAt": "2025-03-17T08:47:11.000Z",
  //       "settlementOfferObject": null,
  //       "reviewStatus": "resolved",
  //       "newActivityByCustomer": false,
  //       "newActivityByBusiness": true,
  //       "media": [
  //         {
  //           "id": 7,
  //           "media_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_review_1731223418060.jpeg",
  //           "thumb_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_thumbnail_1731223418060.jpeg",
  //           "reviewId": 8,
  //           "createdAt": "2024-11-10T07:23:38.000Z",
  //           "updatedAt": "2024-11-10T07:23:38.000Z"
  //         },
  //         {
  //           "id": 8,
  //           "media_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_review_1731223418075.jpg",
  //           "thumb_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_thumbnail_1731223418075.jpg",
  //           "reviewId": 8,
  //           "createdAt": "2024-11-10T07:23:38.000Z",
  //           "updatedAt": "2024-11-10T07:23:38.000Z"
  //         }
  //       ]
  //     },
  //     "settlement": {
  //       "id": 4,
  //       "amount": 500,
  //       "userId": 3,
  //       "reviewId": 8,
  //       "status": "paid",
  //       "createdAt": "2024-11-10T07:23:38.000Z",
  //       "updatedAt": "2025-03-17T16:06:17.000Z"
  //     },
  //     "description": "Settlement for Some Service"
  //   },
  //   {
  //     "id": 9,
  //     "userId": 20,
  //     "settlementOfferId": 4,
  //     "tax": 25,
  //     "settlementOfferAmount": 500,
  //     "totalAmount": 525,
  //     "status": "success",
  //     "paymentMethodId": null,
  //     "data": null,
  //     "createdAt": "2025-03-17T08:47:11.000Z",
  //     "updatedAt": "2025-03-17T08:47:11.000Z",
  //     "review": {
  //       "id": 8,
  //       "service": "Some Service",
  //       "amountOfTransaction": 1000,
  //       "dateOfTransaction": "2024-10-10",
  //       "mediaUrl": null,
  //       "thumbUrl": null,
  //       "yapScore": 5,
  //       "settlementOffer": true,
  //       "notesAboutCustomer": "Great customer, prompt payment.",
  //       "business": {
  //         "id": 3,
  //         "name": "Are",
  //         "profile_image": null,
  //         "full_profile_image": null,
  //         "email": "ars@gmail.com",
  //         "phone": "",
  //         "role": "business",
  //         "city": "",
  //         "state": "",
  //         "totalYapScore": 0,
  //         "totalReviews": 0,
  //         "createdAt": "2024-09-21T08:12:28.000Z",
  //         "totalSpent": 0,
  //         "yapScore3Digit": 0
  //       },
  //       "customer": {
  //         "id": 20,
  //         "name": "Umar",
  //         "profile_image": null,
  //         "full_profile_image": null,
  //         "email": "umar@whatyapp.com",
  //         "phone": "923263414531",
  //         "role": "customer",
  //         "city": "",
  //         "state": "",
  //         "totalYapScore": 0,
  //         "totalReviews": 0,
  //         "createdAt": "2024-11-19T07:54:53.000Z",
  //         "totalSpent": 1000,
  //         "yapScore3Digit": 0
  //       },
  //       "createdAt": "2024-11-10T07:23:38.000Z",
  //       "updatedAt": "2025-03-17T08:47:11.000Z",
  //       "settlementOfferObject": null,
  //       "reviewStatus": "resolved",
  //       "newActivityByCustomer": false,
  //       "newActivityByBusiness": true,
  //       "media": [
  //         {
  //           "id": 7,
  //           "media_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_review_1731223418060.jpeg",
  //           "thumb_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_thumbnail_1731223418060.jpeg",
  //           "reviewId": 8,
  //           "createdAt": "2024-11-10T07:23:38.000Z",
  //           "updatedAt": "2024-11-10T07:23:38.000Z"
  //         },
  //         {
  //           "id": 8,
  //           "media_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_review_1731223418075.jpg",
  //           "thumb_url": "http://185.28.22.219:8006/uploads/review_images/2024-11-10_thumbnail_1731223418075.jpg",
  //           "reviewId": 8,
  //           "createdAt": "2024-11-10T07:23:38.000Z",
  //           "updatedAt": "2024-11-10T07:23:38.000Z"
  //         }
  //       ]
  //     },
  //     "settlement": {
  //       "id": 4,
  //       "amount": 500,
  //       "userId": 3,
  //       "reviewId": 8,
  //       "status": "paid",
  //       "createdAt": "2024-11-10T07:23:38.000Z",
  //       "updatedAt": "2025-03-17T16:06:17.000Z"
  //     },
  //     "description": "Settlement for Some Service"
  //   },
  // ]

  useEffect(() => {
    getCards()
    getTransactions()
  }, [])

  const getCards = async () => {
    try {
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)
        const response = await axios.get(Apipath.getCards, {
          headers: {
            'Authorization': 'Bearer ' + u.token,
            'Content-Type': 'application/json'
          }
        })
        if (response.data) {
          console.log('cards data is', response.data.data)
          setCards(response.data.data)
        }
      }
    } catch (e) {
      console.log('error in get cards is', e)
    }
  }

  const getTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)
        const response = await axios.get(Apipath.getTransactions, {
          headers: {
            'Authorization': 'Bearer ' + u.token,
            'Content-Type': 'application/json'
          }
        })
        if (response.data) {
          console.log('transactions data is', response.data.data)
          setTransactions(response.data.data)
        }
      }
    } catch (e) {
      console.log('error in get cards is', e)
    }
  }


  //function to get card brand image
  const getCardImage = (item) => {
    if (item.brand === "visa") {
      return require("../../assets/Images/visaIcon.png");
    } else if (item.brand === "Mastercard") {
      return require("../../assets/Images/Mastercard.svg");
    } else if (item.brand === "amex") {
      return require("../../assets/Images/Amex.svg");
    } else if (item.brand === "discover") {
      return require("../../assets/Images/Discover.svg");
    } else if (item.brand === "dinersClub") {
      return require("../../assets/Images/DinersClub.svg");
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.completeProfileTopBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Image source={require('../../assets/Images/backArrow.png')}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <Text style={GlobalStyles.text14}>
            My Wallet
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowAddCard(true)
            }}
          >
            <Image source={require('../../assets/Images/orangeAddBtn.png')}
              style={{ height: 28 / 930 * screenHeight, width: 28 / 930 * screenHeight }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40 }}>
          <Text style={[GlobalStyles.text14, { marginTop: 50 / 930 * screenHeight, alignSelf: 'flex-start' }]}>
            My Cards
          </Text>


          <View style={{ height: 400 / 920 * screenHeight, width: screenWidth - 40 }}>
            {
              cards.length > 0 ? (
                <FlatList
                  data={cards}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCard(item)
                      }}
                    >
                      <View style={{
                        flexDirection: 'column', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: Colors.lightGray,
                        borderRadius: 10, width: screenWidth - 40, marginTop: 22 / 930 * screenHeight, borderWidth: 2, borderRadius: 10, borderColor: '#DDDDDD'
                      }}>
                        <View style={{
                          flexDirection: 'row', alignItems: 'center', width: screenWidth - 80, justifyContent: 'space-between',

                        }}>
                          <Image source={getCardImage(item)}
                            style={GlobalStyles.image37}
                          />
                          <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 / 930 * screenHeight }}>
                            <Text style={[GlobalStyles.text17, { textTransform: 'capitalize' }]}>
                              {item.brand}  Ending with {item.last4}
                            </Text>
                            {
                              item.isDefault && (
                                <Text style={[GlobalStyles.text14, { color: '#00000090' }]}>
                                  Default Card
                                </Text>
                              )
                            }
                          </View>

                          <Image source={item.paymentMethodId === selectedCard.paymentMethodId ? (
                            require('../../assets/Images/selectedIcon.png')
                          ) : (
                            require('../../assets/Images/unSelectedIcon.png')
                          )}
                            style={GlobalStyles.image24}

                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={[GlobalStyles.text17, { marginTop: 60, alignSelf: 'flex-start' }]}>
                  Add your payment method
                </Text>
              )
            }

          </View>

          <Text style={[GlobalStyles.text14,{alignSelf:'flex-start',marginTop:30}]}>
            Transaction Log
          </Text>
          {
            transactions.length > 0 ? (
              <FlatList
                data={transactions}
                renderItem={({ item }) => (
                  // <TouchableOpacity
                  //   onPress={() => {
                  //     setSelectedCard(item)
                  //   }}
                  // >
                  <View style={{
                    flexDirection: 'column', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: Colors.lightGray,
                    borderRadius: 10, width: screenWidth - 40, marginTop: 22 / 930 * screenHeight, //borderWidth: 2, borderRadius: 10, borderColor: '#DDDDDD'
                  }}>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', width: screenWidth - 80, justifyContent: 'space-between',

                    }}>


                      <View style={{
                        flexDirection: 'row', alignItems: 'flex-start', gap: 20
                      }}>

                        <Image source={item.review.thumbUrl ? ({ uri: item.review.thumbUrl }) : placeholderImage}
                          style={GlobalStyles.image37}
                        />
                        <View style={{
                          flexDirection: 'column', alignItems: 'flex-start', gap: 10
                        }}>
                          <Text style={[GlobalStyles.text17, { textDecorationLine: 'underline', color: 'black' }]}>
                            {item.review.service}
                          </Text>
                          <Text style={[GlobalStyles.text14,]}>
                            {moment(item.createdAt).format("MM/DD/YYYY")}
                          </Text>

                        </View>

                      </View>
                      <Text style={[GlobalStyles.text17, {color: 'black' }]}>
                        ${item.totalAmount}
                      </Text>

                    </View>
                  </View>
                  // </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={[GlobalStyles.text17, { marginTop: 60, alignSelf: 'flex-start' }]}>
                No  Transaction
              </Text>
            )
          }

          <Modal
            visible={showAddCard}
            transparent={true}
            animationType="fade"
          >
            <AddCardScreen updateCards={getCards()} close={() => setShowAddCard(false)} />
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MyWalletScreen