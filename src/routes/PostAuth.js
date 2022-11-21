import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/postauth/Home';
import Members from '../pages/postauth/Members';
import Offers from '../pages/postauth/Offers';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_BLACK, GOLD, WHITE } from '../utils/Colors';
import { HEIGHT } from '../utils/dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Account from '../pages/postauth/Account';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EventDetails from '../pages/postauth/EventDetails';
import ManageEvent from '../pages/postauth/ManageEvent';
import MemberDetails from '../pages/postauth/MemberDetails';
import EventGalleryImage from '../pages/postauth/EventGalleryImage';

const Tab = createBottomTabNavigator();
const Stack = createSharedElementStackNavigator();


const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{

          transitionSpec: {
            open: { animation: 'timing', config: { duration: 200 } },
            close: { animation: 'timing', config: { duration: 200 } },
          },

          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: { opacity: progress },
            }
          },
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Members"
        component={Members}

        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="ManageEvent"
        component={ManageEvent}

        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="EventGalleryImage"
        component={EventGalleryImage}

        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="MemberDetails"
        component={MemberDetails}
        // options={{

        //   transitionSpec: {
        //     open: { animation: 'timing', config: { duration: 500 } },
        //     close: { animation: 'timing', config: { duration: 500 } },
        //   },

        //   cardStyleInterpolator: ({ current: { progress } }) => {
        //     return {
        //       cardStyle: { opacity: progress },
        //     }
        //   }

        // }}
      />
    </Stack.Navigator>
  )
}


const MemberStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Members'
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen
        name="Members"
        component={Members}

        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="MemberDetails"
        component={MemberDetails}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
    </Stack.Navigator>
  )
}


function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabInnerContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              // style={styles.tabInnerContainer}
              key={index}
            >
              {
                route.name == 'HomeStack' ? <Entypo color={isFocused ? GOLD : WHITE} name='home' size={hp(3.5)} />
                  :
                  route.name == 'MemberStack' ? <MaterialIcons color={isFocused ? GOLD : WHITE} name='groups' size={hp(3.5)} />
                  // route.name == 'Gallery' ? <MaterialCommunityIcons color={isFocused ? GOLD : WHITE} name='view-dashboard' size={hp(3.5)} />
                    :
                    route.name == 'Offers' ? <Feather color={isFocused ? GOLD : WHITE} name='gift' size={hp(3.5)} />
                      :
                      route.name == 'Account' ? <Ionicons color={isFocused ? GOLD : WHITE} name='person-circle-outline' size={hp(3.5)} />
                        :
                        null
              }
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}


const PostAuth = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        unmountOnBlur: true,
        // tabBarStyle:{
        //   display:'none'
        // }
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="MemberStack" component={MemberStack} />
      <Tab.Screen name="Offers" component={Offers} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    height: hp(12),
    backgroundColor: GOLD,
    paddingTop: 5,
    borderTopLeftRadius: HEIGHT * .03,
    borderTopRightRadius: HEIGHT * .03,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 9999,
    bottom: 0,
    width: "100%"
  },
  tabInnerContainer: {
    flex: 1,
    backgroundColor: BASE_BLACK,
    borderTopLeftRadius: HEIGHT * .03,
    borderTopRightRadius: HEIGHT * .03,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

  },
})

export default PostAuth