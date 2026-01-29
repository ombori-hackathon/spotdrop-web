import { Star } from 'lucide-react';
import { useSpotsStore } from '../../stores/spotsStore';
import { CATEGORIES } from '../../types';

export function SpotFilter() {
  const { filters, setFilters } = useSpotsStore();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setFilters({ category: null })}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          filters.category === null
            ? 'bg-white text-background'
            : 'bg-card text-slate-300 hover:bg-card-hover'
        }`}
      >
        All
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => setFilters({ category: category.value })}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.category === category.value
              ? 'text-white'
              : 'bg-card text-slate-300 hover:bg-card-hover'
          }`}
          style={
            filters.category === category.value
              ? { backgroundColor: category.color }
              : undefined
          }
        >
          {category.label}
        </button>
      ))}

      <div className="w-px bg-slate-600 mx-2" />

      <button
        onClick={() => setFilters({ minRating: filters.minRating === 4 ? null : 4 })}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          filters.minRating === 4
            ? 'bg-yellow-500 text-background'
            : 'bg-card text-slate-300 hover:bg-card-hover'
        }`}
      >
        <Star className="w-3 h-3" />
        4+
      </button>
    </div>
  );
}
