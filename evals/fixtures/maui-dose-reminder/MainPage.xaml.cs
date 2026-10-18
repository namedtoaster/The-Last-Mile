using DoseReminder.Services;

namespace DoseReminder;

public partial class MainPage : ContentPage
{
    public MainPage() => InitializeComponent();

    void OnCalculate(object sender, EventArgs e)
    {
        if (double.TryParse(WeightEntry.Text, out var kg))
        {
            var mg = DoseCalculator.ParacetamolMg(kg);
            DoseLabel.Text = $"Give {mg} mg of paracetamol, up to 4 times a day.";
        }
    }

    async void OnRemind(object sender, EventArgs e) => await Reminders.ScheduleAsync(TimeSpan.FromHours(6));
}
