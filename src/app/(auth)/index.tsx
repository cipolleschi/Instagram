import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput } from 'react-native';
import Button from '~/src/components/Button';
import { auth } from '~/src/services/authService';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          className="border border-gray-300 p-3 rounded-md"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          className="border border-gray-300 p-3 rounded-md"
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
