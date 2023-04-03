<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { ICard } from '../types';

	export let card: ICard;
	export let id: string;
	export let index: number;
	export let deleteCard: (index: number) => void;
	export let hasChanged: boolean;

	let toggleDelete = false;

	let savedCard: ICard | null = null;

	const onChangeContent = (newQuestion: string, newAnswer: string) => {
		if (!savedCard) return;
		if (savedCard.answer.length === 0 && savedCard.question.length === 0) {
			hasChanged = true;
		} else {
			const isSame = savedCard.answer === newAnswer && savedCard.question === newQuestion;
			hasChanged = !isSame;
		}
	};

	const onChangeCard = (_index: string) => {
		if (!card || typeof window === 'undefined') return;
		savedCard = structuredClone(card);
		console.log(index, card);
	};

	$: onChangeCard(id);
	$: onChangeContent(card.question, card.answer);
</script>

<div class="container" class:toggleDelete>
	<h2>{index + 1}.</h2>
	<div class="item" class:hasChanged>
		<textarea bind:value={card.question} placeholder="Type your question here" rows="4" />
		<textarea bind:value={card.answer} placeholder="Type the answer here" rows="4" />
	</div>
	<button on:click={() => (toggleDelete = !toggleDelete)} class="toggleBtn">
		<span class="material-icons-outlined"> chevron_left </span></button
	>
	<button on:click={() => deleteCard(index)} class="deleteBtn">Delete</button>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	h2 {
		font-size: 1.5rem;
	}

	.item {
		flex: 1 1 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;

		padding: 1rem;
		border-radius: 0.5rem;
		background: rgb(240, 240, 240);

		border: 1px solid grey;

		transition: 0.3s;
	}

	.container.toggleDelete .item {
		margin-left: -2rem;
	}

	.item.hasChanged {
		border: 2px solid blue;
	}

	textarea {
		background: white;
		outline: none;
		border: 1px solid grey;
		border-radius: 0.25rem;

		min-width: 100px;

		font-size: 1rem;
		padding: 0.5rem;

		resize: none;
	}

	.deleteBtn {
		width: 0px;
		overflow: hidden;
		transition: 0.3s;
		font-size: 1rem;
	}

	.deleteBtn:hover {
		color: red;
	}

	.container.toggleDelete .deleteBtn {
		width: 50px;
	}

	.toggleBtn {
		transition: 0.3s;
	}

	.container.toggleDelete .toggleBtn {
		transform: rotate(180deg);
	}
</style>
