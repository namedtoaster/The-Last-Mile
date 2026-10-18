import { View, Text, Pressable } from 'react-native';
import Purchases from 'react-native-purchases';
import { useAuth } from '../components/useAuth';
import { router } from 'expo-router';

export default function Paywall() {
  const { user } = useAuth();
  async function buy() {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    const offerings = await Purchases.getOfferings();
    await Purchases.purchasePackage(offerings.current!.monthly!);
  }
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24 }}>Macro Buddy Pro</Text>
      <Text>Unlimited meal photos and weekly reports.</Text>
      <Pressable onPress={buy}><Text>Start for $4.99 a month</Text></Pressable>
      <Text style={{ fontSize: 11 }}>
        Payment is charged to your App Store or Google Play account. Cancel anytime in
        your App Store or Google Play subscription settings.
      </Text>
    </View>
  );
}
