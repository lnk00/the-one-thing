import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
const domains = [
  {
    name: 'Career',
    icon: <MaterialCommunityIcons name="briefcase" size={20} color="#000000" />,
    description:
      'Professional achievements, skills development, and work-life balance.',
  },
  {
    name: 'Health',
    icon: <Ionicons name="fitness" size={20} color="#000000" />,
    description:
      'Physical fitness, nutrition, mental wellbeing, and preventive care.',
  },
  {
    name: 'Relationships',
    icon: <Ionicons name="people" size={20} color="#000000" />,
    description:
      'Family bonds, friendships, romantic relationships, and social connections.',
  },
  {
    name: 'Personal Growth',
    icon: <Ionicons name="person" size={20} color="#000000" />,
    description:
      'Learning new skills, self-improvement, hobbies, and expanding comfort zones.',
  },
  {
    name: 'Finances',
    icon: <FontAwesome5 name="money-bill-wave" size={16} color="#000000" />,
    description:
      'Saving, investing, debt management, and financial independence.',
  },
  {
    name: 'Spirituality',
    icon: (
      <MaterialCommunityIcons name="meditation" size={20} color="#000000" />
    ),
    description:
      'Inner peace, purpose, faith practices, and connection to something greater.',
  },
];

export default function LearnMoreModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Life Goals Domains</Text>
      <Text style={styles.modalText}>
        Setting specific goals for different life domains helps you create a
        balanced and fulfilling life. Explore these key areas:
      </Text>

      <ScrollView
        style={styles.domainsContainer}
        showsVerticalScrollIndicator={false}
      >
        {domains.map((domain, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <View key={index} style={styles.domainCard}>
            <View style={styles.domainIconContainer}>{domain.icon}</View>
            <View style={styles.domainContent}>
              <Text style={styles.domainTitle}>{domain.name}</Text>
              <Text style={styles.domainDescription}>{domain.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  domainsContainer: {
    flex: 1,
  },
  domainCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  domainIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  domainContent: {
    flex: 1,
  },
  domainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  domainDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
});
