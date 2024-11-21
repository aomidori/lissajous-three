<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from '../three/scene';
  import { browser } from '$app/environment';
	import { settingsStore, type Settings } from '$lib/data/settings';
	import { debounce } from '$lib/utils/common';

  let container: HTMLDivElement;
  let scene: SceneManager;
  let settings = $state<Settings>();

  const onResize = debounce(() => {
    scene?.resize();
  }, 100);

  const settingsUnsubscribe = settingsStore.subscribe((value) => {
    settings = value;
  });

  onMount(() => {
    if (!browser || !container) return;
    scene = new SceneManager(container);
    scene.render();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (!browser) return;
    scene?.dispose();
    settingsUnsubscribe();
    window.removeEventListener('resize', onResize);
  });
</script>

<div bind:this={container}></div>
<div class="bottom">
  {#if settings}
    <p>Frequency: {settings.xFrequency.toFixed(2)}, {settings.yFrequency.toFixed(2)}, {settings.zFrequency.toFixed(2)}</p>
  {/if}
</div>

<style>
  .bottom {
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 0;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.5rem;
  }
</style>
