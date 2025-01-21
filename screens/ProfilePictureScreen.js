import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, usersRef,  } from '../config/firebase';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { addDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Button } from 'react-native-paper';
import Toast from 'react-native-simple-toast';

const PlaceholderImage = require('../assets/profile.png');

export default function ProfilePictureScreen() {
    const navigation = useNavigation();
    const isHeaderVisible = true;
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const user = useSelector(state=> state.user.user);
    const isFocused = useIsFocused();
    const [photoUrl, setPhotoUrl] = useState('');
    const [userProfileId, setUserProfileId] = useState('');

    const pickImage = async() => {
        try{
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.3,
                width: 800,
                allowsMultipleSelection: false,
            });
            if(!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }catch(e){
           throw e;
        }
    }

    const fetchPhotoUrl = async ()=>{
        setLoading(true);
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc=>{
            setUserProfileId(doc.id);
            setPhotoUrl(doc.data().photoUrl);
        })
        setLoading(false);
    }

    useEffect(()=>{
        if(isFocused){
            fetchPhotoUrl();
        }
    },[isFocused])

    const updateProfilePicture = async ()=>{
        if(image) {
            setLoading(true);
            try {
                const response = await fetch(image);
                const blob = await response.blob();
                const timestamp = Date.now();
                const filename = `images/${user.uid}/${timestamp}.jpg`;

                const uploadRef = ref(storage, filename);
                const imagesnap = await uploadBytes(uploadRef, blob);
                const url = await getDownloadURL(imagesnap.ref)
                
                if (user && url) {
                    try{
                        if (userProfileId) {
                            await updateDoc(doc(db, "users", userProfileId), {
                                photoUrl: url,
                                createdAt: serverTimestamp(),
                            })
                            setLoading(false);
                            navigation.navigate('Profile');
                            
                        } else {
                            let doc = await addDoc(usersRef, {
                                photoUrl: url,
                                userId: user.uid,
                                createdAt: serverTimestamp(),
                            });
                            setLoading(false);
                            if(doc && doc.id){
                                navigation.navigate('Profile');
                            }
                        }
                    } catch(e){
                        setLoading(false);
                        throw e;
                    }
                } else{
                    Toast.showWithGravity(
                        'Failed',
                        Toast.LONG,
                        Toast.BOTTOM,
                    );
                }
            } catch(e){
                setLoading(false);
                throw e;
            }
        }
    }

    return (
        <ScreenWrapper isHeaderVisible={isHeaderVisible}>
            <View className="h-full items-center justify-center">
            {
                loading? (
                    <Loading />
                ):(
                    <>
                    <Pressable className="px-8 mb-4" onPress={pickImage}>
                        <Image source={image  ? { uri: image } : photoUrl ? { uri: photoUrl } : PlaceholderImage} className="h-64 w-64 rounded-full" />
                    </Pressable>
                    <Button mode="contained" onPress={()=>updateProfilePicture()} className="w-full my-2">
                        <Text>Save</Text>
                    </Button>
                    </>
                )
            }
            </View>
        </ScreenWrapper>
    )
}