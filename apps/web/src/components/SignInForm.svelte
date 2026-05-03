<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { z } from 'zod';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { Button, Input, Card, FormField } from '@component-based-software/ui';

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

<div class="auth-form-container">
	<Card class="auth-card">
		<div class="auth-header">
			<h1 class="auth-title">Welcome Back</h1>
			<p class="auth-subtitle">Sign in to your account to continue</p>
		</div>

		<form
			class="auth-form"
			onsubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field name="email">
				{#snippet children(field)}
					<FormField
						label="Email"
						error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0]?.message || 'Invalid email' : undefined}
						required
					>
						<Input
							type="email"
							placeholder="Enter your email"
							bind:value={field.state.value}
							onblur={field.handleBlur}
						/>
					</FormField>
				{/snippet}
			</form.Field>

			<form.Field name="password">
				{#snippet children(field)}
					<FormField
						label="Password"
						error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0]?.message || 'Password required' : undefined}
						required
					>
						<Input
							type="password"
							placeholder="Enter your password"
							bind:value={field.state.value}
							onblur={field.handleBlur}
						/>
					</FormField>
				{/snippet}
			</form.Field>

			<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
				{#snippet children(state)}
					<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
						{state.isSubmitting ? 'Signing in...' : 'Sign In'}
					</Button>
				{/snippet}
			</form.Subscribe>
		</form>

		<div class="auth-footer">
			<Button variant="outline" on:click={switchToSignUp}>
				Need an account? Sign Up
			</Button>
		</div>
	</Card>
</div>

<style>
	.auth-form-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.auth-card {
		max-width: 28rem;
		width: 100%;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: none;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.auth-form-container {
			background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		}

		.auth-card {
			background: rgba(31, 41, 55, 0.95);
		}

		.auth-title {
			color: #f3f4f6;
		}

		.auth-subtitle {
			color: #9ca3af;
		}

		.auth-footer {
			border-top-color: #4b5563;
		}
	}

	@media (max-width: 640px) {
		.auth-form-container {
			padding: 1rem;
		}

		.auth-card {
			padding: 1.5rem;
		}

		.auth-title {
			font-size: 1.5rem;
		}
	}

	.auth-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.auth-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.auth-subtitle {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.submit-btn {
		width: 100%;
		margin-top: 1rem;
	}

	.auth-footer {
		margin-top: 2rem;
		text-align: center;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.auth-form-container {
			background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		}

		.auth-card {
			background: rgba(31, 41, 55, 0.95);
		}

		.auth-title {
			color: #f3f4f6;
		}

		.auth-subtitle {
			color: #9ca3af;
		}

		.auth-footer {
			border-top-color: #4b5563;
		}
	}

	@media (max-width: 640px) {
		.auth-form-container {
			padding: 1rem;
		}

		.auth-card {
			padding: 1.5rem;
		}

		.auth-title {
			font-size: 1.5rem;
		}
	}
</style>
