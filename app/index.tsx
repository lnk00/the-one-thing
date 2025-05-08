import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import Button from '../components/button';
import { useAtom } from 'jotai';
import { sessionAtom } from '../state/auth-state';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '../services/supabase';

export default function Signin() {
  const [_, setSession] = useAtom(sessionAtom);

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
  };

  return (
    <View style={[styles.container]}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
        onPress={async () => {
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
                console.log('OOOOOOK');
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
        }}
      />

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
