import { StyleSheet, View } from 'react-native';
import Pager from '../Pager';

export default function Index() {
  return (
    <View style={[styles.container]}>
      <Pager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
