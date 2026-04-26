import { Capacitor } from "@capacitor/core";

const REMINDER_ID = 1001;

const REMINDER_BODIES = [
  "Your habits won't do themselves. Let's go.",
  "Another day, another rep. Check in now.",
  "The man you're becoming shows up every day.",
  "Discipline is a vote for your future self.",
  "Small wins stack. Log today's.",
];

function randomBody() {
  return REMINDER_BODIES[Math.floor(Math.random() * REMINDER_BODIES.length)];
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    if (!("Notification" in window)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const { display } = await LocalNotifications.requestPermissions();
  return display === "granted";
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");

  await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });

  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_ID,
        title: "YoungmanBlueprint",
        body: randomBody(),
        schedule: {
          on: { hour, minute },
          repeats: true,
          allowWhileIdle: true,
        },
        sound: undefined,
        smallIcon: "ic_stat_icon_config_sample",
      },
    ],
  });
}

export async function cancelReminder(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
}
