<script lang="ts">
	import Tweet from '$root/components/tweet.svelte'
	import type { TweetType } from '$root/types'
	import Compose from '$root/components/compose.svelte'
	export let tweets: TweetType[] = []
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<Compose />

<h1>Feed</h1>

{#each tweets as tweet (tweet.id)}
	<Tweet {tweet} />
{/each}
