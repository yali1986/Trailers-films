import { useState, useEffect } from "react"

export default function Likes({ movieId }) {
    const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const [likes, setLikes] = useState (storedLikes[movieId] || 0 );
   

    useEffect(() => {
      // Guarda los likes en localStorage para cada película
      const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
      storedLikes[movieId] = likes;
      localStorage.setItem("likes", JSON.stringify(storedLikes))
      }, [likes, movieId])  // Se ejecuta cuando cambia likes o movieId

    useEffect (() => {
      // Recupera los likes guardados para esta película
     const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
     setLikes(storedLikes[movieId] || 0)
    }, [movieId])  

    
   
    const darLike = () => setLikes((prevLikes) => prevLikes + 1); 
    const quitarLike = ()=> setLikes((prevLikes) => (prevLikes > 0 ? prevLikes - 1 : 0));
    
  return (
    <div className="bg-blue-100 py-2 px-2 text-center rounded">
    <h6>Votes {likes}</h6>
    <div className="flex flex-col lg:flex-row gap-2">
    <button onClick={darLike} className="me-6 border-1 rounded px-2">I Like</button>
    <button onClick={quitarLike} className="me-6 border-1 rounded px-2">I don't like</button>
    </div>
    </div>
  )
}