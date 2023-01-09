import React from 'react';
import {Dimensions, View, StyleSheet, Platform} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  ClockIcon,
  QrCodeIcon,
  BellAlertIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const {height} = Dimensions.get('window');

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={route => ({
        tabBarActiveTintColor: '#FFB45C',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#FFF',
          // opacity: 0.3,
          height: Platform.OS === 'ios' ? height * 0.1 : 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Kanit-Medium',
          fontSize: 13,
        },
      })}>
      <Tab.Screen
        name="หน้าหลัก"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ประวัติ"
        component={HistoryScreen}
        options={{
          headerShown: false,
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: 'red'},
          tabBarIcon: ({color, size}) => (
            <ClockIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="แสกน"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <View style={style.radius_out}>
              <View style={style.radius_in}>
                <QrCodeIcon color="#FFF" size={size} />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="แจ้งเตือน"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <BellAlertIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="บัญชี"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const style = StyleSheet.create({
  radius_in: {
    backgroundColor: '#FFB45C',
    width: 50,
    height: 50,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radius_out: {
    backgroundColor: '#FFFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
});
