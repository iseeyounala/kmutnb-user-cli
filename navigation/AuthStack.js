import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HeaderStack from '../components/HeaderStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Group
        screenOptions={() => ({
          // presentation: 'modal',
          headerShown: true,
        })}>
        <Stack.Screen
          options={{
            header: () => <HeaderStack title="สมัคร" />,
          }}
          name="Register"
          component={RegisterScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthStack;
