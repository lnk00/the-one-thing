import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LearnMoreModal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Life Goals Domains</Text>
      <Text style={styles.modalText}>
        Setting specific goals for different life domains helps you create a
        balanced and fulfilling life. Consider domains like career, health,
        relationships, personal growth, and finances.
      </Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    color: '#333333',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});
