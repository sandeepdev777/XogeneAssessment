
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DrugSearch from './components/Search/DrugSearch';
import DrugDetail from './components/DrugDetails/DrugDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DrugSearch />} />
          <Route path="/drug/:drugName" element={<DrugDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
