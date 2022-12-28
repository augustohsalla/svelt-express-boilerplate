<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit'
	import { error } from '@sveltejs/kit'

	export const load: Load = (params) => {
		console.log(params)
		return {
			props: {
				title: ` ${params.data}`,
			},
		}
	}
	export function load2(locals: any) {
		console.log(locals)
		if (!locals.user) {
			throw error(401, 'not logged in')
		}

		if (!locals.user.isAdmin) {
			throw error(403, 'not an admin')
		}
	}
</script>

<script lang="ts">
	export let title: string
</script>

<div class="error">
	<h1>{title}</h1>
	<img src="/dancing.webp" alt="Person dancing" />
</div>

<style>
	.error {
		display: grid;
		gap: var(--spacing-32);
		padding: var(--spacing-24) var(--spacing-32);
		place-items: center;
	}

	img {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		object-fit: cover;
	}
</style>
