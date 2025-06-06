import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput, } from 'react-native'
import { CustomFonts } from '../../assets/font/Fonts'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Apipath } from '../../Api/Apipaths'
import axios from 'axios'
import { ShowMessage } from '../../components/ShowMessage'
import LoadingAnimation from '../../components/LoadingAnimation'
import calculateSpent from '../../res/CalculateSpent'


const ReviewReplyScreen = ({ navigation, route }) => {

  const review = route.params.review
  const role = route.params.role
  console.log('review on review reply message', review.customer)

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState("")

  useEffect(() => {
    const getProfile = async () => {
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)
        // console.log('data', data)

        if (review?.customer.id === u.user.id) {
          setUser(review?.business)
        } else {
          setUser(review?.customer)
        }

      }
    }
    getProfile()
  }, [])


  const sendMessage = async () => {
    if (!message) {
      setError("Message required")
      return
    }
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)

        let path = Apipath.sendMessage

        let body = {
          reviewId: review.id,
          message: message
        }

        console.log('body is is', body)
        // return
        const response = await axios.post(path, body, {
          headers: {
            'Authorization': "Bearer " + u.token,
            'Content-Type': 'application/json'
          }
        })

        if (response.data) {
          setLoading(false)
          if (response.data.status === true) {
            console.log('message sent ', response.data.message)
            navigation.pop()
          } else {
            console.log('message sent api meessage is', response.data.message)
          }
        }
      }
    } catch (e) {
      setLoading(false)
      console.log('error in send message api is', e)
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {
        loading && <LoadingAnimation visible={loading} />
      }
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
            Respond
          </Text>

          <TouchableOpacity>
            <Image source={require('../../assets/Images/threeDotsImage.png')}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>
        </View>

        <View style={{
          flexDirection: 'column', alignItems: 'flex-start', marginTop: 20 / 930 * screenHeight,
          width: screenWidth - 80, gap: 15 / 930 * screenHeight
        }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={
              user?.profile_image ? { uri: user?.profile_image } : placeholderImage
            }
              style={[GlobalStyles.image37, { borderRadius: 30, borderWidth: 2, borderColor: 'white' }]}
            />

            <Text style={[GlobalStyles.text17, { color: '#000' }]}>
              {user?.name}
            </Text>

          </View>
          <Text style={[GlobalStyles.text17,]}>
            {review?.notesAboutCustomer}
          </Text>

          {
            user.role === "customer" && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>

                <View style={{
                  paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                  backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                }}>
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Image source={require('../../assets/Images/yIcon.png')}
                      style={GlobalStyles.yIcon}
                    />
                    <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                      ap score
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontFamily: CustomFonts.IntriaBold }}>
                    {review?.customer?.yapScore3Digit}
                  </Text>
                </View>

                <View style={{
                  paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                  backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                }}>


                  <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                    Spent over {calculateSpent(review?.customer?.totalSpent)}
                  </Text>
                </View>
              </View>
            )
          }

        </View>
        <View style={{ width: screenWidth - 40, alignItems: 'center', marginTop: 20 / 930 * screenHeight }}>
          <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start' }]}>
            Reply To <Text style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>{user?.name}</Text>
          </Text>

          <TextInput
            placeholder='Type here'
            onChangeText={(text) => {
              setMessage(text)
            }}
            multiline
            style={[GlobalStyles.input, {
              height: 108 / 930 * screenHeight, marginTop: 32 / 930 * screenHeight, width: screenWidth - 40
            }]}

          />
          {
            error && <Text style={GlobalStyles.errorText}>{error}</Text>
          }

          <TouchableOpacity style={[GlobalStyles.capsuleBtn, { width: screenWidth - 40 }]}
            onPress={sendMessage}
          >
            <Text style={GlobalStyles.BtnText}>
              Send Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ReviewReplyScreen