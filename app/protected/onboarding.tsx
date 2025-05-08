import { StyleSheet, View } from 'react-native';
import Pager from '../../modules/onboarding/components/pager/pager.component';
import { Colors } from '../../modules/shared/constants/colors.constant';

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
    backgroundColor: Colors.background,
  },
});
