import { useRouter } from 'expo-router';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAtom } from 'jotai';
import { onboardingLifeInputAtom } from '../../state/onboarding-state';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PagerLife({
  index,
  scrollY,
}: { index: number; scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [inputValue, setInputValue] = useAtom(onboardingLifeInputAtom);

  const inputRange = [
    (index - 1) * SCREEN_HEIGHT,
    index * SCREEN_HEIGHT,
    (index + 1) * SCREEN_HEIGHT,
  ];

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0]);
    const scale = interpolate(scrollY.value, inputRange, [0.6, 1, 0.6]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.pageContainer, { paddingTop: insets.top + 24 }]}
    >
      <Animated.Text style={[styles.pageTitle, animatedTextStyle]}>
        Your Life Goals
      </Animated.Text>

      <Animated.View style={[styles.chatContainer, animatedTextStyle]}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Write down one life goal per domain you want to perform in. No need
            to fill every domains.
          </Text>
          <TouchableOpacity
            style={styles.learnMoreContainer}
            onPress={() => router.push('/learn-more')}
          >
            <Text style={styles.learnMoreText}>More about domains</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.inputContainer, animatedTextStyle]}>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your life goals here..."
          placeholderTextColor={Colors.muted.text}
          multiline
        />
      </Animated.View>
      <Animated.Text style={[styles.hintText, animatedTextStyle]}>
        Write it the way you want, our AI make sure to categorize each of your
        goals.
      </Animated.Text>
      <View style={{ flex: 1 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
  },
  chatContainer: {
    width: '100%',
    paddingVertical: 16,
  },
  messageContainer: {
    backgroundColor: Colors.muted.background,
    padding: 16,
    borderRadius: 12,
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: Colors.muted.border,
  },
  messageText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  learnMoreContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  learnMoreText: {
    fontSize: 14,
    color: Colors.text,
    textDecorationLine: 'underline',
  },
  hintText: {
    fontSize: 14,
    color: Colors.muted.text,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: Colors.muted.border,
    borderRadius: 12,
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.muted.background,
  },
  boldText: {
    fontSize: 32,
    fontWeight: '900',
  },
});
