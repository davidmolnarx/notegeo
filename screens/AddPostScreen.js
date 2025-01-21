import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import { TextInput } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { useSelector } from 'react-redux';
import { postsRef, storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import ImageViewer from '../components/ImageViewer';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-simple-toast';

const PlaceholderImage = require('../assets/images/add.png');

export default function AddPostScreen() {
  const navigation = useNavigation();
  const [place, setPlace] = useState('');
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state=> state.user);
  const isFocused = useIsFocused();
  const reff = useRef();

  useEffect(() => {
    if(isFocused) {
      pickImage();
    } else {
      reff.current?.clear();
      setImage("");
      setPlace('');
      setLocation('');
      setCurrentLocation('');
      setDescription('');
    }
  }, [isFocused]);

 const pickImage = async() => {
    try{
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.4,
            width: 2000,
            allowsMultipleSelection: false,
        });
        if(!result.canceled) {
          setImage(result.assets[0].uri);
        }
    }catch(e){
       throw e;
    }
}

  const handleAddPost = async ()=>{
    if(place && description && image){
      setLoading(true);
      try{
          const response = await fetch(image);
          const blob = await response.blob();
          const timestamp = Date.now();
          const filename = `images/${user.uid}/${timestamp}.jpg`;
  
          const uploadRef = ref(storage, filename);
          const imagesnap = await uploadBytes(uploadRef, blob);
          const url = await getDownloadURL(imagesnap.ref)

        let doc = await addDoc(postsRef, {
          place,
          location : currentLocation ? currentLocation : location,
          description,
          imageUrl:url,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
  
        setLoading(false);
        if(doc && doc.id){
          setImage("");
          setDescription("");
          setPlace("");
          setLocation("");
          navigation.navigate('Home');
        }
      }catch(e){
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

  const getCurrentLocation = async ()=>{
    let currentLocationLatLng = {};
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let currentLocationAll = await Location.getCurrentPositionAsync({});
    currentLocationLatLng["lat"] = currentLocationAll.coords.latitude;
    currentLocationLatLng["lng"] = currentLocationAll.coords.longitude;
    setCurrentLocation(currentLocationLatLng);
  }

  return (
    <ScreenWrapper>
      <Text className="text-white font-bold text-2xl mt-4 mb-8">New Post</Text>
      <Pressable onPress={pickImage}>
        {
          image == "" ? (
            <View className="h-72 justify-center ">
              <Image source={PlaceholderImage} className="w-36 h-36"/>
            </View>
          ):(
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={image}/>
          )
        }
      </Pressable>
      <View className="w-80 mb-2 mt-12">
        <Text className="text-white text-lg font-bold">Place</Text>
        {
          currentLocation? (
            <>
            <MaterialCommunityIcons
                name={'map-marker'}
                color={colors.noteGeoYellow}
                size={25}
              />
            <TextInput mode="outlined"
              label="Place Name"
              placeholder=""
              value={place} 
              onChangeText={value=> setPlace(value)}
              style={styles.textInput} 
              autoCapitalize='none'
              textColor={colors.fullWhite}
              outlineColor={colors.darkGrey}
              activeOutlineColor={colors.noteGeoYellow}
              className="mb-4"
            />
            </>
          ):(
            <>
            <Pressable onPress={() => getCurrentLocation()}><Text style={{color: colors.noteGeoYellow}}>Use current location</Text> 
              <MaterialCommunityIcons
                name={'map-marker-outline'}
                color={colors.noteGeoYellow}
                size={25}
              />
            </Pressable>
            <GooglePlacesAutocomplete
              ref={reff}
              className="p-2 bg-white rounded-xl mb-4"
              placeholder=""
              styles={{
                row: {
                  backgroundColor: colors.darkGrey,
                  border: 0,
                  padding: 0,
                },
                row: {
                  backgroundColor: colors.darkGrey,
                },
                description: {
                  color: colors.fullWhite,
                },
                container: {
                  flex: 0,
                },
                textInput: {
                  backgroundColor: colors.darkGrey,
                  color: 'white',
                },
              }}
              onPress={(data, details = null) => {
                setPlace(data.description);
                setLocation(details.geometry.location);
              }}
              textInputProps={{
                leftIcon: { type: 'font-awesome', name: 'chevron-left' },
                errorStyle: { color: 'red' },
              }}
              fetchDetails={true}
              returnKeyTypr={"search"}
              disableScroll={false}
              enablePoweredByContainer={false}
              minLength={2}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
              }}
              nearbyPlacesAPI='GooglePlacesSearch'
              debounce={400}
            />
            </>
          )
        }
        <TextInput mode="outlined"
            label="Description"
            placeholder=""
            value={description} 
            onChangeText={value=> setDescription(value)}
            style={styles.textInput} 
            autoCapitalize='none'
            textColor={colors.fullWhite}
            outlineColor={colors.darkGrey}
            activeOutlineColor={colors.noteGeoYellow}
            className="mb-4"
          />
      </View>
      <View className="mt-12">
        {
          loading? (
            <Loading />
          ):(
            <Button theme="primary" label="Post" onPress={handleAddPost}/>
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