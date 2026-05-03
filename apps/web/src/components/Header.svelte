<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Link } from "@component-based-software/ui"
	import { ThemeToggle } from "@component-based-software/ui";
	import UserMenu from './UserMenu.svelte';

	const sessionQuery = authClient.useSession();

	const baseLinks = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	];

	$: links = $sessionQuery.data?.user ? [...baseLinks, { to: "/admin/tournaments", label: "Admin" }] : baseLinks;
</script>

<div>
	<div class="flex flex-row items-center justify-between px-4 py-2 md:px-6">
		<nav class="flex gap-4 text-lg">
			{#each links as link (link.to)}
				<Link href={link.to}>
					{link.label}
				</Link>
			{/each}
		</nav>
		<div class="flex items-center gap-2">
			<ThemeToggle />
			<UserMenu />
		</div>
	</div>
	<hr class="border-neutral-800" />
</div>
