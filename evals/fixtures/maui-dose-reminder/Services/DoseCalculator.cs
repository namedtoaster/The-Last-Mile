namespace DoseReminder.Services;

public static class DoseCalculator
{
    // 15 mg per kg, rounded to the nearest 10 mg.
    public static int ParacetamolMg(double weightKg) => (int)(Math.Round(weightKg * 15 / 10) * 10);
}
