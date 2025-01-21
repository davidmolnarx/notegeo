import { View } from 'react-native'
import React from 'react'
import Map from '../components/Map'
import ScreenWrapper from '../components/ScreenWrapper'
import { useSelector } from 'react-redux';
import { SegmentedButtons } from 'react-native-paper';
import { colors } from '../theme';
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const {user} = useSelector(state => state.user);
  const [value, setValue] = useState('');
  const isFocused = useIsFocused();
  

  useEffect(() => {
    if (isFocused) {
      setValue(14);
    }
  }, [isFocused]);

  return (
    <ScreenWrapper isHeaderVisible={false}>
      <View className="w-full">
        <SegmentedButtons
          defaultValue="14"
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: '7',
              label: '7 day', 
              style: {backgroundColor: value == '7' ? colors.noteGeoYellow : colors.darkGrey} 
            },
            {
              value: '14',
              label: '14 day',
              style: {backgroundColor: value == '14' ? colors.noteGeoYellow : colors.darkGrey}
            },
            { 
              value: '30',
              label: '30 day',
              style: {backgroundColor: value == '30' ? colors.noteGeoYellow : colors.darkGrey}
            },
          ]}
          className="py-3 px-10"
          theme={{
            roundness: 2,
          }}
        />
      </View>
      <View className="">
        <Map userId={user.uid} days={value}/>
      </View>
    </ScreenWrapper>
  )
}