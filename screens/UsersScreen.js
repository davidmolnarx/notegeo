import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper';
import { Image, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { FlatList } from 'react-native';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { usersRef } from '../config/firebase';
import { getDocs, limit, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { colors } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';

const defaultProfilePicture = require('../assets/profile.png');

export default function UsersScreen() {
    const isHeaderVisible=false;
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const user = useSelector(state=> state.user.user);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(isFocused){
          searchByUsername();
        }
    },[isFocused, searchText])

    const searchByUsername = async ()=>{
        setLoading(true);
        try{
            const q = query(usersRef, where('username', '>=', searchText), where('username', '<=', searchText + '\uf8ff'), limit(10));
            
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach(async doc=>{
              if (doc.data().userId !== user.uid){
                data.push({...doc.data(), id: doc.id});
              }
            })
            setResults(data);
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
      <View className="flex flex-row flex-start w-full px-4 my-4">
        <View className="w-10/12">
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
          />
        </View>
        <View className="w-2/12 justify-center items-end">
          <Pressable onPress={()=> navigation.navigate("ConnectionRequests")}>
            <MaterialCommunityIcons 
                  name={'account-arrow-left-outline'} 
                  color={colors.noteGeoYellow}
                  size={45}
                />
          </Pressable>
        </View>
      </View>
      {
          loading? (
              <View className="h-full justify-center">
                  <Loading />
              </View>
              )
              :
              (
                  <FlatList
                    data={results}
                    numColumns={2}
                    ListEmptyComponent={<EmptyList/>}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{
                        justifyContent: 'space-between'
                    }}
                    className=""
                    renderItem={({item})=>{
                      return (
                        <Pressable onPress={()=> navigation.navigate("OtherUsersPosts", { userId: item.userId })} className="p-3 rounded-2xl mb-3 mx-3" style={styles.card}>
                          <View className="justify-center items-center">
                            <Image source={item.photoUrl ? { uri: item.photoUrl } : defaultProfilePicture} className="w-36 h-36 rounded-full mb-2"/>
                            <Text className="font-bold text-white text-l">{item.username}</Text>
                            <Text className="text-xs text-white">{item.displayName}</Text>
                          </View>
                        </Pressable>
                      )  
                    }}>
                  </FlatList>
              )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.darkGrey,
  },
  card: {
    backgroundColor: colors.darkGrey,
  }
});