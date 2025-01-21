import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image, Dimensions } from 'react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { FlatList } from 'react-native';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, postsRef, requestRef, usersRef } from '../config/firebase';
import Loading from '../components/Loading';
import { Button } from 'react-native-paper';
import { colors } from '../theme';
import Toast from 'react-native-simple-toast';

const defaultProfilePicture = require('../assets/profile.png');

export default function OtherUsersPostsScreen( route ) {
    const isHeaderVisible=true;
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [postCount, setPostCount] = useState('');
    const [connectionCount, setConnectionCount] = useState('');
    const [sentMeARequest, setSentMeARequest] = useState(false);
    const [requested, setRequested] = useState(false);
    const [otherUserProfileId, setOtherUserProfileId] = useState('');
    const [userProfileId, setUserProfileId] = useState('');
    const [yourFriend, setYourFriend] = useState('');
    const [myFriends, setMyFriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const isFocused = useIsFocused();

    const {user} = useSelector(state => state.user);

    const userId = route.route.params? route.route.params.userId : user.uid;

    const windowWidth = Dimensions.get('window').width;
    const itemSize = windowWidth / 3;

    const navigateToTheMap = () => {
      navigation.navigate("Map", { userId: userId, username: username });
    };

    const fetchProfile = async ()=>{
        setLoading(true);
        try {
            const q = query(usersRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc=>{
                setOtherUserProfileId(doc.id);
                setUsername(doc.data().username);
                setPhotoUrl(doc.data().photoUrl);
                setFriends(doc.data().friends?? []);
                setConnectionCount(doc.data().friends ? doc.data().friends.length : 0);
                setYourFriend(doc.data().friends ? doc.data().friends.includes(user.uid) : false);
            })
            await fetchMyProfile();
            await fetchPosts();
            await isSentMeARequest();
            await isRequested();
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

    const fetchMyProfile = async ()=>{
      try {
          const q = query(usersRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc=>{
              setUserProfileId(doc.id);
              setMyFriends(doc.data().friends?? []);
          })
      } catch (error) {
          Toast.showWithGravity(
            error,
            Toast.LONG,
            Toast.BOTTOM,
          );
      }
    }

    const isSentMeARequest = async ()=>{
      const q = query(requestRef, where("from", "==", userId), where("to", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          setSentMeARequest(true);
      }
    }

    const isRequested = async ()=>{
      const q = query(requestRef, where("from", "==", user.uid), where("to", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          setRequested(true);
      }
    }

    const fetchPosts = async ()=>{
        const q = query(postsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc=>{
            data.push({...doc.data(), id: doc.id});
        })
        setPostCount(data.length);
        data.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(data);
    }

    const handleConnectRequest = async ()=>{
        try{
          let doc = await addDoc(requestRef, {
            from: user.uid,
            to : userId,
            createdAt: serverTimestamp(),
          });
          if(doc && doc.id){
          }
        }catch(e){
          throw e;
        }
    }

    const handleAcceptRequest = async ()=>{
      try{
        let friendsTemp = friends;
        friendsTemp.push(user.uid);
        await updateDoc(doc(db, "users", otherUserProfileId), {
          friends: friendsTemp,
          createdAt: serverTimestamp(),
        });
        let friendsTemp2 = myFriends;
        friendsTemp2.push(userId);
        await updateDoc(doc(db, "users", userProfileId), {
          friends: friendsTemp2,
          createdAt: serverTimestamp(),
        });
      }catch(e){
        throw e;
      }
  }

    useEffect(()=>{
        if(isFocused){
            fetchProfile();
        }
    },[isFocused])

  return (
    <ScreenWrapper isHeaderVisible={isHeaderVisible} title={username} iconName={yourFriend? "earth" : ''} onPress={yourFriend? navigateToTheMap : ""}>
      {
          loading? (
            <View className="w-full h-full justify-center">
              <Loading />
            </View>
          ):(
            <>
              <View className="w-full flex flex-row flex-start">
                <View className="p-4 w-1/3">
                    <Pressable className="" onPress={() => navigation.navigate("Map", { userId: userId, username: username })}>
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
              {
                yourFriend? (
                  <>
                    <View className="w-full flex flex-row flex-start px-4 pb-4">
                      <Button icon="connection" mode="contained" buttonColor={colors.darkGrey} textColor={colors.fullWhite} className="w-full">
                        <Text>Connected</Text>
                      </Button>
                    </View>
                    <FlatList
                        data={posts}
                        numColumns={3}
                        ListEmptyComponent={<EmptyList message={" "}/>}
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
                ):(
                  <View className="w-full flex flex-row flex-start px-4 pb-4">
                    { sentMeARequest? (
                      <Button icon="connection" mode="contained" onPress={() => handleAcceptRequest()} className="w-full">
                        <Text>Accept Request</Text>
                      </Button>
                    ): requested?(
                      <Button icon="connection" mode="contained" buttonColor={colors.darkGrey} textColor={colors.fullWhite} className="w-full">
                        <Text>Requested</Text>
                      </Button>
                    ):(
                      <Button icon="connection" mode="contained" onPress={() => handleConnectRequest()} className="w-full">
                        <Text>Connect</Text>
                      </Button>
                    )
                    }
                  </View>
                )}
            </>
          )
        }
    </ScreenWrapper>
  )
}