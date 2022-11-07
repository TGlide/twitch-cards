<script lang="ts">
	import HoverCard from '$components/HoverCard.svelte';
	let hcKey = 1;
	let shouldDrawHitboxes = false;
	let text = 'Bringing method to our (beloved) madness';
</script>

<div class="wrapper">
	{#key `${hcKey}-${shouldDrawHitboxes}-${text}`}
		<HoverCard {shouldDrawHitboxes}>{text}</HoverCard>
	{/key}

	<div class="controls">
		<textarea bind:value={text} />
		<button on:click={() => (hcKey = hcKey + 1)}> Refresh </button>
		<button on:click={() => (shouldDrawHitboxes = !shouldDrawHitboxes)}>
			Draw hitboxes {shouldDrawHitboxes}
		</button>
	</div>
</div>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.wrapper {
		background: #000;
		min-height: 100vh;
		padding: 64px;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;

		margin-top: 3rem;
	}

	.controls textarea {
		min-width: 300px;
	}
</style>
