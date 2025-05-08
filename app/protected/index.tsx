import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';
import Button from '../../components/button';
import { useRouter } from 'expo-router';
import { supabase } from '../../services/supabase';

export default function Index() {
  const router = useRouter();

  const handleSignout = () => {
    supabase.auth.signOut();
  };

  return (
    <View style={[styles.container]}>
      <Button onPress={handleSignout}>Signout</Button>
      <Button
        onPress={() => {
          router.navigate('protected/onboarding');
        }}
      >
        onboarding
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
