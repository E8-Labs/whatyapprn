import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMainScreen from '../Screens/ProfileFlow/ProfileMainScreen';
import CustomerProfileDetails from '../Screens/ProfileFlow/CustomerProfileDetails';

// Stack navigator for Profile-related screens
const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = ({ user, role,from }) => {
  console.log('user on profile stacks screen', user)
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'business' ? (
        <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
      ) : (
        <ProfileStack.Screen
          name="CustomerProfileDetails"
          component={CustomerProfileDetails}
          initialParams={{ user }} // Pass user object
        />
      )}
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen
