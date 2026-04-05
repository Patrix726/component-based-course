<script lang="ts">
  let { open, count: initCount } = $props();
  let count = $state(initCount);
</script>

<button aria-label="notifications" onclick={open} class="p-2 rounded">
  🔔
  {#if count > 0}
    <span class="ml-1 text-sm">{count}</span>
  {/if}
</button>
