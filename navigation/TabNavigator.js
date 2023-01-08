import React from 'react';
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
import TabNav from '../components/TabNav';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        component={HomeStack}
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
            <QrCodeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="แจ้งเตือน"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <BellAlertIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="บัญชี"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
