import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { auth, usersRef } from '../config/firebase';
import { getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Loading from '../components/Loading';


const PlaceholderImage = require('../assets/profile.png');

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const user = useSelector(state=> state.user.user);
    const isHeaderVisible = true;
    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused){
            fetchProfile();
        }
    },[isFocused])

    const fetchProfile = async ()=>{
        setLoading(true);
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc=>{
            setUsername(doc.data().username); 
            setDisplayName(doc.data().displayName); 
            setProfilePicture(doc.data().photoUrl);
        })
        setLoading(false);
    }

    const handleLogout = async()=>{
        await signOut(auth);
      }

  return (
    <ScreenWrapper isHeaderVisible={isHeaderVisible} iconName={"logout"} onPress={handleLogout}>
        {
            loading? (
                <Loading />
            ):(
                <View className="h-full w-full justify-center items-center pb-8">
                    <Pressable className="mb-4" onPress={() => navigation.navigate("ProfilePicture")}>
                        <Image source={profilePicture ? { uri: profilePicture } : PlaceholderImage} className="h-32 w-32 rounded-full" />
                    </Pressable>
                    <Text className="mb-2 text-white text-xl">{displayName}</Text>
                    <Text className="mb-4 text-white text-l">@{username}</Text>
                    <View className="w-full px-16">
                        <Button mode="contained" onPress={() => navigation.navigate("DisplayName")} className="w-full my-2">
                            <Text>Name</Text>
                        </Button>
                        <Button mode="contained" onPress={() => navigation.navigate("Username")} className="w-full my-2">
                            <Text >Username</Text>
                        </Button>
                        <Button mode="contained" onPress={() => navigation.navigate("ProfilePicture")} className="w-full my-2">
                            <Text >Profile picture</Text>
                        </Button>
                    </View>
                </View>
            )
        }
    </ScreenWrapper>
  )
}