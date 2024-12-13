import { View, Text, TouchableOpacity, Image, SafeAreaView, TextInput, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'

import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { Colors } from '../../../res/Colors'
import { ScreenNames } from '../../../res/ScreenNames'
import axios from 'axios'
import { Apipath } from '../../../Api/Apipaths'
import { ShowMessage } from '../../../components/ShowMessage'
import LoadingAnimation from '../../../components/LoadingAnimation'
const VerifyEmail = ({ navigation, route }) => {

  const user = route.params.user
  console.log('user is', user)

  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const inputRef3 = useRef(null)
  const inputRef4 = useRef(null)
  const inputRef5 = useRef(null)

  const [inputValue1, setIntupValue1] = useState(null)
  const [inputValue2, setIntupValue2] = useState(null)
  const [inputValue3, setIntupValue3] = useState(null)
  const [inputValue4, setIntupValue4] = useState(null)
  const [inputValue5, setIntupValue5] = useState(null)

  const [loading, setLoading] = useState(false)


  const handleInputChange = (value, ref, setInputValue) => {
    console.log('input value is', value)
    console.log('input ref is', ref)
    setInputValue(value)
    if (value.length === 1 && ref) {
      ref.current.focus()
    }
  }

  const handleContinuePress = async () => {

    let code = inputValue1 + inputValue2 + inputValue3 + inputValue4 + inputValue5

    if (!inputValue1 || !inputValue2 || !inputValue3 || !inputValue4 || !inputValue5) {
      ShowMessage("Enter full code", 'red', 'white')
      return
    }

    console.log('code is', code)

    const apiData = {
      email: user.email,
      code: code
    }

    try {
      setLoading(true)
      const response = await axios.post(Apipath.verifyEmail, apiData, {
        headers: {
          "Content-Type": 'application/json'
        }
      })
      // return
      setLoading(false)
      if (response) {
        console.log('verify email response is', response.data)
        if (response.data.status === true) {
          if (user.role === 'customer') {
            navigation.push(ScreenNames.PasswordScreen, {
              user: user
            })
          } else {
            navigation.push(ScreenNames.UploadImageScreen, {
              user: user
            })
          }

        } else {
          console.log('verify email message is', response.data.message)
          ShowMessage(response.data.message)

        }
      }
    } catch (e) {
      console.log('error in verify code', e)
      setLoading(false)
    }

  }


  return (
    <SafeAreaView style={GlobalStyles.container}>
      {
        loading && (
          <LoadingAnimation visible={loading} />
        )
      }
      <View style={GlobalStyles.container}>

        <View style={GlobalStyles.completeProfileTopBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Image source={require('../../../assets/Images/backArrow.png')}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
            Complete your profile
          </Text>


          <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
            
          </Text>
        </View>

        <View style={{
          width: screenWidth - 50, alignItems: 'center', flexDirection: 'column', gap: 30 / 930 * screenHeight,
          marginTop: 50 / 930 * screenHeight
        }}>
          <Text style={GlobalStyles.heading24}>
            Verify Email Address
          </Text>

          <Text style={GlobalStyles.subheading14}>
            Enter the verification code sent to {user.email}
          </Text>

          <View style={{
            width: screenWidth - 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>

            <TextInput
              autoFocus={true}
              ref={inputRef1}
              placeholder='-'
              keyboardType='numeric'
              maxLength={1}
              onChangeText={(text) => handleInputChange(text, inputRef2, setIntupValue1)}
              style={styles.input}
            />

            <TextInput
              ref={inputRef2}
              placeholder='-'
              keyboardType='numeric'
              onChangeText={(text) => handleInputChange(text, inputRef3, setIntupValue2)}
              maxLength={1}
              style={styles.input}
            />

            <TextInput
              ref={inputRef3}
              placeholder='-'
              keyboardType='numeric'
              maxLength={1}
              onChangeText={(text) => handleInputChange(text, inputRef4, setIntupValue3)}
              style={styles.input}
            />

            <TextInput
              ref={inputRef4}
              placeholder='-'
              keyboardType='numeric'
              onChangeText={(text) => handleInputChange(text, inputRef5, setIntupValue4)}
              maxLength={1}
              style={styles.input}
            />

            <TextInput
              ref={inputRef5}
              placeholder='-'
              keyboardType='numeric'
              maxLength={1}
              style={styles.input}
              onChangeText={(text) => handleInputChange(text, null, setIntupValue5)}

            />

          </View>

          <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 20 / 930 * screenHeight }]}
            onPress={handleContinuePress}
          >

            <Text style={GlobalStyles.BtnText}>
              Continue
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'flex-start', width: screenWidth - 50 }}>
            <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack }}>
              Didn't receive any code?
            </Text>

            <TouchableOpacity>
              <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium, color: 'black' }}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>



        <Text></Text>
      </View>
    </SafeAreaView>
  )
}

export default VerifyEmail

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 20 / 930 * screenHeight,
    paddingHorizontal: 30 / 430 * screenWidth
  }
})