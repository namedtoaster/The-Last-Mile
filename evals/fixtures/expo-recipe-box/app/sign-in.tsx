import { View, Text, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSigninButton, GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';

export default function SignIn() {
  async function google() {
    const { data } = await GoogleSignin.signIn();
    await supabase.auth.signInWithIdToken({ provider: 'google', token: data!.idToken! });
  }
  async function apple() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    await supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken! });
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Sync your recipes across devices</Text>
      <GoogleSigninButton onPress={google} />
      {Platform.OS === 'android' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{ height: 44 }}
          onPress={apple}
        />
      )}
    </View>
  );
}
