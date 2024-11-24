<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Object3D } from 'three';
  import { hoveringFigureData, hoveringFigurePosition, SceneManager } from '../three/scene';
  import { browser } from '$app/environment';
  import { debounce } from '$lib/utils/common';

  let container: HTMLDivElement;
  let scene: SceneManager;

  let { activeView } = $props();
  let sceneCreated: boolean = $state(false);

  let hoveringFigure: Object3D['userData'] | undefined = $state();
  let hoveringFigurePos: { x: number; y: number } = $state({ x: 0, y: 0 });

  $effect(() => {
    if (sceneCreated && activeView) {
      scene.setView(activeView);
    }
  });

  const onResize = debounce(() => {
    scene?.resize();
  }, 100);

  const hoveringFigureUnsubscribe = hoveringFigureData.subscribe((value) => {
    hoveringFigure = value;
  });
  const hoveringFigurePosUnsubscribe = hoveringFigurePosition.subscribe((value) => {
    if (!scene || !value) {
      return;
    }
    hoveringFigurePos = scene.projectPositionToScreen(value);
  });

  onMount(() => {
    if (!browser || !container) return;
    scene = new SceneManager(container);
    scene.render();
    sceneCreated = true;
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (!browser) return;
    scene?.dispose();
    hoveringFigureUnsubscribe();
    hoveringFigurePosUnsubscribe();
    window.removeEventListener('resize', onResize);
  });
</script>

<div>
  <div bind:this={container}></div>
  <div style="pointer-events: none;">
    {#if hoveringFigure && activeView === 'group'}
      <div class="hover-info" style="top: {hoveringFigurePos.y}px; left: {hoveringFigurePos.x}px;">
        <div class="hover-info__data">
          {hoveringFigure.params.a}, {hoveringFigure.params.b}, {hoveringFigure.params.c}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .hover-info {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    pointer-events: none;
    transform: translate(-50%, 0);
  }
</style>
