<script lang="ts">
	import type { IDeck } from '$lib/components/types';
	import { auth } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import HomeBtn from '$lib/components/HomeBtn.svelte';
	import Profile from '$lib/components/Profile.svelte';

	const user = userStore(auth);

	const deckData = getContext<Writable<IDeck>>('deckData');

	let allowed = true;

	$: console.log($deckData);

	const checkAllowed = () => {
		if (!user || !deckData) return;
		if ($deckData.isPublic) return;
		console.log($deckData);
		if (
			$deckData.ownerId === $user?.uid ||
			$deckData.permissions.find((email) => email === $user?.email)
		) {
			console.log('allowed');
		} else {
			console.log('not allowed');
			allowed = false;
		}
	};

	onMount(() => {
		checkAllowed();
	});
</script>

<div class="page">
	<HomeBtn />
	<Profile />
	{#if allowed}
		<div class="menu">
			<div class="menu__img">Img placed here</div>
			<div class="menu__info">
				{#if deckData}
					<div>
						<h1>{$deckData.title}</h1>
						<p>{$deckData.description}</p>
					</div>
					<div class="btn__container">
						{#if $deckData.ownerId === $user?.uid}
							<a href="./{$deckData.id}/edit/" class="edit__btn">Edit</a>
						{/if}
						<a href="./{$deckData.id}/study/">Study</a>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<p>You have no access to this deck</p>
	{/if}
</div>

<style>
	.page {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100vh;
		overflow: hidden;
	}

	.menu {
		width: 80%;
		max-width: 800px;
		height: 60%;
		max-height: 600px;

		background: white;

		border-radius: 0.5rem;
		border: 1px solid black;
		display: grid;
		align-items: stretch;
		justify-content: center;
		grid-template-columns: 3fr 2fr;
		text-align: center;
	}

	.menu__img {
		background: blueviolet;
	}

	.menu__info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 2rem 0;
	}

	.menu__info h1 {
		font-size: 3rem;
	}

	.menu__info p {
		font-size: 1.2rem;
		color: grey;
	}

	.menu__info a {
		background: blue;
		padding: 0.5rem 1rem;
		border-radius: 5rem;
		margin-inline: 1rem;
		color: white;
		font-size: 1.2rem;

		text-decoration: none;
	}

	.menu .btn__container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.btn__container .edit__btn {
		background: lightgreen;
	}
</style>
