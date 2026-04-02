<script lang="ts">
  let { href, variant = 'primary', size = 'md', children } = $props<{
    href: string;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    children: any;
  }>();
</script>

<a
  {href}
  class="link link-{variant} link-{size}"
>
  {@render children()}
</a>

<style>
  .link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .link-primary {
    color: #3b82f6;
  }

  .link-primary:hover {
    color: #2563eb;
  }

  .link-secondary {
    color: #6b7280;
  }

  .link-secondary:hover {
    color: #4b5563;
  }

  .link-sm {
    font-size: 0.875rem;
  }

  .link-md {
    font-size: 1rem;
  }

  .link-lg {
    font-size: 1.125rem;
  }
</style>