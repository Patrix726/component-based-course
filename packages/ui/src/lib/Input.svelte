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
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .input:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
</style>