import { View, Text, Pressable } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../components/useAuth';

export default function SignIn() {
  const { setUser } = useAuth();
  async function google() {
    const result = await GoogleSignin.signIn();
    setUser(result.data?.user ?? null);
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24 }}>Sign in to continue</Text>
      <Pressable onPress={google}><Text>Continue with Google</Text></Pressable>
    </View>
  );
}
