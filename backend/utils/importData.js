import fs from 'fs'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/posts.js'
import Reply from '../models/replies.js'

dotenv.config({
    path: "../../.env"
})

try {
    const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure if there's an error
}

const dummyPosts = JSON.parse(fs.readFileSync('./dummyPosts.json'))
const dummyReplies = JSON.parse(fs.readFileSync('./dummyReplies.json'))

const posts = dummyPosts.map(post => ({
    title: post.title,
    content: post.content,
    replycount: post.replycount,
    tags: post.tags,
    votes: post.votes,
    userId: post.userId,
    replies: []
}))
const replies = dummyReplies.map(reply => ({
    content: reply.content,
    votes: reply.votes,
    isAccepted: reply.isAccepted,
    userId: reply.userId,
}))

try {
    const res1 = await Reply.create(replies)
    posts[0].replies.push(res1[0]._id)
    posts[0].replies.push(res1[1]._id)
    posts[0].replies.push(res1[2]._id)
    posts[1].replies.push(res1[3]._id)
    posts[2].replies.push(res1[4]._id)
    posts[2].replies.push(res1[5]._id)
    posts[4].replies.push(res1[6]._id)
    posts[4].replies.push(res1[7]._id)
    const res2 = await Post.create(posts)
    console.log("Imported data: posts and replies")
} catch (err) {
    console.error(`Error importing data: ${err}`)
} finally {
    mongoose.disconnect()
    process.exit(0)
}