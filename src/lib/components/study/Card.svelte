<script lang="ts">
	import type { ICard } from '../types';

	const MAX_CARD_ROTATION = 20;
	const ANIMATION_DURATION = 750;

	export let cards: ICard[];
	export let currentIndex: number;
	export let markEasy: () => void;
	export let markHard: () => void;
	export let finished: () => void;

	$: card = cards[currentIndex];

	let cardEle: HTMLDivElement;
	let cardExit = false;

	let showAnswer = false;
	let showNextBtn = false;

	let showDifficultyOptions = true;

	const getNextCard = () => {
		if (currentIndex + 1 < cards.length) {
			if (currentIndex + 1 > 0) cardExit = true;
			showNextBtn = false;

			setTimeout(() => {
				showAnswer = false;
				currentIndex++;
			}, ANIMATION_DURATION / 2);

			setTimeout(() => {
				cardExit = false;
				showDifficultyOptions = true;
			}, ANIMATION_DURATION);
		} else {
			finished();
		}
	};

	const rotateCard = (e: MouseEvent) => {
		console.log('mousemove');
		const x = e.clientX;
		const y = e.clientY;

		const middleX = innerWidth / 2;
		const middleY = innerHeight / 2;

		cardEle.style.setProperty('--angleY', ((x - middleX) * MAX_CARD_ROTATION) / middleX + 'deg');
		cardEle.style.setProperty('--angleX', ((middleY - y) * MAX_CARD_ROTATION) / middleY + 'deg');
	};

	const toggleAns = () => {
		showAnswer = !showAnswer;
		showNextBtn = !showNextBtn;
	};

	const clickEasy = () => {
		markEasy();
		showDifficultyOptions = false;
	};

	const clickHard = () => {
		markHard();
		showDifficultyOptions = false;
	};
</script>

<svelte:window on:mousemove={rotateCard} />
<div class="cardContainer" class:exit={cardExit} class:enter={!cardExit}>
	<div class="card" bind:this={cardEle}>
		{#if card}
			{#if showAnswer}
				<h2>Ans: {card.answer}</h2>
			{:else}
				<h2>{card.question}</h2>
			{/if}
			<div class="btnContainer">
				{#if showAnswer && showDifficultyOptions}
					<div>
						<button on:click={clickEasy}>Too Easy</button>
						<button on:click={clickHard}>Too Hard</button>
					</div>
				{/if}
				<button on:click={toggleAns} class="revealBtn">Reveal</button>
			</div>
		{/if}
	</div>
</div>
{#if showNextBtn}
	<button on:click={getNextCard} class="nextBtn">
		{#if currentIndex + 1 >= cards.length}
			Results
		{:else}
			Next
		{/if}
	</button>
{/if}

<style>
	.cardContainer.exit {
		animation: exitAnim 750ms ease-in-out forwards;
	}

	.cardContainer.enter {
		animation: enterAnim 750ms ease-in-out forwards;
	}

	.card {
		--angleX: 0deg;
		--angleY: 0deg;

		border-radius: 0.5rem;
		box-shadow: 2px 2px 10px 3px LightGrey;
		height: 400px;
		width: 300px;

		background: white;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		padding: 1rem;
		padding-top: 3rem;

		padding-top: 3rem;
		transform-style: preserve-3d;
		transform: perspective(1000px) rotateX(var(--angleX)) rotateY(var(--angleY));

		position: relative;
	}

	.card h2 {
		font-size: 2rem;
	}

	.card::after {
		content: '';
		position: absolute;
		inset: -1rem;
		border-radius: inherit;
		transform: translateZ(-40px);

		background: white;
		filter: blur(10px);
		opacity: 0.5;
	}

	.card .btnContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card .btnContainer > div button {
		border-radius: 5px;
		padding: 0.5rem 1rem;

		font-size: 1rem;
		color: white;
	}

	.card .btnContainer > div button:first-child {
		background-color: lightgreen;
	}

	.card .btnContainer > div button {
		background-color: red;
	}

	.card .revealBtn {
		color: grey;
		font-size: 1rem;
	}

	@keyframes exitAnim {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-120vw);
		}
	}

	@keyframes enterAnim {
		0% {
			transform: translateX(120vw);
		}
		100% {
			transform: translateX(0);
		}
	}

	.nextBtn {
		position: fixed;
		bottom: 1rem;
		margin-inline: auto;

		height: min-content;

		font-size: 1.2rem;

		background: white;
		color: #16b7fc;
		border: 2px solid #16b7fc;
		border-radius: 2rem;
		padding: 0.5rem 1rem;
	}

	@media (max-width: 600px) {
		.card {
			transform: perspective(1000px) rotateX(0) rotateY(0) !important;
		}
	}
</style>
