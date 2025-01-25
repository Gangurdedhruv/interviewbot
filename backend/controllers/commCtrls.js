import Post from '../models/posts.js'
import Reply from '../models/replies.js'

export const createPost = async(req, res) => {
    try{
        const response = await Post.create(req.body)
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const getAllPosts = async(req, res) => {
    try{
        const response = await Post.find({})
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const updatePost = async(req, res) => {
    try{
        const response = await Post.findByIdAndUpdate(req.params._id, req.body, {new: true})
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const deletePost = async(req, res) => {
    try{
        const response = await Post.findByIdAndDelete(req.params._id)
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const addReply = async(req, res) => {
    try{
        const res1 = await Reply.create(req.body)
        const res2 = await Post.findByIdAndUpdate(req.params._id, { "$push": {replies: res1._id}}, {new: true})
        return res.json({
            success: true,
            message: res2
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const getAllRepliesOfPost = async(req, res) => {
    try{
        const res1 = await Post.findById(req.body, {_id:0, replies:1})
        const res2 = await Reply.find({_id: {"$in": res1.replies}})
        return res.json({
            success: true,
            message: res2
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const updateReply = async(req, res) => {
    try{
        const response = await Reply.findByIdAndUpdate(req.params._id, req.body, {new: true})
        return res.json({
            success: true,
            message: response
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}

export const deleteReply = async(req, res) => {
    try{
        const res1 = await Reply.findByIdAndDelete(req.body.replyId)
        const res2 = await Post.findByIdAndUpdate(req.body.postId, { "$pull": {replies: req.body.replyId}}, {new: true})
        return res.json({
            success: true,
            message: res1
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
}