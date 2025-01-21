import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { IconButton, PaperProvider, MD3DarkTheme } from 'react-native-paper';
import Header from './Header';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from '../theme/index.js';
import * as NavigationBar from 'expo-navigation-bar';

// System navigation bar settings
if(Platform.OS=="android") {
  NavigationBar.setBackgroundColorAsync(colors.darkGrey);
  NavigationBar.setVisibilityAsync('hidden');
  NavigationBar.setBehaviorAsync('overlay-swipe');
}

const theme = {
  ...MD3DarkTheme,

  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.noteGeoYellow,
    onPrimary: colors.darkGrey,
    primaryContainer: colors.darkGrey,
    secondaryContainer: colors.noteGeoYellow,
    onSecondaryContainer: colors.fullBlack,
    outline: colors.darkGrey,
  },
};

export default function ScreenWrapper({children ,title, isHeaderVisible, iconName, onPress}) {
  let statusBarHeight = !isHeaderVisible? StatusBar.currentHeight? StatusBar.currentHeight: Platform.OS=="ios"? 35: 25 : 0;
  return (
    <PaperProvider theme={theme}>
      <Header title={title} isVisible={isHeaderVisible}>
        <IconButton icon={iconName} size={35} iconColor={colors.fullWhite} onPress={onPress}></IconButton>
      </Header>
			<GestureHandlerRootView style={[styles.container, {paddingTop: statusBarHeight}]}>
        {
            children
        }
      </GestureHandlerRootView>
      <StatusBar style='light' />
		</PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.midGrey,
    alignItems: 'center',
    height: '100%',
  },
});