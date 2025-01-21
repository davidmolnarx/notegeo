import { View, Text, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../theme';
import { useSelector } from 'react-redux';
import { addDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, usersRef } from '../config/firebase';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';

export default function DisplayNameScreen() {
    const isHeaderVisible = true;
    const navigation = useNavigation();
    const user = useSelector(state=> state.user.user);
    const [displayName, setDisplayName] = useState('');
    const isFocused = useIsFocused();
    const [userProfileId, setUserProfileId] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchDisplayName = async ()=>{
      setLoading(true);
      const q = query(usersRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc=>{
          setDisplayName(doc.data().displayName);
          setUserProfileId(doc.id);
      })
      setLoading(false);
  }

  useEffect(()=>{
      if(isFocused){
        fetchDisplayName();
      }
  },[isFocused])

  const updateDisplayName = async ()=>{
      if(displayName){
          setLoading(true);
          try{
              if (userProfileId) {
                  await updateDoc(doc(db, "users", userProfileId), {
                      displayName: displayName,
                      createdAt: serverTimestamp(),
                  })
                  setLoading(false);
                  setDisplayName("");
                  navigation.navigate('Profile');
              } else {
                  let doc = await addDoc(usersRef, {
                      displayName,
                      userId: user.uid,
                      createdAt: serverTimestamp(),
                  });
                  setLoading(false);
                  if(doc && doc.id){
                      setDisplayName("");
                      navigation.navigate('Profile');
                  }
              }
          } catch(e){
              throw e;
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
                                label="Name"
                                placeholder="John Wick"
                                value={displayName} 
                                onChangeText={value=> setDisplayName(value)}
                                style={styles.textInput} 
                                autoCapitalize='none'
                                textColor={colors.fullWhite}
                                outlineColor={colors.darkGrey}
                                activeOutlineColor={colors.noteGeoYellow}
                                className="mb-4"
                            />
                        </View>
                        <Button mode="contained" onPress={()=>updateDisplayName()} className="w-full my-2">
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