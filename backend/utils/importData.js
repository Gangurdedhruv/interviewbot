import fs from 'fs'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/posts.js'
import Reply from '../models/replies.js'
import User from '../models/Users.js'

dotenv.config({
    path: "../../.env"
})

try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure if there's an error
}

const dummyPosts = JSON.parse(fs.readFileSync('./dummyData/posts.json'))
const dummyReplies = JSON.parse(fs.readFileSync('./dummyData/replies.json'))
const dummyUsers = []

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
    for (let i=1;i<5;i++){
        dummyUsers.push({
            name: `testname${i}`,
            email: `t${i}@e.c`,
            phone: `123456789${i}`,
            occupation: "testing",
            organization: "testing",
            password: "$2a$10$2KeaAH/F2m3GyWa6aqB4N..vZLytoF.NMXn4lO9DuYtnIqSibv15K",
            //test
        })
    }
    console.log()
    const res1 = await User.create(dummyUsers)

    replies[0].userId = res1[1]._id
    replies[1].userId = res1[2]._id
    replies[2].userId = res1[3]._id
    replies[3].userId = res1[0]._id
    replies[4].userId = res1[0]._id
    replies[5].userId = res1[1]._id
    replies[6].userId = res1[1]._id
    replies[7].userId = res1[2]._id
    const res3 = await Reply.create(replies)

    posts[0].replies.push(res3[0]._id)
    posts[0].replies.push(res3[1]._id)
    posts[0].replies.push(res3[2]._id)
    posts[1].replies.push(res3[3]._id)
    posts[2].replies.push(res3[4]._id)
    posts[2].replies.push(res3[5]._id)
    posts[4].replies.push(res3[6]._id)
    posts[4].replies.push(res3[7]._id)
    posts[0].userId = res1[0]._id
    posts[1].userId = res1[1]._id
    posts[2].userId = res1[2]._id
    posts[3].userId = res1[3]._id
    posts[4].userId = res1[2]._id
    const res2 = await Post.create(posts)

    console.log("Imported data: users, posts and replies")
} catch (err) {
    console.error(`Error importing data: ${err}`)
} finally {
    mongoose.disconnect()
    process.exit(0)
}