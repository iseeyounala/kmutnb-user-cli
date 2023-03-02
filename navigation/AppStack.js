import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import FlashMessage from 'react-native-flash-message';
// import CustomDrawer from '../components/CustomDrawer';
import TabNavigator from './TabNavigator';
import HeaderStack from '../components/HeaderStack';
import CarScreen from '../screens/CarScreen';
import BookingRoomScreen from '../screens/BookingRoomScreen';
import ChooseLocation from '../screens/ChooseLocation';
import RoomListScreen from '../screens/RoomListScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <>
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
          <Stack.Screen
            name="BookingRoom"
            component={BookingRoomScreen}
            options={{
              header: () => <HeaderStack title="จองห้อง" />,
            }}
          />
          <Stack.Screen
            name="ChooseLocation"
            component={ChooseLocation}
            options={{
              header: () => <HeaderStack title="เลือกพื้นที่" />,
            }}
          />
          <Stack.Screen
            name="RoomListScreen"
            component={RoomListScreen}
            options={{
              header: () => <HeaderStack title="เลือกห้อง" />,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
      <FlashMessage position="top" />
    </>
  );
};

export default AuthStack;
