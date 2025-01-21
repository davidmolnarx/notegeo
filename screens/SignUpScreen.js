import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Button from '../components/Button'
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import Toast from 'react-native-simple-toast';
import { colors } from '../theme';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, usersRef } from '../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading } from '../redux/slices/user';
import Loading from '../components/Loading';
import { addDoc, serverTimestamp } from 'firebase/firestore';

const imageSource = require('../assets/signup.png');

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const {userLoading} = useSelector(state=> state.user);

  const dispatch = useDispatch();

  const handleSubmit = async ()=>{
    if(email && password && displayName && username){
      try {
        dispatch(setUserLoading(true));
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        let doc = await addDoc(usersRef, {
          displayName,
          username,
          userId: userCredential.user.uid,
          createdAt: serverTimestamp(),
        });
        if(doc && doc.id){
          dispatch(setUserLoading(false));
        }
      } catch (err) {
        dispatch(setUserLoading(false));
        Toast.showWithGravity(
          err.message,
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } else {
      Toast.showWithGravity(
          'Please fill out all fields',
          Toast.LONG,
          Toast.BOTTOM,
      );
    }
  }

  return (
    <ScreenWrapper isHeaderVisible={true} title={"Sign Up"}>
      <View className="mt-8 mb-2 items-center">
        <Image source={imageSource} className="h-80 w-80" />
      </View>
      <View className="w-80 mb-2">
        <TextInput mode="outlined"
          label="Email"
          placeholder="example@gmail.com"
          value={email} 
          onChangeText={value=> setEmail(value)} 
          style={styles.textInput} 
          autoCapitalize='none'
          textColor={colors.fullWhite}
          outlineColor={colors.darkGrey}
          activeOutlineColor={colors.noteGeoYellow}
          className="mb-4"
        />
        <TextInput mode="outlined"
          label="Password"
          placeholder="$@#ABcd987"
          right={<TextInput.Icon icon="eye" />}
          value={password} 
          onChangeText={value=> setPassword(value)} 
          style={styles.textInput} 
          autoCapitalize='none'
          textColor={colors.fullWhite}
          outlineColor={colors.darkGrey}
          activeOutlineColor={colors.noteGeoYellow}
          className="mb-4"
          secureTextEntry
        />
        <TextInput mode="outlined"
          label="Full Name"
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
      <View className="mt-6 mb-16">
        {
          userLoading? (
            <Loading />
          ): (
            <Button theme="primary" label="Sign Up" onPress={handleSubmit}/>
          )
        }
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.darkGrey,
  }
});