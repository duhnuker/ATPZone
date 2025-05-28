import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import AOMensSingles from './pages/Mens/AOMensSingles';
import AOWomensSingles from './pages/Womens/AOWomensSingles';


function App() {

  return (
    <Theme accentColor="crimson">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/aomenssingles' element={<AOMensSingles />}></Route>
          <Route path='/aowomenssingles' element={<AOWomensSingles />}></Route>
        </Routes>
      </BrowserRouter>
    </Theme>
  )
}

export default App
