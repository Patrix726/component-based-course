<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { z } from 'zod';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { Button, Input } from '@component-based-software/ui';

	let { switchToSignUp } = $props<{ switchToSignUp: () => void }>();

	const validationSchema = z.object({
		email: z.email('Invalid email address'),
		password: z.string().min(1, 'Password is required'),
	});

	const form = createForm(() => ({
		defaultValues: { email: '', password: '' },
		onSubmit: async ({ value }) => {
				await authClient.signIn.email(
					{ email: value.email, password: value.password },
					{
						onSuccess: () => goto('/dashboard'),
						onError: (error) => {
							console.log(error.error.message || 'Sign in failed. Please try again.');
						},
					}
				);

		},
		validators: {
			onSubmit: validationSchema,
		},
	}));
</script>

<div class="mx-auto mt-10 w-full max-w-md p-6">
	<h1 class="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

	<form
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<form.Field name="email">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Email</label>
					<Input
						type="email"
						placeholder="Enter your email"
						bind:value={field.state.value}
						onblur={field.handleBlur}
						required
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="password">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Password</label>
					<Input
						type="password"
						placeholder="Enter your password"
						bind:value={field.state.value}
						onblur={field.handleBlur}
						required
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
			{#snippet children(state)}
				<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
					{state.isSubmitting ? 'Submitting...' : 'Sign In'}
				</Button>
			{/snippet}
		</form.Subscribe>
	</form>

	<div class="mt-4 text-center">
		<Button variant="outline" on:click={switchToSignUp}>
			Need an account? Sign Up
		</Button>
	</div>
</div>
