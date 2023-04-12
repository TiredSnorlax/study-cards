<script lang="ts">
	import type { IDeck } from '$lib/components/types';

	import { db, auth } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import type { User } from 'firebase/auth';
	import { getDocs, collection, where, query } from 'firebase/firestore';

	import Profile from '$lib/components/Profile.svelte';
	import DeckSearchBar from '$lib/components/main/DeckSearchBar.svelte';

	import { quotes } from '$lib/quotes';

	let user = userStore(auth);
	let decks: IDeck[] = [];

	let searchResults: IDeck[][] | null = null;

	const getDecks = async (user: User | null) => {
		decks = [];
		if (!user) return;
		const q = query(collection(db, 'decks'), where('ownerId', '==', user.uid));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			let data = doc.data() as IDeck;
			let deck: IDeck = { ...data, id: doc.id };
			decks = [...decks, deck];
		});
	};

	$: getDecks($user);
</script>

<Profile />
<div class="page">
	<h1>{quotes[Math.floor(Math.random() * quotes.length)]}</h1>
	<DeckSearchBar bind:searchResults />
	<div class="decks">
		<a href="/deck/new" class="newDeckBtn"><p>New Deck</p></a>
		{#each decks as deck}
			<a href="/deck/{deck.id}" class="deck"
				><div>
					<div class="img__container" />
					<p class="deck__title">{deck.title}</p>
				</div></a
			>
		{/each}
	</div>
</div>

<style>
	.page {
		padding: 1rem;
	}

	h1 {
		margin-top: 1.5rem;
		padding-top: 3rem;
		text-align: center;
		font-size: 2.5rem;
	}

	.decks {
		--min-item-width: 120px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;

		padding: 2rem;
	}

	.newDeckBtn {
		border: 2px dashed black;
		padding: 1rem;

		flex: 1 1 var(--min-item-width);
		max-width: calc(calc(var(--min-item-width) * 2) + 1rem);

		aspect-ratio: 1;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		font-size: 1.2rem;

		cursor: pointer;
		transition: 0.2s;

		text-decoration: none;
		color: initial;
	}

	.newDeckBtn:hover {
		background: var(--secondary-color);
	}

	.deck {
		border-radius: 0.5rem;
		box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.4);

		flex: 1 1 var(--min-item-width);
		max-width: 250px;
		aspect-ratio: 1;

		overflow: hidden;
		transition: 0.2s;

		text-decoration: none;
		color: initial;
		background: var(--primary-color);
	}

	.deck > div {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: 7fr 3fr;

		text-align: center;
	}

	.deck:hover {
		box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.4);
	}

	.deck .img__container {
		background: red;
	}

	.deck__title {
		font-weight: bold;
		font-size: 1.5rem;
		height: min-content;
		margin-block: auto;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 1.5rem;
		}
	}
</style>
