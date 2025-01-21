import { View } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import AddPostScreen from '../screens/AddPostScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PostsScreen from '../screens/PostsScreen'
import UsersScreen from '../screens/UsersScreen'
import ConnectedUsersScreen from '../screens/ConnectedUsersScreen'

const Tab = createBottomTabNavigator();

export default function RootScreens() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.darkGrey,
          borderTopWidth: 0,
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            top: focused ? 0 : 0
          }}>
            <MaterialCommunityIcons 
              name={focused ? 'home' : 'home-outline'}
              color={focused ? colors.noteGeoYellow : 'gray'}
              size={focused ? 38 : 35}
            />
          </View>
        ),
        headerShown: false
      }}/>
      <Tab.Screen name="ConnectedUsers" component={ConnectedUsersScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            top: focused ? 0 : 0
          }}>
            <MaterialCommunityIcons 
              name={focused ? 'account-group' : 'account-group-outline'} 
              color={focused ? colors.noteGeoYellow : 'gray'}
              size={focused ? 38 : 35}
            />
          </View>
        ),
        headerShown: false
      }}/>
      <Tab.Screen name="AddPost" component={AddPostScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            top: focused ? 0 : 0
          }}>
            <MaterialCommunityIcons 
              name={focused ? 'plus-box' : 'plus-box-outline'} 
              color={focused ? colors.noteGeoYellow : 'gray'}
              size={focused ? 38 : 35}
            />
          </View>
        ),
        headerShown: false
      }}/>
      <Tab.Screen name="Users" component={UsersScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            top: focused ? 0 : 0
          }}>
            <MaterialCommunityIcons 
              name={focused ? 'magnify' : 'magnify'} 
              color={focused ? colors.noteGeoYellow : 'gray'}
              size={focused ? 38 : 35}
            />
          </View>
        ),
        headerShown: false
      }}/>
      <Tab.Screen name="Posts" component={PostsScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            top: focused ? -2 : 0
          }}>
            <MaterialCommunityIcons 
              name={focused ? 'image' : 'image-outline'}
              color={focused ? colors.noteGeoYellow : 'gray'}
              size={focused ? 38 : 35}
            />
          </View>
          ),
          headerShown: false
      }}/>
    </Tab.Navigator>
  )
}