import { View, Text, FlatList } from 'react-native';
import { useMeals } from '../../components/useMeals';

// Daily calorie target from the Mifflin-St Jeor equation.
function dailyTarget(weightKg: number, heightCm: number, age: number) {
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

export default function Today() {
  const meals = useMeals();
  const target = dailyTarget(80, 180, 35);
  const eaten = meals.reduce((sum, m) => sum + m.calories, 0);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28 }}>{eaten} / {target} kcal</Text>
      <Text>Protein goal: {Math.round(target * 0.3 / 4)} g</Text>
      <FlatList data={meals} renderItem={({ item }) => <Text>{item.name}: {item.calories} kcal</Text>} />
    </View>
  );
}
