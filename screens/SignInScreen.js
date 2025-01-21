import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Button from '../components/Button'
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { colors } from '../theme';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Loading from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading } from '../redux/slices/user';
import Toast from 'react-native-simple-toast';

const imageSource = require('../assets/login.png');

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {userLoading} = useSelector(state=> state.user);

  const dispatch = useDispatch();

  const handleSubmit = async ()=>{
    if(email && password){
      try {
        dispatch(setUserLoading(true));
        await signInWithEmailAndPassword(auth, email, password);
        dispatch(setUserLoading(false));
      } catch (err) {
        dispatch(setUserLoading(false));
        Toast.showWithGravity(
          'Incorrect email and password',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } else {
      Toast.showWithGravity(
        'Please fill out all fields.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  }

  return (
    <ScreenWrapper isHeaderVisible={true} title={"Sign In"}>
      <View className="mt-8 mb-2 items-center">
        <Image source={imageSource} className="h-80 w-80 rounded-full" />
      </View>
      <View className="w-80 mb-2">
        <TextInput mode="outlined"
          label="Email"
          placeholder="example@gmail.com"
          right={<TextInput.Affix text="/100" />}
          value={email} 
          onChangeText={value=> setEmail(value)} 
          style={styles.textInput} 
          autoCapitalize='none'
          autoCorrect={false}
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
      </View>
      <Pressable>
        <Text className="text-white">Forget password?</Text>
      </Pressable>
      <View className="mt-16">
        {
          userLoading? (
            <Loading />
          ): (
            <Button theme="primary" label="Sign In" onPress={handleSubmit}/>
          )
        }
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