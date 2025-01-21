import { Dimensions, Image, Platform, View } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getDocs, query, where } from 'firebase/firestore';
import { postsRef } from '../config/firebase';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');


export default function Map({ userId, days }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const {user} = useSelector(state => state.user);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      (async () => {
        await permissionRequest();
        await dateGen();
        await fetchPosts();
        setLoading(false);
      })();
    } else {
      setPosts([]);
      setDate(null);
    }
  }, [isFocused, days]);


  const permissionRequest = async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Toast.showWithGravity(
        'Permission to access location was denied',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    await fetchPosts();
  }

  const dateGen = async ()=>{
    if(days > 0) {
      const currentDate = new Date();
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - days);
      setDate(newDate);
    }
  }

  const fetchPosts = async ()=>{
      let q="";
      let data = [];
      if (days > 0) {
        q = query(postsRef, where("createdAt", ">=", date));
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
          if (doc.data().userId != user.uid){
            data.push({ ...doc.data(), id: doc.id });
          }
        }
      } else {
        q = query(postsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
          data.push({ ...doc.data(), id: doc.id });
        }
      }
      await setPosts(data);
  }

  return (
    <View className="h-full justify-center">
        {
          loading? (
            <Loading />
          ):(
            <MapView
                style={{width: width, height: Platform.OS=="ios" ? height-110 : height}}
                mapType="mutedStandard"
                rotateEnabled={false}
                showUserLocation={true} 
                initialRegion={{
                    latitude: location ? location.coords.latitude : 0,
                    longitude: location ? location.coords.longitude : 0,
                    latitudeDelta: 0,
                    longitudeDelta: 12,
                }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                description="This is your current location"
              />
              {posts.map((item)=>(
                item.location && (
                  <Marker
                    coordinate={{
                      latitude: item.location ? item.location.lat : 0,
                      longitude: item.location ? item.location.lng : 0,
                    }}
                    title={item.description}
                    description={item.place}
                    key={item.id}
                    onPress={() => navigation.navigate('PostDetail', { post: item })}
                  >
                    <Image source={{ uri: item.imageUrl }} style={{ width:44, height:33 }}/>
                  </Marker>
                )
              ))}
            </MapView>
          )
        }
      </View>
  )
}