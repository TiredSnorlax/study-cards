<script lang="ts">
	import type { ICard, IDeck } from '$lib/components/types';
	import Card from '$lib/components/edit/Card.svelte';
	import { doc, updateDoc } from 'firebase/firestore';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { db } from '$lib/db/setup';
	import { v4 as uuidv4 } from 'uuid';
	import SideBar from '$lib/components/edit/SideBar.svelte';

	const deckData = getContext<Writable<IDeck>>('deckData');

	let sideOpen = true;
	let sideChanged = false;

	let newTitle = $deckData.title;
	let newDescription = $deckData.description;
	let newPermissions = $deckData.permissions;
	let newIsPublic = $deckData.isPublic;

	let cards: ICard[] = $deckData.cards;

	let originalLength = $deckData.cards.length;
	let cardsChanged: boolean[] = $deckData.cards.map((_) => false);

	$: hasChanged =
		cardsChanged.includes(true) || cardsChanged.length !== originalLength || sideChanged;

	const resetAll = () => {
		if (!$deckData) return;
		$deckData.title = newTitle;
		$deckData.description = newDescription;
		$deckData.permissions = [...newPermissions];
		$deckData.isPublic = newIsPublic;
		$deckData.cards = cards;

		cardsChanged = cardsChanged.map((_) => false);
		originalLength = cards.length;

		sideChanged = false;
	};

	const addCard = () => {
		let newCard: ICard = {
			id: uuidv4(),
			question: '',
			answer: '',
			difficulty: 0
		};

		cards = [...cards, newCard];
		cardsChanged = [...cardsChanged, true];
	};

	const deleteCard = (index: number) => {
		console.log(newPermissions, $deckData.permissions);
		cards = cards.filter((_, i) => i !== index);
		cardsChanged = cardsChanged.filter((_, i) => i !== index);
	};

	const saveData = async () => {
		if (!$deckData.id) return;
		const deckDoc = doc(db, 'decks', $deckData.id);

		console.log(cards);
		await updateDoc(deckDoc, {
			title: newTitle,
			description: newDescription,
			permissions: newPermissions,
			isPublic: newIsPublic,
			cards
		});
		console.log('updated');

		resetAll();
	};
</script>

<div class="page" class:sideOpen>
	<SideBar
		bind:sideChanged
		bind:sideOpen
		bind:newTitle
		bind:newDescription
		bind:newPermissions
		bind:newIsPublic
	/>
	<div class="main">
		<h1>Cards</h1>
		<div class="cards__container">
			{#each cards as card, i}
				<Card bind:card index={i} id={card.id} bind:hasChanged={cardsChanged[i]} {deleteCard} />
			{/each}
			<button class="newCard__btn" on:click={addCard}>Add new Card</button>
		</div>
	</div>
</div>

<button class="saveBtn" on:click={saveData} class:hasChanged>Save</button>

<style>
	.saveBtn {
		position: fixed;
		right: 2rem;
		bottom: 2rem;
		background: #dd00dd;
		opacity: 0.5;
		color: white;
		font-size: 1.5rem;
		padding: 0.5rem 1.5rem;
		border-radius: 4rem;

		cursor: pointer;
	}

	.saveBtn:hover {
		opacity: 1;
	}

	.saveBtn.hasChanged {
		background: purple;
		opacity: 1;
	}

	.page {
		display: flex;

		width: 100vw;
		height: 100svh;
		overflow: hidden;
	}

	.newCard__btn {
		color: grey;

		font-size: 1.5rem;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 2px dashed grey;

		align-self: center;

		cursor: pointer;
	}

	.newCard__btn:hover {
		background: white;
	}

	.main {
		padding: 2rem;
		overflow-y: auto;

		min-width: 250px;

		flex: 1 1 auto;
	}

	.main h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	.main .cards__container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
