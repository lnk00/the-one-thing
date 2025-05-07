import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function Signin() {
  return (
    <View style={[styles.container]}>
      <Text>Signin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
