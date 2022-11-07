<script lang="ts">
	import { detectRectangleCollision } from '$modules/collision/utils';
	import { Word } from '$modules/collision/Word';
	import { randRange } from '$utils/random';

	let el: HTMLDivElement | undefined;
	let wordHitboxes: Word[] = [];
	export let shouldDrawHitboxes = false;
	export let shouldDetectCollisions = false;

	$: {
		(function createSpanElements() {
			if (!el) return;
			const textEl = el.querySelector('.text') as HTMLParagraphElement;
			const displayedEl = el.querySelector('.displayed-text') as HTMLParagraphElement;

			const textWords = textEl.innerText.split(' ');
			wordHitboxes = [];

			// Create span elements
			displayedEl.innerHTML = textWords
				.map((w) => {
					return `<span>${w}</span>`;
				})
				.join(' ');

			// Set the random position of each span element
			const spanEls = displayedEl.querySelectorAll('span');
			for (let spanEl of spanEls) {
				// Get current position relative to el
				const rect = spanEl.getBoundingClientRect();
				const x = rect.left - el.getBoundingClientRect().left;
				const y = rect.top - el.getBoundingClientRect().top;
				console.log(spanEl.innerText, x, y);

				// Set random properties
				const word = spanEl.innerText;
				let hasCollision = true;
				let tries = 0;
				let wr: Word = new Word(word, 0, 0, 0);

				let [deltaX, deltaY, deltaDeg] = [0, 0, 0];

				// Keep trying to find a random position that doesn't collide with other words
				while (hasCollision && tries < 100) {
					tries++;
					deltaX = randRange(-75, 100);
					deltaY = randRange(-500, 0);
					deltaDeg = randRange(-120, 120);

					wr = new Word(word, x + deltaX, y + deltaY, deltaDeg);
					hasCollision = shouldDetectCollisions
						? wordHitboxes.some((word) => detectRectangleCollision(wr, word))
						: false;
				}

				wordHitboxes.push(wr);

				spanEl.style.setProperty('--x', `${deltaX}px`);
				spanEl.style.setProperty('--y', `${deltaY}px`);
				spanEl.style.setProperty('--deg', `${wr.rotation}deg`);
			}
		})();
	}

	const drawHitboxes = () => {
		if (!el) return;
		const fg = el.querySelector('.fg') as HTMLDivElement;

		for (let wh of wordHitboxes) {
			const el = document.createElement('div');
			el.classList.add('word-hitbox');
			el.style.setProperty('left', `${wh.x}px`);
			el.style.setProperty('top', `${wh.y}px`);
			el.style.setProperty('width', `${wh.width}px`);
			el.style.setProperty('height', `${wh.height}px`);
			el.style.setProperty('transform', `rotate(${wh.rotation}deg)`);
			fg.appendChild(el);
		}
	};

	$: {
		wordHitboxes; // Trigger on wordHitboxes change
		if (shouldDrawHitboxes) drawHitboxes();
	}
</script>

<div class="card" bind:this={el}>
	<div class="bg" />
	<div class="content">
		<p class="displayed-text" />
		<p class="text">
			<slot />
		</p>
	</div>
	<div class="fg" />
</div>

<style>
	:root {
		--z-index-1: 10;
		--z-index-2: 20;
		--z-index-3: 30;
		--z-index-4: 40;
		--z-index-5: 50;
	}

	.card {
		cursor: pointer;
		position: relative;

		width: 600px;
		max-width: 100%;
		min-height: clamp(500px, 50vw, 850px);

		display: flex;
	}

	.bg {
		position: absolute;
		z-index: var(--z-index-1);

		background: #f0f0ff;

		left: 50%;
		top: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
		transition: 300ms ease-out;
	}

	.card:hover > .bg {
		transform: translate(-50%, -50%) scale(1.05);
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		color: #9146ff;

		font-size: clamp(24px, 5vw, 56px);
		font-weight: 600;

		padding: 45px;
		align-self: stretch;
		flex-basis: 100%;

		position: relative;
		z-index: var(--z-index-3);
		overflow: hidden;
	}

	.text {
		display: none;
	}

	.displayed-text > :global(span) {
		display: inline-block;
		position: relative;
		z-index: 1000;
		transition: 300ms ease;
		transform: translateX(var(--x)) translateY(var(--y)) rotate(var(--deg));
	}

	.card:hover .displayed-text > :global(span) {
		transform: none;
	}

	.fg {
		position: absolute;
		z-index: var(--z-index-2);

		left: 50%;
		top: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
		overflow: hidden;
	}

	.fg :global(.word-hitbox) {
		position: absolute;
		background: red;
	}
</style>
