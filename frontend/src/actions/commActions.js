export const getAllPosts = () => {
    return fetch(`http://localhost:5000/api/comm/get-all-posts`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        return response.json();
    })
    .catch((err) => console.log("Error getting posts:", err));
};