<script lang="ts">
	import type { ICard, IDeck } from '$lib/components/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Card from '$lib/components/study/Card.svelte';
	import Summary from '$lib/components/study/Summary.svelte';

	const deckData = getContext<Writable<IDeck>>('deckData');
	let cards: ICard[] = $deckData.cards;

	let currentIndex = 0;

	let easyQns: string[] = [];
	let hardQns: string[] = [];
	let displaySummary = false;

	const markEasy = () => {
		easyQns.push(cards[currentIndex].id);
	};

	const markHard = () => {
		hardQns.push(cards[currentIndex].id);
	};

	const finished = () => {
		console.log('Finished');
		console.log('Easy: ', easyQns);
		console.log('Hard: ', hardQns);

		displaySummary = true;
	};
</script>

<div class="page">
	<h1>{currentIndex + 1}/{cards.length}</h1>
	<Card {cards} bind:currentIndex {markEasy} {markHard} {finished} />
</div>

{#if displaySummary}
	<Summary {easyQns} {hardQns} {cards} bind:displaySummary deckData={$deckData} />
{/if}
<a href="./" class="backBtn"><span class="material-icons-outlined"> arrow_back </span></a>

<style>
	.page {
		width: 100vw;
		height: 100svh;
		overflow: hidden;

		padding: 1rem;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	h1 {
		color: white;
		font-weight: bold;
		font-size: 2rem;

		position: fixed;
		top: 1rem;
		margin: auto;
	}

	.backBtn {
		position: fixed;
		top: 2rem;
		left: 2rem;
		border-radius: 50%;
		background: white;
		padding: 0.5rem;
		display: flex;

		text-decoration: none;
	}

	.backBtn span {
		font-size: 2rem;
		color: black;
	}
</style>
