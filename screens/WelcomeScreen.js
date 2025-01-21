import { View, Text, Image } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const imageSource = require('../assets/icon.png');

export default function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <ScreenWrapper>
            <View className="h-full items-center justify-center">
                <View className="">
                    <Image source={imageSource} className="h-80 w-80 rounded-full" />
                </View>
                <View>
                    <View className="justify-center items-center">
                        <Text className="font-bold text-white text-5xl items-center mt-6 mb-28">NoteGeo</Text>
                    </View>
                    <View className="justify-center items-center">
                        <Button theme="primary" label="Sign in" onPress={() => navigation.navigate('SignIn')}/>
                        <Text className="text-white">or</Text>
                        <Button label="Sign up" onPress={() => navigation.navigate('SignUp')}/>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}