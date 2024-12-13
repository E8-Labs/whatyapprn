import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput, } from 'react-native'
import { CustomFonts } from '../../assets/font/Fonts'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Apipath } from '../../Api/Apipaths'
import axios from 'axios'
import { ShowMessage } from '../../components/ShowMessage'
import LoadingAnimation from '../../components/LoadingAnimation'
import calculateSpent from '../../res/CalculateSpent'


const ReviewReplyScreen = ({ navigation, route }) => {

  const review = route.params.review
  const role = route.params.role
  console.log('review on review reply message', review)

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


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

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 15 }}>
            <View style={{ borderWidth: 2, borderColor: '#FF570020', borderRadius: 20 }}>
              <Image source={review.customer.profile_image ? { uri: review.customer.profile_image } : placeholderImage}
                style={[GlobalStyles.image24, { borderRadius: 30, borderWidth: 2, borderColor: 'white' }]}
              />
            </View>
            <View style={{ flexDirection: 'column', gap: 5 }}>
              <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                {review.customer.name}
              </Text>
              <Text style={[GlobalStyles.text14, { color: Colors.orangeColor }]}>
                Customer Response
              </Text>


            </View>

          </View>
          <Text style={[GlobalStyles.text17,]}>
            {review.notesAboutCustomer}
          </Text>
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
                {review.yapScore}
              </Text>
            </View>

            <View style={{
              paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
              backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
            }}>


              <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                Spent over ${calculateSpent(review.spent)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: screenWidth - 40, alignItems: 'center', marginTop: 20 / 930 * screenHeight }}>
          <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start' }]}>
            Reply To <Text style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>{review.customer.name}</Text>
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