export function subscribeToNotifications(
	userId: string,
	onMessage: (n: any) => void,
) {
	const url = `/api/realtime/stream?userId=${encodeURIComponent(userId)}`;
	const es = new EventSource(url);
	es.onmessage = (ev) => {
		try {
			const data = JSON.parse(ev.data);
			onMessage(data);
		} catch (e) {
			// ignore
		}
	};
	return () => es.close();
}
