import { ScrollView, Text, Linking } from 'react-native';

export default function NutritionSources() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 20 }}>Where these numbers come from</Text>
      <Text>Calories and macros are estimated from each ingredient using USDA FoodData Central.</Text>
      <Text onPress={() => Linking.openURL('https://fdc.nal.usda.gov/')}>fdc.nal.usda.gov</Text>
      <Text>Estimates can differ from labels. They are not medical or dietary advice.</Text>
    </ScrollView>
  );
}
