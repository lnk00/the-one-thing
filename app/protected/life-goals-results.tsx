import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import { Colors } from '../../modules/shared/constants/colors.constant';

export default function LifeGoalsResultsModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Life Goals Results</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    color: Colors.text,
  },
});
