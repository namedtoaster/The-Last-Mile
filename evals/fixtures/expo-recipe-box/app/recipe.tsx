import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ShareCard } from '../components/ShareCard';

export default function Recipe({ recipe = { name: 'Lentil soup', calories: 410, protein: 22 } }) {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, padding: 24, gap: 8 }}>
      <Text style={{ fontSize: 24 }}>{recipe.name}</Text>
      <Text>{recipe.calories} kcal per serving, {recipe.protein} g protein</Text>
      <Link href="/nutrition-sources"><Text>{t('nutrition.sources')}</Text></Link>
      <ShareCard />
    </View>
  );
}
