import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import Button from '../components/button';
import { useAtom } from 'jotai';
import { sessionAtom } from '../state/auth-state';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '../services/supabase';
import { AntDesign } from '@expo/vector-icons';

export default function Signin() {
  const [_, setSession] = useAtom(sessionAtom);

  const handleSignin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        console.log(JSON.stringify({ error, user }, null, 2));
        if (!error) {
          // User is signed in.
        }
      } else {
        throw new Error('No identityToken.');
      }
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
        console.log('PROBLEM');
      } else {
        // handle other errors
        console.log('PROBLEMS: ', e);
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <Button
        onPress={handleSignin}
        icon={<AntDesign name="apple1" size={20} color={Colors.background} />}
      >
        Sign in with Apple
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
  },
});
