import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Registration from '../pages/preauth/Registration';
import Login from '../pages/preauth/Login';
import VerifyOtp from '../pages/preauth/VerifyOtp';
import { CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();

const PreAuth = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={
          {
            // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }
        }
      />
      {/* <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      /> */}
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={
          {
            // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }
        }
      />
    </Stack.Navigator>
  );
}

export default PreAuth;