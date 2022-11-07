<script lang="ts">
	import HoverCard from '$components/HoverCard.svelte';
	let hcKey = 1;
	let shouldDrawHitboxes = false;
	let shouldDetectCollisions = true;
	let text = 'Bringing method to our (beloved) madness';
</script>

<div class="wrapper">
	{#key `${hcKey}-${shouldDrawHitboxes}-${shouldDetectCollisions}-${text}`}
		<HoverCard {shouldDrawHitboxes} {shouldDetectCollisions}>{text}</HoverCard>
	{/key}

	<div class="controls">
		<textarea bind:value={text} />
		<button on:click={() => (hcKey = hcKey + 1)}> Randomize position </button>
		<!-- TODO: Make better hitboxes, to allow responsive collision detection -->
		<label>
			<input type="checkbox" bind:checked={shouldDrawHitboxes} />
			Draw hitboxes? (WIP)
		</label>
		<label>
			<input type="checkbox" bind:checked={shouldDetectCollisions} />
			Detect collisions?
		</label>
	</div>
</div>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		color: white;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.wrapper {
		background: #000;
		min-height: 100vh;
		padding: clamp(8px, 5vw, 64px);
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;

		margin-top: 3rem;
	}

	.controls textarea {
		min-width: clamp(200px, 25vw, 400px);
	}
</style>
