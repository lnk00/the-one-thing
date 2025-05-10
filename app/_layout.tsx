import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../modules/auth/services/supabase.service';
import { sessionAtom } from '../store';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [session, setSession] = useAtom(sessionAtom);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoaded(true);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        console.info(`User: ${session?.user.email} authenticated`);
      } else {
        console.info('No user authenticated');
      }
    });
  }, [setSession]);

  useEffect(() => {
    if (authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [authLoaded]);

  if (!authLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade_from_bottom',
            }}
          >
            <Stack.Protected guard={session === null}>
              <Stack.Screen name="index" />
            </Stack.Protected>
            <Stack.Protected guard={session !== null}>
              <Stack.Screen name="protected" />
            </Stack.Protected>
          </Stack>
          <StatusBar style="dark" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
