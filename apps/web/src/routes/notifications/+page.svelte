<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { subscribeToNotifications } from '$lib/realtime';
  import { NotificationBell } from '@component-based-software/ui';
  import { NotificationList } from '@component-based-software/ui';

  let items: any[] = [];
  let unsubscribe: () => void;
  const userId = 'demo-user';

  onMount(() => {
    unsubscribe = subscribeToNotifications(userId, (n) => {
      items = [n, ...items];
    });
  });
  onDestroy(() => unsubscribe && unsubscribe());
</script>

<NotificationBell count={items.length} open={() => { /* open panel */ }} />
<NotificationList {items} />
