import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { ShowMessage } from '../../components/ShowMessage'
import { Colors } from '../../res/Colors'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'

const Feedback = ({ navigation }) => {

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const handleSubmit = async () => {

        if (!message || !title) {
            setError('Fill all the fields')
            return
        }

        try {
            setLoading(true)
            const data = await AsyncStorage.getItem("USER")

            if (data) {
                let u = JSON.parse(data)

                let path = Apipath.sendFeedback

                let apidata = {

                    title: title,
                    feedback: message

                }

                const response = await axios.post(path, apidata, {
                    headers: {
                        "Authorization": `Bearer ${u.token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.data) {
                    setLoading(false)
                    if (response.data.status) {
                        ShowMessage('Feedback sent successfully', 'green')
                        setTitle('')
                        setMessage('')
                        navigation.goBack()
                    } else {
                        alert('Something went wrong')
                    }
                }

            }

        } catch (error) {
            setLoading(false)
            console.log("error in sent feedback", error)
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20,justifyContent:'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: 24 / 930 * screenHeight,fontFamily: CustomFonts.PoppinsMedium,}}>
                        Feedback
                    </Text>
                </View>

                <Text style={GlobalStyles.text14}>
                    Title
                </Text>

                <TextInput
                    style={GlobalStyles.input}
                    placeholder='Title'
                    onChangeText={(text) => {
                        setTitle(text)
                        setError('')
                    }}
                />



                <Text style={GlobalStyles.text14}>
                    Message
                </Text>

                <TextInput
                    multiline
                    onChangeText={(text) => {
                        setMessage(text)
                        setError('')
                    }}
                    style={[GlobalStyles.input, { height: 100 }]}
                    textAlignVertical='top'
                    placeholder='Message'
                />

                {error ? <Text style={GlobalStyles.errorText}>{error}</Text> : null}

                <View style={{ width: screenWidth - 40, alignItems: 'center' }}>

                    {
                        loading ? (
                            <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                        ) : (
                            <TouchableOpacity style={GlobalStyles.rectButton}
                                onPress={() => {
                                    handleSubmit()
                                }
                                }
                            >
                                <Text style={GlobalStyles.BtnText}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>




            </View>
        </SafeAreaView >
    )
}

export default Feedback