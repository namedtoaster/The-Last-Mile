export type Meal = { name: string; calories: number };
export function useMeals(): Meal[] {
  return [
    { name: 'Oatmeal', calories: 350 },
    { name: 'Chicken salad', calories: 520 },
  ];
}
