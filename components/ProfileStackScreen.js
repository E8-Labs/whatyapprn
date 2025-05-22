import React, { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMainScreen from '../Screens/ProfileFlow/ProfileMainScreen';
import CustomerProfileDetails from '../Screens/ProfileFlow/CustomerProfileDetails';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "./GetProfile"; // Adjust path if needed

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = ({ user, role, from, setUser, setRole }) => {
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        console.log("Profile tab focused. Re-checking user role...");
        const data = await AsyncStorage.getItem("USER");
        if (data) {
          const parsed = JSON.parse(data);
          const updated = await getProfile();
          updated.from = "tabbar";
          setUser(updated);
          setRole(updated.role);
          console.log("Updated user info in ProfileStack:", updated);
        }
      };

      fetchUser();
    }, [])
  );

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'business' ? (
        <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />

      ) : (
        <ProfileStack.Screen name="CustomerProfileDetails">
          {() => <CustomerProfileDetails user={user} />}
        </ProfileStack.Screen>

      )}
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
