export const getAllPosts = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/get-all-posts`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const getPostById = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/get-post-by-id/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const addPost = async (post) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/add-post`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(post)
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const updatePost = async (id, post) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/update-post/${id}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(post)
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const deletePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/delete-post/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const addReply = async (id, reply) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/add-reply/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(reply)
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const getAllRepliesOfPost = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/get-all-replies-of-post/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const updateReply = async (id, reply) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/update-reply/${id}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(reply)
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}

export const deleteReply = async (reply) => {
    try {
        const response = await fetch(`http://localhost:5000/api/comm/delete-reply`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(reply)
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting posts:", err);
    }
}