import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import CustomDrawer from '../components/CustomDrawer';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import TabNavigator from './TabNavigator';
import CarScreen from '../screens/CarScreen';
import HeaderStack from '../components/HeaderStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Group
        screenOptions={() => ({
          // presentation: 'modal',
          headerShown: true,
        })}>
        <Stack.Screen
          name="Car"
          component={CarScreen}
          options={{
            header: () => <HeaderStack title="รถรับส่ง" />,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthStack;
