import { StyleSheet, View, Pressable, Text } from 'react-native';
import { colors } from '../theme/index.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Button({ label, theme, onPress, icon }) {
	if (theme === "primary") {
		return (
			<View style={[styles.buttonContainer, { borderColor: colors.noteGeoYellow }]}>
				<Pressable
					style={[styles.button, { backgroundColor: colors.fullWhite }]}
					onPress={onPress}
				>
          <MaterialCommunityIcons 
                name={icon}
                color= {colors.noteGeoYellow} 
                size={25}
          />
					<Text style={[styles.buttonLabel, { color: colors.midGrey }]}>{label}</Text>
				</Pressable>
			</View>
		);
	}

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
		margin: 3,
		borderWidth: 4,
		borderColor: colors.fullBlack,
		borderRadius: 18,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: colors.fullWhite,
    fontSize: 17,
  },
});
