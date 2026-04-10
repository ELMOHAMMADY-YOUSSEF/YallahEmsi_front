import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Inscription from "./components/Inscription";
import ListeTrajets from "./components/ListeTrajets";
import PublierTrajet from "./components/PublierTrajet";
import Wallet from "./components/Wallet";
import MesTrajets from "./components/MesTrajets";
import MesReservations from "./components/MesReservations";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import dyal l'3essas 👮‍♂️

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Pages Publiques (Ay wa7d y-qder y-dkhol lihom) */}
        <Route path="/" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Pages Protégées (Khass t-koun m-connecté) */}
        <Route
          path="/trajets"
          element={
            <ProtectedRoute>
              <ListeTrajets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        {/* Pages dyal l'CONDUCTEUR Bo7do! */}
        <Route
          path="/publier"
          element={
            <ProtectedRoute roleRequis="conducteur">
              <PublierTrajet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-trajets"
          element={
            <ProtectedRoute roleRequis="conducteur">
              <MesTrajets />
            </ProtectedRoute>
          }
        />

        {/* Pages dyal l'PASSAGER (Étudiant) Bo7do! */}
        <Route
          path="/mes-reservations"
          element={
            <ProtectedRoute roleRequis="passager">
              <MesReservations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
