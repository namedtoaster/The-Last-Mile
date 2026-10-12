import { View, Text, Pressable, FlatList, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { usePlants, markWatered } from './plants';

// Everything is stored on the device. No accounts, no network calls.
export default function Plants() {
  const plants = usePlants();
  async function remind(name: string, days: number) {
    await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: `Water ${name}` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: days * 86400 },
    });
  }
  return (
    <View style={{ flex: 1, padding: 16, maxWidth: 600, alignSelf: 'center', width: '100%' }}>
      <FlatList
        data={plants}
        renderItem={({ item }) => (
          <Pressable onPress={() => { markWatered(item.id); remind(item.name, item.everyDays); }}>
            <Text>{item.name}: water every {item.everyDays} days</Text>
          </Pressable>
        )}
      />
      <Pressable onPress={() => Linking.openURL('https://plantlog.example.com/privacy')}>
        <Text>Privacy policy</Text>
      </Pressable>
    </View>
  );
}
