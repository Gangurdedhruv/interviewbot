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
};

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