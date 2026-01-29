import { Coffee, Clock, DollarSign, Star, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { getCategoryColor, type Spot } from '../../types';

interface SpotCardProps {
  spot: Spot;
  onClose: () => void;
}

export function SpotCard({ spot, onClose }: SpotCardProps) {
  const primaryImage = spot.images.find((img) => img.is_primary) || spot.images[0];
  const categoryColor = getCategoryColor(spot.category);

  return (
    <Card className="w-80 shadow-2xl">
      <div className="relative">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={spot.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div
            className="w-full h-48 flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {spot.title[0]}
          </div>
        )}

        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {spot.category}
        </span>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{spot.title}</h3>
          {spot.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{spot.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {spot.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{spot.description}</p>
        )}

        <div className="space-y-2">
          {spot.best && (
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Best:</span>
              <span className="text-white">{spot.best}</span>
            </div>
          )}

          {spot.best_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Best time:</span>
              <span className="text-white">{spot.best_time}</span>
            </div>
          )}

          {spot.price_level && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Price:</span>
              <span className="text-white">{'$'.repeat(spot.price_level)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
