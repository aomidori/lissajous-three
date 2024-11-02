<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from '../three/scene';
  import { browser } from '$app/environment';

  let container: HTMLDivElement;
  let scene: SceneManager;

  const onResize = () => {
    scene?.resize();
  };

  onMount(() => {
    if (!browser) return;
    scene = new SceneManager(container);
    scene.render();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (!browser) return;
    scene?.dispose();
    window.removeEventListener('resize', onResize);
  });
</script>

<div bind:this={container}></div>
