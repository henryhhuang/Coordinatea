
const env = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api.coordinatea.me';

export const uploadImage = (file, callback, errorCallback) => {
    const formData = new FormData();
    formData.append('file', file);
    fetch(env + '/api/image/0/', {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.error) {
            throw new Error(result.error);
        }
        callback(result);
    }).catch((error) => {
        errorCallback(error.message);
    }) 
}
