import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { AppColors, AppRadius } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password. Use "user" and "password".');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/budgetbites logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to plan your weekly meals</Text>

          <View style={styles.formContext}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={AppColors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={AppColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Demo Login: user / password</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  formContext: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.button,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColors.separator,
    color: AppColors.textPrimary,
  },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  errorText: {
    color: AppColors.destructive,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  hintContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  hintText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  }
});
