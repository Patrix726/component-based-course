<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from "@component-based-software/ui"
	import { goto } from '$app/navigation';

	const sessionQuery = authClient.useSession();

	async function handleSignOut() {
		await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				goto('/');
			},
			onError: (error) => {
				console.error('Sign out failed:', error);
			}
		}
		});
	}

	function goToLogin() {
		goto('/login');
	}

</script>

<div class="relative">
	{#if $sessionQuery.isPending}
		<div class="h-8 w-24 animate-pulse rounded bg-neutral-700"></div>
	{:else if $sessionQuery.data?.user}
		{@const user = $sessionQuery.data.user}
		<div class="flex items-center gap-3">
			<span class="text-sm text-neutral-300 hidden sm:inline" title={user.email}>
				{user.name || user.email?.split('@')[0] || 'User'}
			</span>
			<Button on:click={handleSignOut}>
				Sign Out
			</Button>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			<Button on:click={goToLogin}>
				Sign In
			</Button>
		</div>
	{/if}
</div>
