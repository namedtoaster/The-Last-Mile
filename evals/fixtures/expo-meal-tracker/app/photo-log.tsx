import { View, Text, Pressable } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

// Lets someone pick a meal photo to log.
export default function PhotoLog() {
  async function pick() {
    await MediaLibrary.requestPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
    if (!result.canceled) console.log(result.assets[0].uri);
  }
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={pick}><Text>Log a meal from a photo</Text></Pressable>
    </View>
  );
}
