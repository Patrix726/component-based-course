<script lang="ts">
	import { page } from '$app/stores';

	// Get match ID from URL params
	$: matchId = $page.params.id;
</script>

<h2 class="text-2xl font-bold mb-4">Match Details</h2>
<p class="text-neutral-400 mb-2">Match ID: {matchId}</p>
<p class="text-neutral-400">Match management UI will be implemented here.</p>