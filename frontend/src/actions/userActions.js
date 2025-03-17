export const registerUser = async (userDetails) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(userDetails),
        })
        return response.json()
    } catch (err) {
        console.log(err)
    }
}