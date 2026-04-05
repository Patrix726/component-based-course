<script lang="ts">
  export let items: any[] = [];
</script>

<ul>
  {#each items as item}
    <li class="p-2 border-b">{item.payload.title} — {item.payload.body}</li>
  {/each}
</ul>
