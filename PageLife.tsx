import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { useState } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PageLife({
  index,
  scrollY,
}: { index: number; scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');

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
        Write Your Life's Focus
      </Animated.Text>

      <View style={styles.chatContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            What is the one thing in your life that would make everything else
            easier or unnecessary?
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your life focus here..."
          placeholderTextColor="#A0A0A0"
          multiline
        />
      </View>
      <View style={{ flex: 1 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
  },
  chatContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  messageContainer: {
    backgroundColor: '#F7F7F8',
    padding: 16,
    borderRadius: 12,
    maxWidth: '100%',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
    maxHeight: 100,
  },
  boldText: {
    fontSize: 32,
    fontWeight: '900',
  },
});
