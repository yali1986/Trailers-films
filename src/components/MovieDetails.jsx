import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetails() {

    const { id } = useParams(); // Obtiene el ID de la URL
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/movie/${id}`, {
                    params: { api_key: API_KEY },
                });
                setMovie(data);
            } catch (error) {
                console.error('Error al obtener detalles de la película', error);
            }
        };

        fetchMovie();
    }, [id]);

    if (!movie) return <h2>Cargando...</h2>;

    return (
        <div className="container mt-10 text-center flex flex-col gap-4">
            <div className="flex items-center">
                <button className="btn btn-primary" onClick={() => window.history.back()}>
                    Return
                </button>
                <h1 className="flex-1 text-center text-xl font-bold">{movie.title}</h1>
            </div>

            <img src={`${IMAGE_PATH}${movie.poster_path}`} alt={movie.title} className="w-full h-96 object-cover rounded-md" />
            <p><strong>Description:</strong> {movie.overview}</p>
            <p><strong>Release date:</strong> {movie.release_date}</p>
            <p><strong>Punctuation:</strong> {movie.vote_average} / 10</p>
            <p><strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>

            <button className="btn btn-primary" onClick={() => window.history.back()}>Return</button>
        </div>
    );
}