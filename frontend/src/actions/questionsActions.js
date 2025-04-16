export const getAllFamousQuestions = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/interviewQuestions/get-all-famous-questions`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting famous questions:", err);
    }
}

export const getFamousQuestionById = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/interviewQuestions/get-famous-question-by-id/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting famous question:", err);
    }
}

export const getFamousQuestionsByCompany = async (company) => {
    try {
        const response = await fetch(`http://localhost:5000/api/interviewQuestions/get-famous-questions-by-company/${company}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting company questions:", err);
    }
}

export const getFamousQuestionsByDifficulty = async (difficulty) => {
    try {
        const response = await fetch(`http://localhost:5000/api/interviewQuestions/get-famous-questions-by-difficulty/${difficulty}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error getting difficulty questions:", err);
    }
}

export const searchFamousQuestions = async (searchTerm) => {
    try {
        const response = await fetch(`http://localhost:5000/api/interviewQuestions/search-famous-questions?q=${encodeURIComponent(searchTerm)}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (err) {
        return console.log("Error searching questions:", err);
    }
}