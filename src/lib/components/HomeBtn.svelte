<script lang="ts">
	export let path: string = './';
</script>

<a href={path}>
	<span class="material-icons-outlined"> home </span>
</a>

<style>
	a {
		border-radius: 50%;
		padding: 0.5rem;
		text-decoration: none;
		color: white;

		background: blue;

		position: fixed;
		top: 2rem;
		left: 2rem;

		display: flex;
	}

	a span {
		font-size: 2rem;
	}

	@media (max-width: 600px) {
		a {
			top: 1rem;
			left: 1rem;
		}
	}
</style>
