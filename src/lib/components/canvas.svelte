<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from '../three/scene';

  let container: HTMLDivElement;
  let scene: SceneManager;

  onMount(() => {
    scene = new SceneManager(container);
    scene.render();
  });

  onDestroy(() => {
    scene?.dispose();
  });
</script>

<div bind:this={container}></div>
