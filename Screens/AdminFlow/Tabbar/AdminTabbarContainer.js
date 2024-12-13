import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import AdminDashboardMainScreen from '../DashboardFlow/AdminDashboardMainScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenNames } from '../../../res/ScreenNames';
import AdminAnalyticsMainScreen from '../AnalyticsFlow/AdminAnalyticsMainScreen';
import { Colors } from '../../../res/Colors';
import { CustomFonts } from '../../../assets/font/Fonts';

import { screenHeight, screenWidth } from '../../../res/Constants';
import AdminBusinessMainScreen from '../BusinessFlow/AdminBusinessMainScreen';
import AdminUserMainScreen from '../UsersFlow/AdminUserMainScreen';
import AdminResolutionsMainScreen from '../ResolutionsFlow/AdminResolutionsMainScreen';

const Tab = createBottomTabNavigator()

const AdminTabbarContainer = () => {
    return (
        <Tab.Navigator initialRouteName={AdminDashboardMainScreen}
            screenOptions={{
                headerShown: false,
                tabBarStyle: { height: 100 / 930 * screenHeight },
            }}>
            <Tab.Screen name={ScreenNames.AdminDashboardMainScreen}
                component={AdminDashboardMainScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/Images/dashboardTab.png')}
                            style={[styles.image, { tintColor: focused ? Colors.orangeColor : "#00000050" }]}
                        />
                    ),
                    tabBarLabel: ({ focused }) =>
                        focused ? <Text style={styles.labelText}>Dashboard</Text> : '',
                }}
            />

            <Tab.Screen name={ScreenNames.AdminAnalyticsMainScreen}
                component={AdminAnalyticsMainScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/Images/analyticsTab.png')}
                            style={[styles.image, { tintColor: focused ? Colors.orangeColor : "#00000050" }]}
                        />
                    ),
                    tabBarLabel: ({ focused }) =>
                        focused ? <Text style={styles.labelText}>Analytics</Text> : '',
                }}
            />

            <Tab.Screen name={ScreenNames.AdminBusinessMainScreen}
                component={AdminBusinessMainScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/Images/businessTab.png')}
                            style={[styles.image, { tintColor: focused ? Colors.orangeColor : "#00000050" }]}
                        />
                    ),
                    tabBarLabel: ({ focused }) =>
                        focused ? <Text style={styles.labelText}>Businesses</Text> : '',
                }}
            />
            <Tab.Screen name={ScreenNames.AdminUserMainScreen}
                component={AdminUserMainScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/Images/usersTab.png')}
                            style={[styles.image, { tintColor: focused ? Colors.orangeColor : "#00000050" }]}
                        />
                    ),
                    tabBarLabel: ({ focused }) =>
                        focused ? <Text style={styles.labelText}>Users</Text> : '',
                }}
            />
            <Tab.Screen name={ScreenNames.AdminResolutionsMainScreen}
                component={AdminResolutionsMainScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/Images/resolutionsTab.png')}
                            style={[styles.image, { tintColor: focused ? Colors.orangeColor : "#00000050" }]}
                        />
                    ),
                    tabBarLabel: ({ focused }) =>
                        focused ? <Text style={styles.labelText}>Resolutions</Text> : '',
                }}
            />
        </Tab.Navigator>
    )
}

export default AdminTabbarContainer

const styles = StyleSheet.create({
    labelText: {
        fontSize: 13,
        fontFamily: CustomFonts.InterMedium,
        color: Colors.orangeColor,
        marginTop: -20,
    },
    image: {
        height: 28 / 930 * screenHeight,
        width: 28 / 930 * screenHeight,
        resizeMode: 'contain',
    },
})