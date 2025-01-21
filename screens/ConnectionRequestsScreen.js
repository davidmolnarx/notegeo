import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { requestRef, usersRef } from '../config/firebase';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import EmptyList from '../components/EmptyList';
import { FlatList } from 'react-native-gesture-handler';
import { getDocs, query, where } from 'firebase/firestore';
import { colors } from '../theme';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';

const defaultProfilePicture = require('../assets/profile.png');

export default function ConnectionRequestsScreen() {
    const isFocused = useIsFocused();
    const {user} = useSelector(state=> state.user);
    const [results, setResults] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(isFocused){
            listConnectionRequests();
        }
    },[isFocused])

    const listConnectionRequests = async ()=>{
        setLoading(true);
        try {
            const q = query(requestRef, where('to', '==', user.uid));
            const querySnapshot = await getDocs(q);
            let data = [];
            for (const doc of querySnapshot.docs) {
                const q1 = query(usersRef, where('userId', '==', doc.data().from));
                const querySnapshot1 = await getDocs(q1);
    
                for (const doc1 of querySnapshot1.docs) {
                    data.push({...doc1.data(), id: doc1.id});
                }
            }
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
    <ScreenWrapper title={"Connection Requests"} isHeaderVisible={true} >
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
                ListEmptyComponent={<EmptyList message={"There are currently no requests."}/>}
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
            )
        }
    </ScreenWrapper>
  )
}
const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.darkGrey,
    }
  });