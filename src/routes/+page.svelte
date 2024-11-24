<script>
  import Canvas from '$lib/components/canvas.svelte';
  import Swtich from '$lib/components/elements/switch.svelte';
  import { addGuiControls, removeGuiControls } from '$lib/data/settings';
  import { onMount, onDestroy } from 'svelte';

  const VIEWS = [
    { label: '1x', value: 'single' },
    { label: '16x', value: 'group' },
  ];
  let activeView = $state('single');

  onMount(() => {
    addGuiControls();
  });

  onDestroy(() => {
    removeGuiControls();
  });
</script>

<div class="main">
  <Canvas {activeView} />
  <div class="footer">
    <Swtich options={VIEWS} bind:selected={activeView} />
  </div>
</div>

<style>
  .main {
    background: black;
    font-family: 'Inter', sans-serif;
    font-weight: 200;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
  }
</style>
