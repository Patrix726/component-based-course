<script lang="ts">
	import { page } from '$app/stores';

	// Get tournament ID from URL params
	$: tournamentId = $page.params.id;
</script>

<h2 class="text-2xl font-bold mb-4">Tournament Details</h2>
<p class="text-neutral-400 mb-2">Tournament ID: {tournamentId}</p>
<p class="text-neutral-400">Tournament management UI will be implemented here.</p>