import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { colors } from '../theme/index.js';

export default function Header({ children, title, isVisible }) {
  const navigation = useNavigation();

  if (!isVisible) {
    return null;
  }
  return (
    <Appbar.Header style={styles.header} classname="">
      <View className="w-full flex-row justify-between items-center">
        <Appbar.BackAction color={colors.fullWhite} onPress={() => {navigation.goBack()}} />
        <Text style={styles.headerTitle} classname="justify-end">{title}</Text>
        {
          children
        }
      </View>
		</Appbar.Header>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.midGrey,
  },
  headerTitle: {
    fontSize: 20,
    color: colors.fullWhite,
  },
});