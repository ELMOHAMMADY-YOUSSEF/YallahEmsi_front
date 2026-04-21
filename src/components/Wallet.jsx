import { useState, useEffect } from "react";
import axios from "axios";

export default function Wallet() {
  const [solde, setSolde] = useState(0);
  const [montant, setMontant] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const utilisateurId = currentUser ? currentUser.id : null;


  // Mli kat-t7el l'page, kan-jibou l'solde dyal Sara
  const fetchSolde = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/wallets/solde/${utilisateurId}`);
      setSolde(response.data);
    } catch (error) {
      console.error("Mochkil bach n-jibou l'solde", error);
    }
  };

  useEffect(() => {
    fetchSolde();
  }, []);

  // Mli kat-cliqui 3la "Recharger"
  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!montant || montant <= 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8081/api/wallets/recharger?utilisateurId=${utilisateurId}&montant=${montant}`);
      setMessage(response.data);
      setMontant(""); // Kan-khwiw l'input
      fetchSolde();   // Kan-jibou l'solde jdid bach y-tbdl f l'carte
    } catch (error) {
      setMessage("Erreur f l'itissal m3a l'serveur.");
    }
    setLoading(false);
  };
  if (!currentUser) return <p className="text-center mt-20 text-red-500 text-xl font-bold">Khassk t-connecta b3da!</p>;

  return (
    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-800">Mon Wallet 💳</h2>
          <p className="text-gray-500 mt-2">Cherji l'flouss bach t-reservi blaysek</p>
        </div>

        {/* La Carte Bancaire (Design Wa3er) */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-white shadow-2xl mb-8 relative overflow-hidden transform hover:scale-105 transition duration-300">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
          
          <p className="text-green-200 font-medium tracking-wider mb-1">SOLDE ACTUEL</p>
          <h1 className="text-5xl font-black mb-6">{solde.toFixed(2)} <span className="text-2xl font-bold text-green-300">MAD</span></h1>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-green-200 uppercase tracking-widest">Utilisateur</p>
              <p className="font-bold tracking-widest">{currentUser.nom} {currentUser.prenom}(Passagère)</p>
            </div>
            <div className="text-4xl opacity-80">🚙</div>
          </div>
        </div>

        {/* Formulaire dyal Recharge */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recharger l'Wallet</h3>
          
          {message && (
            <div className="p-3 mb-4 text-sm font-bold bg-green-100 text-green-700 rounded-lg text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleRecharge} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (MAD)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="Ex: 50" 
                  min="1"
                  required 
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 text-lg font-bold text-gray-800" 
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-bold">MAD</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3 rounded-xl transition shadow-lg ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1'}`}
            >
              {loading ? 'Kan-cherjiw...' : 'Recharger daba'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}