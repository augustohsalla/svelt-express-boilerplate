<script lang="ts">
	import Tweet from '$root/components/tweet.svelte'
	import type { TweetType } from '$root/types'

	export let tweets: TweetType[] = []
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1>Feed</h1>

{#each tweets as tweet (tweet.id)}
	<Tweet {tweet} />
{/each}

