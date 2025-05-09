import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../modules/shared/constants/colors.constant';
import { supabase } from '../../modules/auth/services/supabase.service';
import { use } from 'react';

const getLifeGoals = async () => {
  return await supabase.functions.invoke('get-life-goals', {
    body: {
      msg: 'I want to be a sowtware engineer in a FANG company',
    },
  });
};

const getLifeGoalsPromise = getLifeGoals();

export default function LifeGoalsResultsModal() {
  const { data, error } = use(getLifeGoalsPromise);

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Life Goals Results</Text>
      <Text>{data.career}</Text>
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
