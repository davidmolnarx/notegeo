import { View, Text } from 'react-native'
import React from 'react'

export default function EmptyList({message}) {
  return (
    <View className="flex justify-center items-center my-5 space-y-3">
      <Text className="font-bold text-white my-5">{message || 'No results found.'}</Text>
    </View>
  )
}