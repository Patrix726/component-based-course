<script lang="ts">
  let { type = 'text', placeholder = '', value = $bindable(''), disabled = false, required = false, onblur = () => {} } = $props<{
    type?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    onblur?: () => void;
  }>();
</script>

<input
  {type}
  {placeholder}
  bind:value
  {disabled}
  {required}
  onblur={onblur}
  class="input"
/>

<style>
  .input {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--input-border, #d1d5db);
    border-radius: 0.375rem;
    font-size: 1rem;
    background-color: var(--input-bg, white);
    color: var(--input-text, #111827);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: var(--input-focus-border, #3b82f6);
    box-shadow: 0 0 0 3px var(--input-focus-shadow, rgba(59, 130, 246, 0.1));
  }

  .input:disabled {
    background-color: var(--input-disabled-bg, #f9fafb);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .input::placeholder {
    color: var(--input-placeholder, #6b7280);
  }

  @media (prefers-color-scheme: dark) {
    :global(.dark) .input {
      --input-border: #4b5563;
      --input-bg: #1f2937;
      --input-text: #f3f4f6;
      --input-focus-border: #60a5fa;
      --input-focus-shadow: rgba(96, 165, 250, 0.1);
      --input-disabled-bg: #374151;
      --input-placeholder: #9ca3af;
    }
  }
</style>