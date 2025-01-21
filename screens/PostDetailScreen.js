import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper';
import ImageViewer from '../components/ImageViewer';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import { postsRef } from '../config/firebase';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

export default function PostDetailScreen({ route }) {
  const isHeaderVisible = true;
  const post = route.params.post;
  
  const PlaceholderImage = require('../assets/images/background-image.png');
  const user = useSelector(state=> state.user.user);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleDeletePost = async (id, creator)=>{
    if(id && user.uid == creator){
      try{
        setLoading(true);
        const docRef = doc(postsRef, id)
        await deleteDoc(docRef);
        setLoading(false);
        navigation.goBack();
      } catch(error) {
        Toast.showWithGravity(
          error,
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    }
  }
  
  return (
    <ScreenWrapper pageTitle="Post Detail" isHeaderVisible={isHeaderVisible} iconName={user.id == post.userId ? "trash-can-outline" : ""} onPress={() => handleDeletePost(post.id, post.userId)}>
      <View className="justify-center mt-40">
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={post.imageUrl}></ImageViewer>
        <Text className="font-bold text-white mx-4 mt-4">{post.place}</Text>
        <Text className="text-white text-xs mx-4 mt-2">{post.description}</Text>
        {
          loading? (
            <Loading />)
            :
            (
            <></>
          )
        }
      </View>
    </ScreenWrapper>
  )
}