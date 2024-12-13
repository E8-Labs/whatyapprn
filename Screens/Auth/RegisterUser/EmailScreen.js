import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { Colors } from '../../../res/Colors'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import axios from 'axios'
import { Apipath } from '../../../Api/Apipaths'
import { ShowMessage } from '../../../components/ShowMessage'
import LoadingAnimation from '../../../components/LoadingAnimation'

const eye = require('../../../assets/Images/eye.png')
const eyeSlash = require('../../../assets/Images/eye-slash.png')

const EmailScreen = ({ navigation, route }) => {

  const user = route.params.user

  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAvailable, setIsAvailable] = useState(false)


  useEffect(() => {
    let timer = setTimeout(() => {
      if (email) {
        console.log('timer finished')
        checkEmailExists(email)
      }
    }, 500);
    return () => clearTimeout(timer)
  }, [email])

  const checkEmailExists = async (e) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmail = emailRegex.test(e)
    if (!validEmail) {
      setError("Invalid email")
      return
    }
    const apiData = {
      email: e
    }
    try {
      // setLoading(true)

      const response = await axios.post(Apipath.checkEmailExists, apiData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response) {
        console.log('response of check email api is', response.data)
        if (response.data.status === true) {
          setIsAvailable(true)
          setError("")
        } else {
          setIsAvailable(false)
          setError(response.data.message)
        }
      }
    } catch (e) {
      setError("Cannot check if email exists.")
      console.log('error in  check email api', e)
    }
  }

  const sendVerificationEmail = async () => {
    try {
      setLoading(true)

      let apiData = {
        email: email
      }

      const response = await axios.post(Apipath.sendVeerificationEmail, apiData, {
        headers: {
          'Content-Type': "application/json"
        }
      })

      if (response) {
        setLoading(false)
        console.log('response of send verification email is', response.data)
        if (response.data.status === true) {
          console.log('api called')
          navigation.push(ScreenNames.VerifyEmail, {
            user: {
              email: email,
              role: user.role
            }
          })
        } else {

          setError(response.data.message)
        }
      }

    } catch (e) {
      setLoading(false)
      console.log('error in send verification email', e)
    }
  }

  const handleContinuePress = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmail = emailRegex.test(email)

    if (!email || error) {
      setError("Email required")
      return
    }

    if (!validEmail) {
      setIsAvailable(false)
      setError("Enter valid email")
      return
    }

    sendVerificationEmail()
  }

  return (

    <SafeAreaView style={GlobalStyles.container}>
      {
        loading && (
          <LoadingAnimation visible={loading} />
        )
      }
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.container}>
          <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, }}>
            <TouchableOpacity style={{ alignSelf: 'flex-start', marginLeft: 0 / 430 * screenHeight, marginTop: 20 / 930 * screenHeight }}
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Image source={require('../../../assets/Images/backArrow.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
            <Image source={require('../../../assets/Images/mainIcon.png')}
              style={{
                height: 39 / 930 * screenHeight, width: 45 / 430 * screenWidth, alignSelf: 'flex-start',
                marginLeft: 10 / 430 * screenWidth, marginTop: 15 / 930 * screenHeight, resizeMode: 'contain'
              }} />
            <Text style={GlobalStyles.heading}>
              Sign Up
            </Text>

            <View style={[GlobalStyles.input, {
              flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight
            }]}>
              <TextInput
                placeholder='Email address'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={(text) => {
                  setEmail(text)
                  setError("")
                  setIsAvailable(false)
                }}
                style={{
                  width: 320 / 430 * screenWidth,
                  fontFamily: CustomFonts.InterMedium
                }}
              />
              <Image source={require('../../../assets/Images/emailIcon.png')}
                style={{
                  height: 28,
                  width: 28,
                }}
              />
            </View>

            {
              error && <Text style={[GlobalStyles.errorText, { marginTop: 15, alignSelf: 'flex-start' }]}>{error}</Text>
            }

            {
              isAvailable && <Text style={[GlobalStyles.erText, { color: 'green', marginTop: 15, alignSelf: 'flex-start' }]}>
                Email available
              </Text>
            }


            <TouchableOpacity style={[GlobalStyles.capsuleBtn,]}
              onPress={handleContinuePress}
            >
              <Text style={[GlobalStyles.BtnText]}>
                Continue
              </Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: 17, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
              marginTop: 30 / 930 * screenHeight
            }}>
              Or
            </Text>

            <TouchableOpacity style={styles.socialContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={require('../../../assets/Images/googleIcon.png')}
                  style={GlobalStyles.image24}
                />
                <Text style={styles.socialText}>
                  Sign in with Google
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={require('../../../assets/Images/appleIcon.png')}
                  style={GlobalStyles.image24}
                />
                <Text style={styles.socialText}>
                  Sign in with Apple
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={require('../../../assets/Images/facebookIcon.png')}
                  style={GlobalStyles.image24}
                />
                <Text style={styles.socialText}>
                  Sign in with Facebook
                </Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity style={{ marginTop: 90 / 430 * screenHeight }}
              onPress={() => {
                navigation.goBack()
                // checkEmailExists(email)
              }}
            >
              <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                Have an account already? Sign In
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default EmailScreen


const styles = StyleSheet.create({
  socialContainer: {
    // width: screenWidth - 30,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20 / 930 * screenHeight,
    marginTop: 30 / 930 * screenHeight,
    // borderWidth:1,
    // alignSelf:'center'
  },
  socialText: {
    fontSize: 17 / 930 * screenHeight,
    fontFamily: CustomFonts.InterMedium
  },
  socialIcon: {
    height: 25 / 930 * screenHeight,
    width: 25 / 439 * screenWidth,
    resizeMode: 'contain'
  }
})