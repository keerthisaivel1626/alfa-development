import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Route from './src/routes/Route';
import { MenuProvider } from 'react-native-popup-menu';
import FlashMessage from "react-native-flash-message";

const App = () => {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <MenuProvider>
            <Route />
          </MenuProvider>
        </Provider>
      </NavigationContainer>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );

};


export default App;
