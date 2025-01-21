import { View, Text, Pressable } from 'react-native'
import { TextInput } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { FlatList } from 'react-native';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { usersRef } from '../config/firebase';
import { getDocs, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { colors } from '../theme';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';

const defaultProfilePicture = require('../assets/profile.png');

export default function UsersScreen() {
  const isHeaderVisible = false;
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [myFriendsDetail, setMyFriendsDetail] = useState([]);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchFriends();
    } else {
      setSearchText("");
    }
  }, [isFocused, searchText])

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const q = query(usersRef, where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q);
      let friends = [];
      
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        if (userData.friends) {
          for (const friendId of userData.friends) {
            const q1 = query(usersRef, where('userId', '==', friendId))
            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach(doc => {
              if (doc.data().username ? doc.data().username.includes(searchText) : false) {
                friends.push({...doc.data(), id: doc.id});
              }
            })
          }
        }
      }
      setMyFriendsDetail(friends);
      setLoading(false);
    } catch (error) {
      Toast.showWithGravity(
        error,
        Toast.LONG,
        Toast.BOTTOM,
      );
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper isHeaderVisible={isHeaderVisible} >
      <Text className="text-white font-bold text-2xl my-4">Connected Users</Text>
        <View className="w-full px-4">
          <TextInput mode="outlined"
            label="Search"
            placeholder=""
            value={searchText} 
            onChangeText={(text) => setSearchText(text)}
            style={styles.textInput} 
            autoCapitalize='none'
            textColor={colors.fullWhite}
            outlineColor={colors.darkGrey}
            activeOutlineColor={colors.noteGeoYellow}
            className="mb-4"
          />
        </View>
        {
            loading? (
            <View className="w-full h-full justify-center">
              <Loading />
            </View>
        ):(
            <>
            <FlatList
              data={myFriendsDetail}
              numColumns={2}
              ListEmptyComponent={<EmptyList/>}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: 'space-between'
              }}
              className=""
              renderItem={({ item }) => {
                return (
                  <Pressable onPress={() => navigation.navigate("Map", { userId: item.userId, username: item.username })} className="p-3 rounded-2xl mb-3 mx-3" style={styles.card}>
                    <View className="justify-center items-center">
                      <Image source={item.photoUrl ? { uri: item.photoUrl } : defaultProfilePicture} className="w-36 h-36 rounded-full mb-2" />
                      <Text className="font-bold text-white text-l">{item.username}</Text>
                      <Text className="text-xs text-white">{item.displayName}</Text>
                    </View>
                  </Pressable>
                )
              }}>
            </FlatList>
            </>
        )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.darkGrey,
    color: 'white',
  },
  card: {
    backgroundColor: colors.darkGrey,
  }
});