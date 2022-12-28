import type { RequestHandler } from '@sveltejs/kit'

import prisma from '$root/lib/prisma'
import { timePosted } from '$root/utils/date'

export const GET: RequestHandler = async () => {
	const data = await prisma.tweet.findMany({
		include: { user: true },
		orderBy: { posted: 'desc' },
	})

	// get the liked tweets
	const liked = await prisma.liked.findMany({
		where: { userId: 1 },
		select: { tweetId: true },
	})

	// we just want an array of the ids
	const likedTweets = Object.keys(liked).map(
		(key: any) => liked[key].tweetId
	)

	// we can shape the data however we want
	// so our user doesn't have to pay the cost for it
	const tweets = data.map((tweet) => {
		return {
			id: tweet.id,
			content: tweet.content,
			likes: tweet.likes,
			posted: timePosted(tweet.posted),
			url: tweet.url,
			avatar: tweet.user.avatar,
			handle: tweet.user.handle,
			name: tweet.user.name,
			liked: likedTweets.includes(tweet.id),
		}
	})

	if (!tweets) {
		return { status: 400 }
	}

	return {
		headers: { 'Content-Type': 'application/json' },
		status: 200,
		body: { tweets },
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData()
	const tweet = String(form.get('tweet'))

	// you should probably use a validation library
	if (tweet.length > 140) {
		return {
			status: 400,
			body: 'Maximum Tweet length exceeded.',
			headers: { location: '/home' }
		}
	}

	// the user id is hardcoded but you can get it from a session
	await prisma.tweet.create({
		data: {
			posted: new Date(),
			url: Math.random().toString(16).slice(2),
			content: tweet,
			likes: 0,
			user: { connect: { id: 1 } }
		}
	})

	return {}
}