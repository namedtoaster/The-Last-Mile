import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Pressable } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Feed } from './Feed';

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  useEffect(() => auth().onAuthStateChanged(setUser), []);

  async function facebook() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) return;
    const token = await AccessToken.getCurrentAccessToken();
    await auth().signInWithCredential(auth.FacebookAuthProvider.credential(token!.accessToken));
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 28 }}>Run Club</Text>
        <Text>Find people to run with near you.</Text>
        <Pressable onPress={facebook}><Text>Continue with Facebook</Text></Pressable>
      </SafeAreaView>
    );
  }
  return <Feed user={user} onSignOut={() => auth().signOut()} />;
}
