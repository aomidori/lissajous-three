<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from '../three/scene';

  let container: HTMLDivElement;
  let scene: SceneManager;

  const onResize = () => {
    scene?.resize();
  };

  onMount(() => {
    scene = new SceneManager(container);
    scene.render();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    scene?.dispose();
    window.removeEventListener('resize', onResize);
  });
</script>

<div bind:this={container}></div>
