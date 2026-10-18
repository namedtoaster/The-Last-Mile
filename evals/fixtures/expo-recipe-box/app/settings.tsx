import { View, Text, Pressable, Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useSession } from '../components/useSession';

export default function Settings() {
  const { t } = useTranslation();
  const session = useSession();

  function deactivate() {
    Alert.alert(t('settings.deactivate'), t('settings.deactivate.confirm'), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('profiles').update({ active: false }).eq('id', session!.user.id);
          await supabase.auth.signOut();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      {session && (
        <>
          <Text>{session.user.email}</Text>
          <Pressable onPress={() => Purchases.restorePurchases()}><Text>{t('settings.restore')}</Text></Pressable>
          <Pressable onPress={() => supabase.auth.signOut()}><Text>Sign out</Text></Pressable>
          <Pressable onPress={deactivate}><Text>{t('settings.deactivate')}</Text></Pressable>
        </>
      )}
    </View>
  );
}
