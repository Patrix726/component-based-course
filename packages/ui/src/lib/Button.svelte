<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let { variant = 'primary', size = 'md', disabled = false, type = 'button', children } = $props<{
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    children: any;
  }>();
</script>

<button
  class="btn btn-{variant} btn-{size}"
  class:disabled
  {type}
  {disabled}
  onclick={() => dispatch('click')}
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--btn-primary-bg, #3b82f6);
    color: var(--btn-primary-text, white);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--btn-primary-hover, #2563eb);
  }

  .btn-secondary {
    background-color: var(--btn-secondary-bg, #6b7280);
    color: var(--btn-secondary-text, white);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--btn-secondary-hover, #4b5563);
  }

  .btn-outline {
    border: 1px solid var(--btn-outline-border, #d1d5db);
    background-color: var(--btn-outline-bg, white);
    color: var(--btn-outline-text, #374151);
  }

  .btn-outline:hover:not(:disabled) {
    background-color: var(--btn-outline-hover, #f9fafb);
  }

  @media (prefers-color-scheme: dark) {
    :global(.dark) .btn-primary {
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #60a5fa;
    }

    :global(.dark) .btn-secondary {
      --btn-secondary-bg: #6b7280;
      --btn-secondary-text: white;
      --btn-secondary-hover: #9ca3af;
    }

    :global(.dark) .btn-outline {
      --btn-outline-border: #4b5563;
      --btn-outline-bg: #1f2937;
      --btn-outline-text: #f3f4f6;
      --btn-outline-hover: #374151;
    }
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .btn-md {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
</style>