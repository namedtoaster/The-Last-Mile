import { View, Text, Pressable } from 'react-native';
import { useAuth } from '../components/useAuth';

export default function Settings() {
  const { user, signOut } = useAuth();
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Signed in as {user?.email}</Text>
      <Pressable onPress={signOut}><Text>Sign out</Text></Pressable>
      <Text>About</Text>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
    </View>
  );
}
