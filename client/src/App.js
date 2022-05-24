import './App.css';
import HomePage from './Pages/HomePage';
import ResultPage from './Pages/ResultPage';
import SongDetailPage from './Pages/SongDetailPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useHistory
// } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route
          path='/'
          element={<HomePage navigate={navigate} />}>
        </Route>
        <Route
          path='/result'
          element={<ResultPage />}>
        </Route>
        <Route
          path='/result-detail'
          element={<SongDetailPage />}>
        </Route>
      </Routes>
      {/* <HomePage></HomePage> */}
      {/* <ResultPage></ResultPage> */}
    </div>
  );
}

export default App;
