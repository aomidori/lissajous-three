<script lang="ts">
	let {
		options,
		selected = $bindable()
	}: {
		options: { label: string; value: string }[];
		selected: string;
	} = $props();

	const toggle = (value: string) => {
		selected = value;
	};
	const buttonWidth = 54;
	const activeIndex = $derived(options.findIndex((option) => option.value === selected));
</script>

<div class="switch flex flex-row flex-nowrap" style="width: fit-content;">
	<span
		class="switch-option-slider"
		style="width: {buttonWidth}px; left: {buttonWidth * activeIndex}px;"
	></span>
	{#each options as option}
		<div
			class="switch-option px-0 py-2 font-medium text-sm text-center {selected === option.value
				? 'active'
				: ''}"
			style="width: {buttonWidth}px;"
			onpointerdown={() => toggle(option.value)}
		>
			{option.label}
		</div>
	{/each}
</div>

<style>
	:root {
		--highlight-color: #f0f0f0;
	}
	.switch {
		border: 2px solid var(--highlight-color);
		border-radius: 36px;
		cursor: pointer;
		position: relative;
	}
	.switch-option {
		color: var(--highlight-color);
		border: none;
		transition: color 0.3s ease-in-out;
	}
	.switch-option-slider {
		pointer-events: none;
		display: block;
		position: absolute;
		height: 100%;
		border-radius: 36px;
		background: var(--highlight-color);
		transition: left 0.3s ease-in-out;
	}
	.switch-option.active {
		color: black;
		position: relative;
	}
</style>
