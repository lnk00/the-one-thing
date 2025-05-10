import { StyleSheet, View, Text } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Button from '../modules/shared/components/button.component';
import { Colors } from '../modules/shared/constants/colors.constant';
import { supabase } from '../modules/auth/services/supabase.service';

export default function Signin() {
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
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        e.code === 'ERR_REQUEST_CANCELED'
      ) {
        // handle that the user canceled the sign-in flow
        console.log('PROBLEM');
      } else {
        // handle other errors
        console.log('PROBLEMS: ', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>The One Thing</Text>
        <Text style={styles.subtitle}>Focus on what matters most</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.image}
          contentFit="contain"
          priority="high"
        />
      </View>

      <View style={styles.footer}>
        <Button
          onPress={handleSignin}
          icon={<AntDesign name="apple1" size={20} color={Colors.background} />}
          fullWidth
          size="big"
        >
          Sign in with Apple
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    height: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.muted.text,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  footer: {
    height: 100,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
