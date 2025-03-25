import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'

import * as Location from 'expo-location'
import { updateProfile } from '../../components/UpdateProfile'
import LoadingAnimation from '../../components/LoadingAnimation'

const LocationPremitionScreen = ({ navigation, route }) => {

    const [loading, setLoading] = useState(false)


    let from = route.params.from
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
        if (status !== 'granted') {
            alert('Go to settings to allow location');
            return;
        }

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
                }
                navigation.push(ScreenNames.PlansScreen)
            }

        } else {
            console.log('unable to get location')
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && <LoadingAnimation visible={loading} />
            }
            <View style={[GlobalStyles.container, { alignItems: 'center', marginTop: 120 / 930 * screenHeight, width: screenWidth - 40 }]}>
                <Image source={require('../../assets/Images/locationImage.png')}
                    style={{ width: 142 / 930 * screenHeight, height: 142 / 930 * screenHeight, resizeMode: 'contain' }}
                />

                <Text style={[GlobalStyles.heading, { marginTop: 20, textAlign: 'center' }]}>
                    Location permission
                </Text>
                {/* <Text style={[GlobalStyles.subheading14, { marginTop: 20, textAlign: 'center' }]}>
                    Lorem ipsum dolor sit amet consectetur. Id feugiat sit magna fermentum bibendum tincidunt. Dolor sit et et enim.
                </Text> */}
                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 40 }]}
                    onPress={getLocation}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Allow Location
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 40 }}
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
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default LocationPremitionScreen