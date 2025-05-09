import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../modules/shared/constants/colors.constant';
import { supabase } from '../../modules/auth/services/supabase.service';
import { use, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { onboardingLifeInputAtom } from '../../store';

const getLifeGoals = async (msg: string) => {
  return await supabase.functions.invoke('get-life-goals', {
    body: {
      msg,
    },
  });
};

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
