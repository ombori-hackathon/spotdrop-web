import { useEffect, useState } from 'react';
import { AuthModal } from './components/auth/AuthModal';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Map } from './components/map/Map';
import { SpotCard } from './components/spots/SpotCard';
import { useAuthStore } from './stores/authStore';
import { useSpotsStore } from './stores/spotsStore';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { checkAuth } = useAuthStore();
  const { selectedSpot, selectSpot, fetchSpots } = useSpotsStore();

  useEffect(() => {
    checkAuth();
    fetchSpots();
  }, [checkAuth, fetchSpots]);

  return (
    <div className="relative w-full h-full">
      <Map />
      <Header onLoginClick={() => setShowAuthModal(true)} />
      <Sidebar />

      {selectedSpot && (
        <div className="absolute bottom-4 left-4 z-10">
          <SpotCard spot={selectedSpot} onClose={() => selectSpot(null)} />
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;
