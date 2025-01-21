import { View } from 'react-native'
import React from 'react'
import Map from '../components/Map'
import ScreenWrapper from '../components/ScreenWrapper'
import { useNavigation } from '@react-navigation/native';

export default function MapScreen( route ) {
  const userId = route.route.params.userId;
  const username = route.route.params.username?? null;
  const navigation = useNavigation();

  const navigateToTheProfile = () => {
    navigation.navigate("OtherUsersPosts", { userId: userId });
  };

  return (
    <ScreenWrapper title={username} isHeaderVisible={true} iconName={"account"} onPress={navigateToTheProfile}>
        <View className="">
            <Map userId={userId}/>
        </View>
    </ScreenWrapper>
  )
}