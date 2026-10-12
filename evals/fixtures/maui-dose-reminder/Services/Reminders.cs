using Plugin.LocalNotification;

namespace DoseReminder.Services;

public static class Reminders
{
    public static Task ScheduleAsync(TimeSpan after) =>
        LocalNotificationCenter.Current.Show(new NotificationRequest
        {
            NotificationId = 1,
            Title = "Next dose",
            Schedule = new NotificationRequestSchedule { NotifyTime = DateTime.Now.Add(after) },
        });
}
