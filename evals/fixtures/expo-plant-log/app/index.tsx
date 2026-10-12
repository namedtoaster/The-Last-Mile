import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { listPlants, addPlant, markWatered, removePlant, type Plant } from './plants';

// Everything is stored on the device. No accounts, no network calls.
export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>(listPlants);
  const [name, setName] = useState('');
  const [days, setDays] = useState('7');
  const refresh = () => setPlants(listPlants());

  async function water(plant: Plant) {
    markWatered(plant.id);
    refresh();
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title: `Time to water ${plant.name}` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: plant.everyDays * 86400 },
    });
  }

  function add() {
    const every = parseInt(days, 10);
    if (!name.trim() || !(every > 0)) return;
    addPlant(name.trim(), every);
    setName('');
    refresh();
  }

  return (
    <View style={{ flex: 1, padding: 16, maxWidth: 600, alignSelf: 'center', width: '100%' }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput placeholder="Plant name" value={name} onChangeText={setName} style={{ flex: 1 }} />
        <TextInput placeholder="Days" value={days} onChangeText={setDays} keyboardType="number-pad" style={{ width: 60 }} />
        <Pressable onPress={add}><Text>Add</Text></Pressable>
      </View>
      <FlatList
        data={plants}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={<Text>Add your first plant above, and how often it needs water.</Text>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
            <Pressable onPress={() => water(item)}>
              <Text>{item.name}: every {item.everyDays} days</Text>
              <Text>{item.lastWatered ? `Last watered ${new Date(item.lastWatered).toLocaleDateString()}` : 'Not watered yet'}</Text>
            </Pressable>
            <Pressable onPress={() => { removePlant(item.id); refresh(); }}><Text>Remove</Text></Pressable>
          </View>
        )}
      />
      <Pressable onPress={() => Linking.openURL('https://leafnote.app/privacy')}>
        <Text>Privacy policy</Text>
      </Pressable>
    </View>
  );
}
