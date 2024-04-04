import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    avatar:{
        type: String,
        default:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwUGBAECB//EADMQAAICAQIDBQYFBQEAAAAAAAABAgMEBREhMUESIlFxkQYTUmGxwSMyQoHRM3OCoeEU/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AP3EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR3XV0Q7ds4wiusmVeRr9EN1RXOx+L4IC4Bmp+0GU33K6oryb+58rXsxPiqn/g/wCQNODP1e0U99rseL+cJfyWWLqmLlNKNnZl8M+DA7gAAAAAAAAAAAAAAACr1TVoYjdVO07v9R8xrWovErVVT/GmufwrxMw2293zfMCS++3In27pucvn0IgAAAAAACy0/V7sZqFu9tXg+a8jTUX15FasqkpRfVGHOzTM+eDfvu3VL88fv5gbAHzXONkIzg1KMlumup9AAAAAAAAACO+2NFM7Z/lgt2SFP7S39jFhSnxslu/Jf92AoMi6eRfO6z803v5fIiAAHqW7SXFvoeF5omGo1rJsScpfk36IDkx9HyLY9qxxqXhLiyeWhyS7mQn5x2+5dADKZWLdiy2uhsuklyZAa+2qF1brsipRl0ZlsuiWNkTqlx25N9UBCAAL/wBnMttSxZvl3oeXVF6YnDuePlVWr9Mk35dTbLit0AAAAAAAAAM17Sybza4dI17+rf8ABpTMe0a21FPxqX1YFUAABrsdKNFajyUV9DImn0q9X4UPjguzJfMDrAAAovaCKV9Uurjx9S9M3rGQr8x9l7xguymuviBwgAAbXBm7MKib5yri36GKNlpi20/G/tx+gHUAAAAAAAAZ/wBp6vxKLduDTi/qaA4dYxv/AFYM4xXfj3o+aAyIAAE+HlWYlvvK3wfCUXyaGLi25dnYpXLnJ8ol7i6Vj0JOcfez6uXL9kB7j6pi2xW8/dy+GfAmnm4sFvLIr/aSZzXaRi2NuKnW38L4ehHHQ6d+9bY/RAQ5+r9uLrxU1vwc39inNRHTsSNbh7iLT5t8X6lZnaRKvezG3nHrB815eIFUAAPYxcpKMebexuKoe7qhBfpikZfQ8Z358ZNd2rvPz6GrAAAAAAAAAAADK63gvGyHbWvwrHuvk+qOPFx5ZV0aq+b5vwXibLIpryKZVWx7UZc0cGDpywVPj2nJ8JbdOiAkxqK8apVVLZLm+rfiSgAAAAAAFNrOAknk0rbbjZFfUp4pymoxW8m9kl1Zsdu1w57rbY59P0mvEuldLvS3fYXwoCXSsJYeKoP+pLvTfzO0AAAAAAAAAAAAB40nzPQBFKr4SNxa5o6QByg6HGL6L0HYj4L0Ag2Z9Rrcvl5kySXJI9A+YwUT6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;