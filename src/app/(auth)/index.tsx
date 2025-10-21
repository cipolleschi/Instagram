import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput } from 'react-native';
import Button from '~/src/components/Button';
import { auth } from '~/src/services/authService';
import { useTheme } from '~/src/providers/ThemeProvider';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  async function signInWithEmail() {
    setLoading(true);
    const { user, session, error } = await auth.login(email, password);

    if (error) {
      Alert.alert('Login Error', error);
    } else if (user && session) {
      Alert.alert('Login Successful!', `Welcome back, ${user.username}!`);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { user, session, error } = await auth.signup(email, password);

    if (error) {
      Alert.alert('Signup Error', error);
    } else if (user && session) {
      Alert.alert('Account Created!', `Welcome to Instagram, ${user.username}!`);
    }
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          autoCapitalize={'none'}
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-md text-black dark:text-white bg-white dark:bg-gray-800"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          autoCapitalize={'none'}
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-md text-black dark:text-white bg-white dark:bg-gray-800"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
