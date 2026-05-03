<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

  let theme = $state<'light' | 'dark'>('light');

  onMount(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      theme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    applyTheme();
  });

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
  }

  // Listen for system theme changes
  $effect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no manual preference is saved
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        theme = e.matches ? 'dark' : 'light';
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  });
</script>

<Button variant="outline" size="sm" on:click={toggleTheme}>
  {#if theme === 'light'}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  {:else}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <path d="m12 1v2"></path>
      <path d="m12 21v2"></path>
      <path d="m4.22 4.22 1.42 1.42"></path>
      <path d="m18.36 18.36 1.42 1.42"></path>
      <path d="m1 12h2"></path>
      <path d="m21 12h2"></path>
      <path d="m4.22 19.78 1.42-1.42"></path>
      <path d="m18.36 5.64 1.42-1.42"></path>
    </svg>
  {/if}
</Button>

<style>
  .theme-toggle {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>