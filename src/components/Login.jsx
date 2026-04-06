import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8081/api/utilisateurs/login?email=${email}&motDePasse=${motDePasse}`);
      
      if (typeof response.data === "string" && response.data.includes("Erreur")) {
        setErreur(response.data);
      } else {
        // HNA L'BLAN: Kan-khebiw l'utilisateur f l'navigateur (localStorage)
        localStorage.setItem("user", JSON.stringify(response.data));
        
        // Kan-diwh l'page dyal les trajets
        navigate("/trajets");
      }
    } catch (error) {
      setErreur("Mochkil f l'itissal m3a l'serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-600">Se Connecter 🔐</h2>
          <p className="text-gray-500 mt-2">Dkhel l'compte dyalk f Yallah Emsi</p>
        </div>

        {erreur && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-center font-bold">{erreur}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required 
                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Dkhel
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Ma-3ndkch compte? <Link to="/inscription" className="text-blue-600 font-bold hover:underline">Tsjel hna</Link>
        </p>
      </div>
    </div>
  );
}