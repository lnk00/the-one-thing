import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import Button from '../components/button';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { sessionAtom } from '../state/auth-state';

export default function Signin() {
  const [_, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const handleSignin = () => {
    setSession({
      access_token: '',
      refresh_token: '',
      user: {
        id: '',
        app_metadata: {},
        aud: '',
        created_at: '',
        user_metadata: {},
      },
      expires_in: 0,
      token_type: '',
    });
    router.navigate('protected');
  };

  return (
    <View style={[styles.container]}>
      <Button onPress={handleSignin}>Signin</Button>
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
  },
});
