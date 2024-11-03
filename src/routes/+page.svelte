<script>
  import Canvas from '$lib/components/canvas.svelte';
	import { addGuiControls, removeGuiControls } from '$lib/three/settings';
  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    addGuiControls();
  });

  onDestroy(() => {
    removeGuiControls();
  });
</script>

<div class="main">
  <Canvas />
</div>

<style>
  .main {
    font-family: 'Inter', sans-serif;
    font-weight: 200;
  }
</style>
