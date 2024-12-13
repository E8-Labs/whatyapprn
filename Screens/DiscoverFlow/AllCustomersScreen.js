import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import calculateSpent from '../../res/CalculateSpent'

const profileImage = require('../../assets/Images/profileImage.png')


const AllCustomersScreen = ({ navigation }) => {

    const [customers,setCustomers] = useState([])
    // const customers = [
    //     {
    //         id: 1,
    //         name: 'Thusker FG',
    //         city: 'San Francisco, CA',
    //         spent: '$300+',
    //         yapScore: '300',
    //         reviews: '149+',
    //         url: profileImage,
    //     }, {
    //         id: 2,
    //         name: 'Thusker FG',
    //         city: 'San Francisco, CA',
    //         spent: '$300+',
    //         yapScore: '300',
    //         reviews: '149+',
    //         url: profileImage,
    //     }, {
    //         id: 3,
    //         name: 'Thusker FG',
    //         city: 'San Francisco, CA',
    //         spent: '$300+',
    //         yapScore: '300',
    //         reviews: '149+',
    //         url: profileImage,
    //     }, {
    //         id: 4,
    //         name: 'Thusker FG',
    //         city: 'San Francisco, CA',
    //         spent: '$300+',
    //         yapScore: '300',
    //         reviews: '149+',
    //         url: profileImage,
    //     }, {
    //         id: 5,
    //         name: 'Thusker FG',
    //         city: 'San Francisco, CA',
    //         spent: '$300+',
    //         yapScore: '300',
    //         reviews: '149+',
    //         url: profileImage,
    //     },
    // ]

    useEffect(()=>{
        getCustomersList()
    },[])


    const getCustomersList = async () => {
        try {
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)

                const response = await axios.get(Apipath.getAllCustomers, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token
                    }
                })

                if (response.data) {
                    if (response.data.status === true) {
                        console.log('customers list is', response.data.data)
                        setCustomers(response.data.data)

                    }else{
                        console.log('error message is', response.data.message)
                    }
                }
            }
        } catch (e){
            console.log('error in get all customers api is', e)
        }
    }

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
                        All Customers
                    </Text>
                    <View></View>
                </View>

                <Text style={[GlobalStyles.subheading, { marginTop: 30 / 930 * screenHeight }]}>
                    Customers Near Me
                </Text>
                <View style={{ height: screenHeight * 0.8 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 20, flexDirection: 'column', gap: 30 }}>
                            {
                                customers.map((item) => (
                                    <View key={item.id} style={{
                                        width: screenWidth - 40, alignItems: 'flex-start', flexDirection: 'row',gap:10 ,
                                        marginTop: 30 / 930 * screenHeight
                                    }}>
                                        <Image source={item.profile_image?{uri:item.profile_image}:placeholderImage}
                                            style={{
                                                height: 30 / 930 * screenHeight, width: 30 / 430 * screenWidth, resizeMode: 'cover',borderRadius:20
                                            }}
                                        />
                                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 / 930 * screenHeight }}>
                                            <Text style={[GlobalStyles.text17, { color: 'black' }]}>
                                                {item.name}
                                            </Text>
                                            <Text style={[GlobalStyles.text17, { color: '#00000080' }]}>
                                                {item.city?item.city:''}
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                                width: 200 / 430 * screenWidth
                                            }}>
                                                <View style={{ flexDirection: 'column', gap: 5 }}>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Image source={require('../../assets/Images/yIcon.png')}
                                                            style={GlobalStyles.yIcon}
                                                        />
                                                        <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                                                            ap score
                                                        </Text>
                                                    </View>
                                                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaBold }}>
                                                        {item.yapScore?item.yapScore:''}
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: 'column', gap: 5 }}>
                                                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterRegular }}>
                                                        Total Reviews
                                                    </Text>
                                                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaBold }}>
                                                        {item.reviews?item.reviews:''}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{
                                            flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end',
                                            height: 110 / 930 * screenHeight,marginLeft:20/430*screenWidth
                                        }}>
                                            <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium ,color:'#00000080'}}>
                                                Spent over {item.spent?calculateSpent(item.spent):''}
                                            </Text>

                                            <TouchableOpacity>
                                                <Image source={require('../../assets/Images/farwordBtn.png')}
                                                    style={GlobalStyles.image37}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default AllCustomersScreen