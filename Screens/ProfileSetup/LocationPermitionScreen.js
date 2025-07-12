import { View, Text, SafeAreaView, Image, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'

import * as Location from 'expo-location'
import { updateProfile } from '../../components/UpdateProfile'
import LoadingAnimation from '../../components/LoadingAnimation'
import { CustomFonts } from '../../assets/font/Fonts'

const LocationPremitionScreen = ({
    navigation,
    route = { params: {} },
    title = 'Location Permission',
    desc = '',
    showNotBtn = true,
    handleAllowLocation

}) => {

    const [loading, setLoading] = useState(false)


    const from = route?.params?.from ?? 'default';
    console.log('from', from)

    const allowLocation = () => {
        navigation.push(ScreenNames.PlansScreen)
    }

    useEffect(() => {
        // checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionGranted(status === 'granted');
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //     alert('Go to settings to allow location');
        //     return;
        // }

        if (status !== 'granted') {
            if (from === "Discover") {
                Alert.alert(
                    'Permission Needed',
                    'Location permission is denied. Please enable it in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
                return
            } else if (from == "CustomerFlow") {
                navigation.push(ScreenNames.TabbarContainer, {
                    from: 'CustomerFlow'
                })
                return
            } else {
                navigation.push(ScreenNames.PlansScreen)
            }
        }

        console.log('status', status)

        let location = await Location.getCurrentPositionAsync({});
        // setLocation(location);

        if (location) {
            setLoading(true)

            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (reverseGeocode.length > 0) {
                console.log('location data is', reverseGeocode)
                // setAddress(reverseGeocode[0]);
                let userLocation = {
                    lat: location.coords.latitude,
                    lang: location.coords.longitude,
                    city: reverseGeocode[0].city,
                    state: reverseGeocode[0].region
                }
                // console.log('user location is', userLocation)
                await updateProfile(userLocation)
                setLoading(false)

                if (from == "CustomerFlow") {
                    navigation.push(ScreenNames.TabbarContainer, {
                        from: 'CustomerFlow'
                    })
                    return
                } else if (from == "Discover") {
                    handleAllowLocation()
                    return
                }
                navigation.push(ScreenNames.PlansScreen)
            }

        } else {
            console.log('unable to get location')
        }
    };

    return (
        <SafeAreaView style={[GlobalStyles.container, { backgroundColor: from === "Discover" ? 'transparent' : 'white' }]}>
            {
                loading && <LoadingAnimation visible={loading} />
            }
            <View style={[{ alignItems: 'center', marginTop: 120 / 930 * screenHeight, width: screenWidth - 40 }]}>
                <Image source={require('../../assets/Images/locationImage.png')}
                    style={{ width: 142 / 930 * screenHeight, height: 142 / 930 * screenHeight, resizeMode: 'contain' }}
                />

                <Text style={{
                    marginTop: 20, textAlign: 'center', fontSize: from === "Discover" ? 16 : 24,
                    fontFamily: CustomFonts.PoppinsMedium
                }}>
                    {title}
                </Text>
                <Text style={[GlobalStyles.subheading14, { marginTop: 20, textAlign: 'center' }]}>
                    {desc}
                </Text>
                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 40 }]}
                    onPress={getLocation}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Continue
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={{ marginTop: 40 }}
                    onPress={() => {
                        if (from == "CustomerFlow") {
                            navigation.push(ScreenNames.TabbarContainer, {
                                from: 'CustomerFlow'
                            })
                            return
                        }
                        navigation.push(ScreenNames.PlansScreen)
                    }}
                >
                    <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                        Not Now
                    </Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    )
}

export default LocationPremitionScreen