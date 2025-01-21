import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image, Dimensions } from 'react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { FlatList } from 'react-native';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getDocs, query, where } from 'firebase/firestore';
import { postsRef, usersRef } from '../config/firebase';
import Loading from '../components/Loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

const defaultProfilePicture = require('../assets/profile.png');

export default function PostsScreen() {
    const isHeaderVisible=false;
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [postCount, setPostCount] = useState('0');
    const [connectionCount, setConnectionCount] = useState('0');
    const isFocused = useIsFocused();

    const {user} = useSelector(state => state.user);

    const windowWidth = Dimensions.get('window').width;
    const itemSize = windowWidth / 3;

    const fetchProfile = async ()=>{
        setLoading(true);
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc=>{
            setUsername(doc.data().username);
            setPhotoUrl(doc.data().photoUrl);
            setConnectionCount(doc.data().friends ? doc.data().friends.length : '0');
        })
        await fetchPosts();
        setLoading(false);
    }

    const fetchPosts = async ()=>{
        const q = query(postsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc=>{
            data.push({...doc.data(), id: doc.id});
        })
        setPostCount(data.length);
        data.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(data);
    }

    useEffect(()=>{
        if(isFocused){
            fetchProfile();
        }
    },[isFocused])

  return (
    <ScreenWrapper isHeaderVisible={isHeaderVisible}>
      {
          loading? (
            <View className="w-full h-full justify-center">
              <Loading />
            </View>
          ):(
            <>
              <View className="w-full flex-row flex justify-between px-4 mt-3">
                <Text className="self-center text-white font-bold text-xl">{username}</Text>
                <View className="flex-row gap-4">
                  <Pressable className="" onPress={() => navigation.navigate("MyMap")}>
                    <MaterialCommunityIcons name="earth" color={colors.fullWhite} size={35} />
                  </Pressable>
                  <Pressable className="" onPress={() => navigation.navigate("Profile")}>
                    <MaterialCommunityIcons name="account-cog" color={colors.fullWhite} size={35} />
                  </Pressable>
                </View>
              </View>
              <View className="w-full flex flex-row flex-start">
                <View className="p-4 w-1/3">
                    <Pressable className="" onPress={() => navigation.navigate("Profile")}>
                        <Image source={photoUrl ? { uri: photoUrl } : defaultProfilePicture} className="h-24 w-24 rounded-full" />
                    </Pressable>
                </View>
                <View className="p-4 w-2/3 flex flex-row flex-start">
                    <View className="w-1/2 justify-center items-center">
                      <Text className="text-white text-2xl font-bold">{postCount}</Text>
                      <Text className="text-white">Posts</Text>
                    </View>
                    <View className="w-1/2 justify-center items-center">
                      <Text className="text-white text-2xl font-bold">{connectionCount}</Text>
                      <Text className="text-white">Connections</Text>
                    </View>
                </View>
              </View>
              <FlatList
                  data={posts}
                  numColumns={3}
                  ListEmptyComponent={<EmptyList message={"You don't have any post yet"}/>}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={{
                      justifyContent: ''
                  }}
                  className="w-full"
                  renderItem={({item})=>{
                  return (
                      <Pressable onPress={()=> navigation.navigate("PostDetail", { post: item })} className="">
                      <View style={{ width: itemSize, height: itemSize, margin: 1 }}>
                          <Image source={{ uri: item.imageUrl }} className="w-full h-full aspect-square"/>
                      </View>
                      </Pressable>
                  )  
                  }}>
              </FlatList>
            </>
          )
        }
      </ScreenWrapper>
  )
}