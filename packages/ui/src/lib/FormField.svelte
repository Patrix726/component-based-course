<script lang="ts">
  let { label, children, error, hint, required = false } = $props<{
    label: string;
    children: any;
    error?: string;
    hint?: string;
    required?: boolean;
  }>();
</script>

<div class="form-field">
  <label class="form-field-label">
    {label}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
  </label>

  <div class="form-field-input">
    {@render children()}
  </div>

  {#if error}
    <p class="form-field-error">{error}</p>
  {/if}

  {#if hint && !error}
    <p class="form-field-hint">{hint}</p>
  {/if}
</div>

<style>
  .form-field {
    margin-bottom: 1rem;
  }

  .form-field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text, #374151);
    margin-bottom: 0.5rem;
  }

  .form-field-error {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.25rem;
  }

  .form-field-hint {
    font-size: 0.75rem;
    color: var(--color-text-muted, #6b7280);
    margin-top: 0.25rem;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .form-field-label {
      --color-text: #f3f4f6;
    }

    .form-field-hint {
      --color-text-muted: #9ca3af;
    }
  }
</style>