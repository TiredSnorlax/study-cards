<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { fade, scale, slide } from 'svelte/transition';

	export let shareMenuOpen: boolean;
	export let deckId: string | undefined;

	let url = '';
	let copied = false;

	let qrCanvasEle: HTMLCanvasElement;

	const copyToClipboard = () => {
		if (typeof navigator === 'undefined') return;
		navigator.clipboard.writeText(url);
		copied = true;
	};

	onMount(() => {
		url = window.location.origin + '/deck/' + deckId + '?sharing=true';
		QRCode.toCanvas(
			qrCanvasEle,
			url,
			{ width: 300, color: { light: '#ffffff00' } },
			function (error) {
				if (error) console.error(error);
				console.log('success!');
			}
		);
	});
</script>

<button class="background" on:click|self={() => (shareMenuOpen = false)} transition:fade>
	<div class="menu" transition:scale>
		<button class="closeBtn" on:click={() => (shareMenuOpen = false)}
			><span class="material-icons-outlined"> close </span></button
		>
		<h1>Share this Deck</h1>
		<div class="link" class:copied>
			<p>{url}</p>
			<button class="copyBtn" on:click={copyToClipboard}
				><span class="material-icons-outlined"> {copied ? 'done' : 'content_copy'} </span></button
			>
		</div>
		<div class="qrCode"><canvas bind:this={qrCanvasEle} width="200" height="200" /></div>
	</div>
</button>

<style>
	.background {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;

		padding: 1rem;

		display: flex;
		justify-content: center;
		align-items: center;

		backdrop-filter: blur(5px);
		background: rgba(0, 0, 0, 0.1);
	}

	.menu {
		background: var(--primary-color);
		padding: 2rem;
		border-radius: 1rem;

		width: 100%;
		max-width: 600px;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		position: relative;
	}

	.link {
		background: rgba(100, 100, 100, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		font-size: 1rem;

		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		transition: 0.3s;
	}

	.link p {
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.link.copied {
		background: rgba(0, 220, 0, 0.4);
	}

	.copyBtn {
		cursor: pointer;
	}

	.closeBtn {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	canvas {
		background: none;
		width: 200px;
		height: 200px;
	}
</style>
