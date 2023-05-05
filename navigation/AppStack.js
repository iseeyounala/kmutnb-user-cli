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
import CarEmgcyScreen from '../screens/CarEmgcyScreen';
import DetailRoomScreen from '../screens/DetailRoomScreen';
import SearchRoomScreen from '../screens/SearchRoomScreen';
import EquipmentListScreen from '../screens/EquipmentListScreen';
import BorrowEqList from '../screens/BorrowEqList';
import ActivityList from '../screens/ActivityList';
import DetailActivityScreen from '../screens/DetailActivityScreen';
import MyActivityScreen from '../screens/MyActivityScreen';
import ReportActivity from '../screens/ReportActivity';
import CancelUrgentDetail from '../screens/CancelUrgentDetail';
import EditAccountScreen from '../screens/EditAccountScreen';

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
          <Stack.Screen
            name="CarEmgcyScreen"
            component={CarEmgcyScreen}
            options={{
              header: () => <HeaderStack title="รถเกิดปัญหา" />,
            }}
          />
          <Stack.Screen
            name="SearchRoomScreen"
            component={SearchRoomScreen}
            options={{
              header: () => <HeaderStack title="ค้นหาห้อง" />,
            }}
          />
          <Stack.Screen
            name="DetailRoomScreen"
            component={DetailRoomScreen}
            options={{
              header: () => <HeaderStack title="รายละเอียดห้อง" />,
            }}
          />
          <Stack.Screen
            name="EquipmentListScreen"
            component={EquipmentListScreen}
            options={{
              header: () => <HeaderStack title="อุปกรณ์ทั้งหมด" />,
            }}
          />
          <Stack.Screen
            name="BorrowEqList"
            component={BorrowEqList}
            options={{
              header: () => <HeaderStack title="การยืม" />,
            }}
          />
          <Stack.Screen
            name="ActivityList"
            component={ActivityList}
            options={{
              header: () => <HeaderStack title="กิจกรรม" />,
            }}
          />
          <Stack.Screen
            name="DetailActivityScreen"
            component={DetailActivityScreen}
            options={{
              header: () => <HeaderStack title="กิจกรรม" />,
            }}
          />
          <Stack.Screen
            name="MyActivityScreen"
            component={MyActivityScreen}
            options={{
              header: () => <HeaderStack title="กิจกรรมของฉัน" />,
            }}
          />
          <Stack.Screen
            name="ReportActivity"
            component={ReportActivity}
            options={{
              header: () => <HeaderStack title="รายงานผล" />,
            }}
          />
          <Stack.Screen
            name="CancelUrgentDetail"
            component={CancelUrgentDetail}
            options={{
              header: () => <HeaderStack title="รถ (ฉุกเฉิน)" />,
            }}
          />
          <Stack.Screen
            name="EditAccountScreen"
            component={EditAccountScreen}
            options={{
              header: () => <HeaderStack title="แก้ไขข้อมูล" />,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
      <FlashMessage position="top" />
    </>
  );
};

export default AuthStack;
