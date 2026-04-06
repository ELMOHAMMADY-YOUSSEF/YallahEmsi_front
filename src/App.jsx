import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inscription from "./components/Inscription";
import ListeTrajets from "./components/ListeTrajets";
import PublierTrajet from "./components/PublierTrajet";
import Wallet from "./components/Wallet";
import Login from "./components/Login";
import MesTrajets from "./components/MesTrajets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* <--- L'Login howa l'Bab */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/trajets" element={<ListeTrajets />} />
        <Route path="/publier" element={<PublierTrajet />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/mes-trajets" element={<MesTrajets />} />
      </Routes>
    </Router>
  );
}

export default App;