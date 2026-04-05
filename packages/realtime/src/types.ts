export type NotificationPayload = {
	title: string;
	body: string;
	[k: string]: any;
};
export type Notification = {
	id: string;
	userId: string;
	payload: NotificationPayload;
	read: boolean;
	createdAt: number;
};
