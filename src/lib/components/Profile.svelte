<script lang="ts">
	import { userStore } from '$lib/stores';
	import { auth } from '$lib/db/setup';
	import { signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	const user = userStore(auth);

	const clickSignOut = () => {
		signOut(auth);
	};

	// TODO: Add secondary color
	let bgColor: string | null;
	let newBgColor: string | null;

	let menuOpen = false;

	const changeBg = (color: string | null) => {
		if (!color) return;
		window.document.body.style.background = color;
	};

	const saveBg = () => {
		if (!newBgColor) return;
		localStorage.setItem('bgColor', newBgColor);
		bgColor = newBgColor;
	};

	$: changeBg(newBgColor);

	onMount(() => {
		bgColor = localStorage.getItem('bgColor') || '#ffffff';
		newBgColor = localStorage.getItem('bgColor') || '#ffffff';

		console.log(newBgColor);
	});
</script>

<button class="profilePic" on:click|self={() => (menuOpen = !menuOpen)}>
	<img src={$user?.photoURL} alt="" />
	{#if menuOpen}
		<div class="menu">
			<div class="info">
				<img src={$user?.photoURL} alt="" />
				<div>
					<h2>{$user?.displayName}</h2>
					<p>{$user?.email}</p>
				</div>
			</div>
			<div class="colorPicker">
				<p>BG Color:</p>
				<input type="color" bind:value={newBgColor} />
			</div>
			{#if bgColor !== newBgColor}
				<button on:click={saveBg} class="saveBgBtn">Save</button>
			{/if}
			<button class="logoutBtn" on:click={clickSignOut}>Sign out</button>
		</div>
	{/if}
</button>

<style>
	img {
		border-radius: 50%;
	}

	.profilePic {
		border-radius: 50%;
		border: 2px solid white;

		display: flex;
		position: fixed;
		top: 2rem;
		right: 2rem;
	}

	.profilePic::after {
		content: '';
		position: absolute;
		inset: -4px;
		border: 2px solid blue;
		border-radius: 50%;
	}

	.profilePic > img {
		border-radius: inherit;
		width: 48px;
		height: 48px;
		object-fit: cover;
	}

	.menu {
		position: absolute;
		top: calc(100% + 1rem);
		right: 0;

		padding: 1rem;
		border-radius: 1rem;
		background: white;

		border: 1px solid black;

		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 1rem;
	}

	.menu .info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.menu .info img {
		width: 72px;
		height: 72px;
	}

	.logoutBtn {
		padding: 0.5rem 1rem;
		border: 1px solid grey;
		border-radius: 0.5rem;
		font-size: 1rem;
		color: grey;
		cursor: pointer;

		transition: 0.2s;
	}

	.logoutBtn:hover {
		background: grey;
		color: white;
	}

	.colorPicker {
		display: flex;
		gap: 1rem;
		align-items: center;

		font-size: 1rem;
	}

	.saveBgBtn {
		border-radius: 3rem;
		border: 1px solid grey;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		color: grey;
		cursor: pointer;
	}
</style>
