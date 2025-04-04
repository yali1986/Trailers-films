import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ListMovies from './components/ListMovies';
import MovieDetails from './components/MovieDetails';



function App() {
  
  return (
<>
 <Router>
  <Routes>
    <Route path="/" element={ <ListMovies />}/>
    <Route path="/movie/:id" element={<MovieDetails />} />
  </Routes>
 </Router>

   
    </>
  );
}

export default App;
