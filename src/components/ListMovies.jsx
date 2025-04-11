import axios from 'axios';
import { useEffect, useState } from 'react';
import Youtube from 'react-youtube';
import './listMovies.css';
import Likes from './Likes';
import { useNavigate } from 'react-router-dom';


export default function ListMovies() {
    const navigate = useNavigate();
    const API_URL = 'https://api.themoviedb.org/3';
    const API_KEY = import.meta.env.VITE_API_KEY;
    const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';

    // Variables de estado
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [trailer, setTrailer] = useState(null);
    const [movie, setMovie] = useState({ title: 'Loading Movies' });
    const [playing, setPlaying] = useState(false);

    // Función para realizar la petición GET a la API
    const fetchMovies = async (searchKey) => {
        const type = searchKey ? 'search' : 'discover';
        const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
            },
        });
        setMovies(results);

        if (results.length) {
            await fetchMovie(results[0].id);
            setMovie(results[0]);
        }
    };

    // Función para obtener información de una película y su tráiler
    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'videos',
            },
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find((vid) => vid.name === 'Official Trailer');
            setTrailer(trailer || data.videos.results[0]);
        }
        setMovie(data);
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
        window.scrollTo(0, 80);
    };

    // Función para buscar películas
    const searchMovies = (e) => {
        e.preventDefault();
        fetchMovies(searchKey);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div className='mb-40'>
            <h1 className='text-4xl text-center pt-10'>🎬
                Watch the trailer <br></br>for your favorite movie</h1>
            <h2 className='text-center mt-2 mb-5'></h2>

            {/* Buscador */}
            <form className='container mb-4' onSubmit={searchMovies}>
                <input type='text' placeholder='Title of the movie or any word' className="w-80 px-4 py-2 border rounded-md text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setSearchKey(e.target.value)} />
                <button className='btn btn-primary ms-2'>Search</button>
            </form>

            {/* Banner y reproductor de video */} 
            <main>            
                {movie && (
                    <div className='viewtrailer' style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path || movie.poster_path}")`}}>
                        <div className='p-4 md:flex gap-2'>
                            {trailer ? (
                                <div className='flex justify-center items-center my-auto'>
                                    <button className='btn btn-primary w-30 self-start' onClick={() => setPlaying(true)}>Play Trailer</button>
                                </div>
                            ) : (
                                <p className='text-white rounded mt-2 px-1 flex justify-center items-center  self-start bg-neutral-500 min-h-10'>'Sorry, no trailer available'</p>
                            )}
                            <div className='flex justify-center items-center my-auto'>
                                <div >
                                    <button className='btn btn-primary w-30' onClick={() => {
                                        navigate(`/movie/${movie.id}`)
                                    }}>More Info</button>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                    
                )}
                <div className='flex flex-col text-center justify-center bg-blue-100 px-6 rounded p-4'>
                                <h1 className='md:ms-4 mb-4 '>{movie.title}</h1>
                                <p>{movie.overview}</p>
                            </div>
            </main>

            {/* Modal del tráiler */}
            {playing && (
                <div className='modal' onClick={() => setPlaying(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <button className='close-btn font-black px-2' onClick={() => setPlaying(false)}>X</button>
                        <Youtube
                            videoId={trailer?.key}
                            className='reproductor'
                            opts={{
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                    autoplay: 1,
                                    controls: 1,
                                    modestbranding: 1,
                                    rel: 0,
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Contenedor de películas */}
            <div className='mx-14 mt-10 flex justify-center items-center'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6'>
                    {movies.map((movie) => (

                        <div key={movie.id} className="shadow-xl pb-3 rounded p-4">
                            <div onClick={() => selectMovie(movie)} className="cursor-pointer">
                                <img
                                    src={`${IMAGE_PATH}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-96 object-cover rounded-md"
                                />
                                <h4 className="text-center my-3">{movie.title}</h4>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Likes movieId={movie.id}/>
                                <button
                                    className="bg-blue-100 py-2 px-4 text-center rounded ms-1 lg:ms-0"
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                >
                                    More Info
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}