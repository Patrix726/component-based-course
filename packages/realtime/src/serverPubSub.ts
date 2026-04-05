import EventEmitter from "events";
import type { Notification } from "./types";

const emitter = new EventEmitter();

export function publishNotification(n: Notification) {
  emitter.emit(n.userId, n);
}

export function subscribeNotifications(userId: string, cb: (n: Notification) => void) {
  emitter.on(userId, cb);
  return () => emitter.off(userId, cb);
}
