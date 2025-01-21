import { View, Text, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import { addDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, usersRef } from '../config/firebase';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { colors } from '../theme';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';

export default function UsernameScreen() {
    const navigation = useNavigation();
    const isHeaderVisible = true;
    const [username, setUsername] = useState('');
    const [userProfileId, setUserProfileId] = useState('');
    const {user} = useSelector(state => state.user);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);

    const fetchUsername = async ()=>{
        setLoading(true);
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc=>{
            setUsername(doc.data().username);
            setUserProfileId(doc.id);
        })
        setLoading(false);
    }

    useEffect(()=>{
        if(isFocused){
            fetchUsername();
        }
    },[isFocused])

    const updateUsername = async ()=>{
        if(username){
            setLoading(true);
            const q0 = query(usersRef, where("username", "==", username));
            const querySnapshot0 = await getDocs(q0);
            if (!querySnapshot0.empty) {
                Toast.showWithGravity(
                    'Username is not available',
                    Toast.LONG,
                    Toast.BOTTOM,
                );
            } else {
                try{
                    if (userProfileId) {
                        await updateDoc(doc(db, "users", userProfileId), {
                            username: username,
                            createdAt: serverTimestamp(),
                        })
                        setLoading(false);
                        setUsername("");
                        navigation.navigate('Profile');
                    } else {
                        let doc = await addDoc(usersRef, {
                            username,
                            userId: user.uid,
                            createdAt: serverTimestamp(),
                        });
                        setLoading(false);
                        if(doc && doc.id){
                            setUsername("");
                            navigation.navigate('Profile');
                        }
                    }
                } catch(e){
                    throw e;
                }
            }
        } else{
            Toast.showWithGravity(
                'Failed',
                Toast.LONG,
                Toast.BOTTOM,
            );
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
                        <View className="w-80 mb-2">
                            <TextInput mode="outlined"
                                label="Username"
                                placeholder="john_wick"
                                value={username} 
                                onChangeText={value=> setUsername(value)}
                                style={styles.textInput} 
                                autoCapitalize='none'
                                textColor={colors.fullWhite}
                                outlineColor={colors.darkGrey}
                                activeOutlineColor={colors.noteGeoYellow}
                                className="mb-4"
                            />
                        </View>
                        <Button mode="contained" onPress={()=>updateUsername()} className="w-full my-2">
                            <Text>Save</Text>
                        </Button>
                    </>
                )}
        </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
    textInput: {
      backgroundColor: colors.darkGrey,
      color: 'white',
    }
  });