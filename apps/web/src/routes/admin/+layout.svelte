<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const { children } = $props();

	const sessionQuery = authClient.useSession();

	onMount(() => {
		// If not loading and no session, redirect to login
		if (!$sessionQuery.isPending && !$sessionQuery.data?.user) {
			goto('/login');
		}
	});
</script>

{#if $sessionQuery.isPending}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-lg">Loading...</div>
	</div>
{:else if !$sessionQuery.data?.user}
	<!-- This will redirect via onMount, but show something in the meantime -->
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-lg">Redirecting to login...</div>
	</div>
{:else}
	<!-- Admin layout content -->
	<div class="grid h-svh grid-rows-[auto_1fr]">
		<header class="bg-neutral-900 border-b border-neutral-700 px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<h1 class="text-xl font-semibold">Admin Panel</h1>
					<nav class="flex gap-4">
						<a href="/admin/tournaments" class="text-neutral-300 hover:text-white">Tournaments</a>
					</nav>
				</div>
				<div class="text-sm text-neutral-400">
					{$sessionQuery.data.user.name || $sessionQuery.data.user.email}
				</div>
			</div>
		</header>
		<main class="overflow-y-auto p-4">
			{@render children()}
		</main>
	</div>
{/if}