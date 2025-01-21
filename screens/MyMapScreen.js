import { View } from 'react-native'
import React from 'react'
import Map from '../components/Map'
import ScreenWrapper from '../components/ScreenWrapper'
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const {user} = useSelector(state => state.user);
  const navigation = useNavigation();

  const navigateToTheProfile = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper isHeaderVisible={true} title={"My Map"} iconName={"account"} onPress={navigateToTheProfile}>
        <View className="">
            <Map userId={user.uid}/>
        </View>
    </ScreenWrapper>
  )
}