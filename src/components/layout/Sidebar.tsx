import { SpotFilter } from '../spots/SpotFilter';

export function Sidebar() {
  return (
    <aside className="absolute top-20 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <SpotFilter />
    </aside>
  );
}
