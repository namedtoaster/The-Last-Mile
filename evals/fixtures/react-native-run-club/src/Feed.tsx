import React from 'react';
import { SafeAreaView, Text, Pressable } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export function Feed({ user, onSignOut }: { user: FirebaseAuthTypes.User; onSignOut: () => void }) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text>Hi {user.displayName}</Text>
      <Pressable onPress={() => launchImageLibrary({ mediaType: 'mixed' })}>
        <Text>Share a run photo or video</Text>
      </Pressable>
      <Text style={{ marginTop: 24 }}>
        Your friends on Android can join from Google Play. Invite them!
      </Text>
      <Pressable onPress={onSignOut}><Text>Sign out</Text></Pressable>
    </SafeAreaView>
  );
}
