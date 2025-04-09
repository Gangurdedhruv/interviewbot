import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost,
    addReply, getAllRepliesOfPost, updateReply, deleteReply
 } from '../controllers/commCtrls.js';

const router = express.Router();

router.post('/add-post', createPost)
router.get('/get-all-posts', getAllPosts)
router.get('/get-post-by-id/:id', getPostById)
router.patch('/update-post/:id', updatePost)
router.delete('/delete-post/:id', deletePost)

router.post('/add-reply/:id', addReply)
router.get('/get-all-replies-of-post/:id', getAllRepliesOfPost)
router.patch('/update-reply/:id', updateReply)
router.delete('/delete-reply', deleteReply)

export default router;