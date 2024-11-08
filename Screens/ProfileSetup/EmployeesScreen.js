import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import { updateProfile } from '../../components/UpdateProfile'
import LoadingAnimation from '../../components/LoadingAnimation'

const selectedImage = require('../../assets/Images/selectedIcon.png')
const unselectedImage = require('../../assets/Images/unSelectedIcon.png')

const EmployeesScreen = ({ navigation, route }) => {


    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState("")

    const user = route.params.user
    user.business_employees = selected

    const employeesNum = [
        {
            id: 1,
            name: '<10',
            number: '10'

        },
        {
            id: 2,
            name: '11 - 50',
            number: '50'
        },
        {
            id: 3,
            name: '51 - 100',
            number: '100'
        },
        {
            id: 4,
            name: '101 - 250',
            number: '150'
        },
        {
            id: 5,
            name: '250+',
            number: '250'
        },

    ]

    const handleContinuePress = async () => {

        if (!selected) {
            setError("Select number of emloyees")
            return
        }
        if (user.from === 'profile') {
            let data = {
                business_employees: selected
            }
            setLoading(true)
            await updateProfile(data)
            setLoading(false)
            navigation.goBack()
            return
        }
        navigation.push(ScreenNames.BusinessLocation, {
            user: user
        })
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible={true} />
                )
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

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        3 of 5
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Number of Employees
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Select number of employees
                    </Text>
                    <View style={{ marginTop: 30 / 930 * screenHeight }}>

                        {
                            employeesNum.map((item) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => {
                                        setSelected(item.number)
                                        setError("")
                                    }}
                                >
                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                                        padding: 20, flexDirection: 'row'
                                    }}>
                                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                                            {item.name}
                                        </Text>
                                        <Image source={selected === item.number ? selectedImage : unselectedImage}
                                            style={{
                                                height: 30 / 930 * screenHeight,
                                                width: 30 / 930 * screenHeight
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }

                        {
                            error && <Text style = {GlobalStyles.errorText}>{error}</Text>
                        }
                    </View>

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={handleContinuePress}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EmployeesScreen