import { MapPin, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-white">SpotDrop</span>
        </div>

        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4" />
                <span>{user?.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={onLoginClick}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
