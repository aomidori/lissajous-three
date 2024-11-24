<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SceneManager } from '../three/scene';
	import { browser } from '$app/environment';
	import { settingsStore, type Settings } from '$lib/data/settings';
	import { debounce } from '$lib/utils/common';

	let container: HTMLDivElement;
	let scene: SceneManager;

	let { activeView } = $props();
	let sceneCreated = $state(false);
	let settings = $state<Settings>();

	$effect(() => {
		if (sceneCreated && activeView) {
			scene.setView(activeView);
		}
	});

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
		sceneCreated = true;
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

<style>
</style>
