import { Coffee, Clock, DollarSign, Star, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { getCategoryColor, type Spot } from '../../types';

const STAR_COLOR = '#F59E0B';
const ICON_COLORS = {
  best: 'hsl(38 92% 50%)',      // amber
  time: 'hsl(239 84% 67%)',     // indigo
  price: 'hsl(142 71% 45%)',    // green
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    const filled = i < fullStars;
    stars.push(
      <Star
        key={i}
        className="w-4 h-4"
        style={{ color: STAR_COLOR, fill: filled ? STAR_COLOR : 'transparent' }}
      />
    );
  }

  return <div className="flex gap-0.5">{stars}</div>;
}

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="font-medium tracking-wide">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={i <= level ? 'text-white' : 'text-slate-600'}
        >
          $
        </span>
      ))}
    </span>
  );
}

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
          className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase text-white"
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
          {spot.rating && <StarRating rating={spot.rating} />}
        </div>

        {spot.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{spot.description}</p>
        )}

        {(spot.best || spot.best_time || spot.price_level) && (
          <div className="border-t border-slate-700 pt-4 space-y-2">
            {spot.best && (
              <div className="flex items-center gap-2 text-sm">
                <Coffee className="w-4 h-4" style={{ color: ICON_COLORS.best }} />
                <span className="text-slate-400">Best:</span>
                <span className="text-white">{spot.best}</span>
              </div>
            )}

            {spot.best_time && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" style={{ color: ICON_COLORS.time }} />
                <span className="text-slate-400">Best time:</span>
                <span className="text-white">{spot.best_time}</span>
              </div>
            )}

            {spot.price_level && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4" style={{ color: ICON_COLORS.price }} />
                <span className="text-slate-400">Price:</span>
                <PriceLevel level={spot.price_level} />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
