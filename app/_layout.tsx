import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import { useAtom } from 'jotai';
import { sessionAtom } from '../state/auth-state';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useAtom(sessionAtom);
  useEffect(() => {
    SplashScreen.hideAsync();
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.info('Session: ', session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.info('Session: ', session);
    });
  }, [setSession]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Protected guard={session === null}>
            <Stack.Screen name="index" />
          </Stack.Protected>
          <Stack.Protected guard={session !== null}>
            <Stack.Screen name="protected" />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
