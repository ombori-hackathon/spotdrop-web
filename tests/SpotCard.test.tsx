import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpotCard } from '../src/components/spots/SpotCard';
import type { Spot } from '../src/types';

const mockSpot: Spot = {
  id: 1,
  title: 'Test Cafe',
  description: 'A cozy cafe for testing',
  category: 'cafe',
  rating: 4.5,
  latitude: 59.3293,
  longitude: 18.0686,
  address: 'Stockholm, Sweden',
  best: 'Cappuccino',
  best_time: 'Morning',
  price_level: 2,
  user_id: 1,
  user: {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    avatar_url: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  images: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: null,
};

describe('SpotCard', () => {
  it('renders spot title', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('Test Cafe')).toBeInTheDocument();
  });

  it('renders spot category', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('cafe')).toBeInTheDocument();
  });

  it('renders spot rating', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders spot description', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('A cozy cafe for testing')).toBeInTheDocument();
  });

  it('renders best field', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('Cappuccino')).toBeInTheDocument();
  });

  it('renders best time field', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('renders price level', () => {
    render(<SpotCard spot={mockSpot} onClose={() => {}} />);
    expect(screen.getByText('$$')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<SpotCard spot={mockSpot} onClose={onClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
