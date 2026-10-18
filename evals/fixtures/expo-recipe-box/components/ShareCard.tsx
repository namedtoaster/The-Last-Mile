import { View, Text, Share, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

export function ShareCard() {
  const { t } = useTranslation();
  return (
    <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f4efe6' }}>
      <Text style={{ fontWeight: '600' }}>{t('share.title')}</Text>
      <Pressable onPress={() => Share.share({ message: t('share.cta') })}>
        <Text>{t('share.cta')}</Text>
      </Pressable>
    </View>
  );
}
