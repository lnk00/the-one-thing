import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../modules/shared/constants/colors.constant';
import { useAtomValue } from 'jotai';
import { onboardingLifeInputAtom } from '../../store';
import {
  LifeGoalsData,
  useLifeGoalsExtractor,
} from '../../modules/onboarding/hooks/use-life-goals-extractor.hook';

const DomainSection = ({
  title,
  goals,
}: { title: string; goals: string[] }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {goals.map((goal, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <Text key={index} style={styles.goalText}>
        {goal}
      </Text>
    ))}
  </View>
);

export default function LifeGoalsResultsModal() {
  const lifeInput = useAtomValue(onboardingLifeInputAtom);
  const { data, isLoading, isError, error } = useLifeGoalsExtractor(lifeInput);

  const domainTitles: Record<keyof LifeGoalsData, string> = {
    career: 'Career',
    health: 'Health',
    relationships: 'Relationships',
    personal_growth: 'Personal Growth',
    finances: 'Finances',
    spirituality: 'Spirituality',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Life Goals Results</Text>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Analyzing your life goals...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            An error occurred: {error?.message || 'Failed to fetch life goals'}
          </Text>
        </View>
      )}

      {!isLoading && !isError && data && (
        <ScrollView style={styles.resultsContainer}>
          {Object.entries(domainTitles).map(([domain, title]) => (
            <DomainSection
              key={domain}
              title={title}
              goals={data[domain as keyof LifeGoalsData] || []}
            />
          ))}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    marginVertical: 16,
  },
  errorText: {
    color: '#ff5555',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.text,
  },
  goalText: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.text,
    padding: 16,
    backgroundColor: Colors.muted.background,
    borderRadius: 8,
  },
});
