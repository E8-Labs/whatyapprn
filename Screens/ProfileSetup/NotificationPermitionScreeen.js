import { View, TouchableOpacity, Text, Dimensions, Platform, Settings, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { updateProfile } from '../../components/UpdateProfile';
import LoadingAnimation from '../../components/LoadingAnimation';


const NotificationPermitionScreeen = ({ navigation,route}) => {

    const [fcmToken, setFcmToken] = useState("")
    const[loading,setloading] = useState(false)


    let from = route.params.from
    // let from = "CustomerFlow"
    console.log('from', from)

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            // EAS projectId is used here.
            try {
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ??
                    Constants?.easConfig?.projectId;
                if (!projectId) {
                    throw new Error('Project ID not found');
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(token);
            } catch (e) {
                token = `${e}`;
            }
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    const getNotificationPermission = async () => {
        setloading(true)
        console.log('enter in function')
        registerForPushNotificationsAsync().then(
           async (token) => {
                if (token) {
                    setFcmToken(token)
                }
                console.log('token', token)
                let apidata = {
                    fcm_token: token
                }
                let data = await updateProfile(apidata)
                setloading(false)
                if (data) {
                    navigation.push(ScreenNames.LocationPremitionScreen,{
                        from : from
                    })
                }
                // updateProfile(token)
            }
        );
    }

    const allowNotification = () => {
        navigation.push(ScreenNames.LocationPremitionScreen)
    }
    return (
        <SafeAreaView style={GlobalStyles.container}>
            {loading && <LoadingAnimation visible = {loading} />}
            <View style={[GlobalStyles.container, { alignItems: 'center', marginTop: 120 / 930 * screenHeight }]}>
                <Image source={require('../../assets/Images/notificationImage.png')}
                    style={{ width: 142 / 930 * screenHeight, height: 142 / 930 * screenHeight, resizeMode: 'contain' }}
                />

                <Text style={[GlobalStyles.heading, { marginTop: 20 }]}>
                    Notification permission
                </Text>
                {/* <Text style={[GlobalStyles.subheading14, { marginTop: 20 }]}>
                    Lorem ipsum dolor sit amet consectetur. Id feugiat sit magna fermentum bibendum tincidunt. Dolor sit et et enim.
                </Text> */}
                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 40 }]}
                    onPress={getNotificationPermission}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Allow Notification
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 40 }}
                    onPress={() => {
                        navigation.push(ScreenNames.LocationPremitionScreen,{
                            from : from
                        })
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

export default NotificationPermitionScreeen