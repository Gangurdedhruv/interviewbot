import express from 'express';
import { createPost, getAllPosts, updatePost, deletePost,
    addReply, getAllRepliesOfPost, updateReply, deleteReply
 } from '../controllers/commCtrls.js';

const router = express.Router();

router.post('/add-post', createPost)
router.get('/get-all-posts', getAllPosts)
router.patch('/update-post/:_id', updatePost)
router.delete('/delete-post/:_id', deletePost)

router.patch('/add-reply/:_id', addReply)
router.get('/get-all-replies-of-post', getAllRepliesOfPost)
router.patch('/update-reply/:_id', updateReply)
router.patch('/delete-reply', deleteReply)

export default router;