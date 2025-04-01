export function NotificationSound (sound: string) {
    const audio = new Audio(sound)
    audio.play();
}