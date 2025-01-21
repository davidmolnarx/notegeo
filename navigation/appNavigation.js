import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RootScreens from './RootScreens'
import HomeScreen from '../screens/HomeScreen';
import AddPostScreen from '../screens/AddPostScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import PostsScreen from '../screens/PostsScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfilePictureScreen from '../screens/ProfilePictureScreen';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../redux/slices/user';
import { auth } from '../config/firebase';
import UsernameScreen from '../screens/UsernameScreen';
import DisplayNameScreen from '../screens/DisplayNameScreen';
import MapScreen from '../screens/MapScreen';
import UsersScreen from '../screens/UsersScreen';
import OtherUsersPostsScreen from '../screens/OtherUsersPostsScreen';
import ConnectionRequestsScreen from '../screens/ConnectionRequestsScreen';
import MyMapScreen from '../screens/MyMapScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const user = useSelector(state=> state.user.user);

    const dispatch = useDispatch();

    onAuthStateChanged(auth, u=>{
      dispatch(setUser(u));
    })

    if (user) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Root' screenOptions={{ animation: 'none' }}>
            <Stack.Screen options={{headerShown: false}} name="Root" component={RootScreens} />
            <Stack.Screen options={{headerShown: false}} name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
            <Stack.Screen options={{headerShown: false}} name="Users" component={UsersScreen} />
            <Stack.Screen options={{headerShown: false}} name="Map" component={MapScreen} />
            <Stack.Screen options={{headerShown: false}} name="Posts" component={PostsScreen} />
            <Stack.Screen options={{headerShown: false}} name="OtherUsersPosts" component={OtherUsersPostsScreen} />
            <Stack.Screen options={{headerShown: false}} name="ConnectionRequests" component={ConnectionRequestsScreen} />
            <Stack.Screen options={{headerShown: false}} name="AddPost" component={AddPostScreen} />
            <Stack.Screen options={{headerShown: false}} name="Profile" component={ProfileScreen} />
            <Stack.Screen options={{headerShown: false}} name="MyMap" component={MyMapScreen} />
            <Stack.Screen options={{headerShown: false}} name="ProfilePicture" component={ProfilePictureScreen} />
            <Stack.Screen options={{headerShown: false}} name="Username" component={UsernameScreen} />
            <Stack.Screen options={{headerShown: false}} name="DisplayName" component={DisplayNameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Welcome' screenOptions={{ animation: 'none' }}>
            <Stack.Screen options={{headerShown: false}} name="SignUp" component={SignUpScreen} />
            <Stack.Screen options={{headerShown: false}} name="SignIn" component={SignInScreen} />
            <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }