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
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }

  .btn-outline {
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;
  }

  .btn-outline:hover:not(:disabled) {
    background-color: #f9fafb;
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