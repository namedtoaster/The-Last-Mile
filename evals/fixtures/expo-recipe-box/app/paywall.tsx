import { View, Text, Pressable, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useTranslation } from 'react-i18next';

const storeName = Platform.select({ ios: 'App Store', android: 'Google Play', default: 'store' });

export default function Paywall() {
  const { t } = useTranslation();
  async function buy() {
    const offerings = await Purchases.getOfferings();
    await Purchases.purchasePackage(offerings.current!.annual!);
  }
  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24 }}>{t('paywall.title')}</Text>
      <Text>{t('paywall.body')}</Text>
      <Pressable onPress={buy}><Text>$19.99 a year</Text></Pressable>
      <Text style={{ fontSize: 11 }}>
        Charged to your {storeName} account. Renews yearly until cancelled in your {storeName} settings.
      </Text>
    </View>
  );
}
