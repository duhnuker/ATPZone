import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AOMensSingles from './pages/AOMensSingles';
import AOWomensSingles from './pages/AOWomensSingles';


function App() {

  return (
    <Theme accentColor="crimson">
      <BrowserRouter>
        <Routes>
          <Route path='/aomenssingles' element={<AOMensSingles />}></Route>
          <Route path='/aowomenssingles' element={<AOWomensSingles />}></Route>
        </Routes>
      </BrowserRouter>
    </Theme>
  )
}

export default App
