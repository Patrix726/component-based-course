<script lang="ts">
  let { children, class: className = '' } = $props<{
    children: any;
    class?: string;
  }>();
</script>

<div class="card {className}">
  {@render children()}
</div>

<style>
  .card {
    background-color: var(--color-card, white);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
    transition: all 0.2s ease;
  }

  @media (prefers-color-scheme: dark) {
    .card {
      --color-card: #1f2937;
      --color-border: #374151;
    }
  }

  .card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>