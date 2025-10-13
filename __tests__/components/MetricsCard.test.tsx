import { render, screen } from '@testing-library/react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { DollarSign } from 'lucide-react';

describe('MetricsCard', () => {
  it('should render metric value', () => {
    render(
      }
      />
    );

    expect(screen.getByText('Monthly Cost')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();
  });

  it('should show trend indicator', () => {
    render(
      
    );

    expect(screen.getByText('8.5%')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(
      
    );

    const card = screen.getByText('Loading').closest('div');
    expect(card).toHaveClass('animate-pulse-slow');
  });
});