<script lang="ts">
	import { userStore, currentProfile } from '$lib/stores';
	import { auth } from '$lib/db/setup';
	import { signOut } from 'firebase/auth';

	const user = userStore(auth);

	const clickSignOut = () => {
		signOut(auth);
	};

	let menuOpen = false;
</script>

<button class="profilePic" on:click|self={() => (menuOpen = !menuOpen)}>
	<img src={$user?.photoURL} alt="" />
	{#if menuOpen}
		<div class="menu">
			<div class="info">
				<img src={$user?.photoURL} alt="" />
				<div>
					<h2>{$currentProfile?.username}</h2>
					<p>{$user?.email}</p>
				</div>
			</div>
			<div class="btnContainer">
				<a href="../profile/{$user?.uid}" class="editBtn">Edit</a>
				<button class="logoutBtn" on:click={clickSignOut}>Sign out</button>
			</div>
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
		z-index: 100;
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

		box-shadow: 2px 2px 10px 4px rgba(100, 100, 100, 0.3);

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

	.btnContainer {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.editBtn {
		padding: 0.5rem 1rem;
		background: var(--secondary-color);
		color: white;
		border-radius: 0.5rem;

		font-size: 1rem;

		text-decoration: none;
	}

	.logoutBtn {
		padding: 0.5rem 1rem;
		border: 1px solid grey;
		border-radius: 0.5rem;
		color: grey;
		cursor: pointer;

		font-size: 1rem;

		transition: 0.2s;
	}

	.logoutBtn:hover {
		background: grey;
		color: white;
	}
</style>
