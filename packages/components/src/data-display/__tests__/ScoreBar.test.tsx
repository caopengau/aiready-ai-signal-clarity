import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBar, ScoreCard } from '../ScoreBar';

// Mock the @aiready/core/client module
vi.mock('@aiready/core/client', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    getRating: vi.fn((score: number) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      if (score >= 20) return 'Needs Work';
      return 'Critical';
    }),
  };
});

describe('ScoreBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      render(<ScoreBar score={75} label="Test Score" />);

      expect(screen.getByText('Test Score')).toBeInTheDocument();
      expect(screen.getByText('75/100')).toBeInTheDocument();
    });

    it('should render without score when showScore is false', () => {
      render(<ScoreBar score={75} label="Test Score" showScore={false} />);

      expect(screen.getByText('Test Score')).toBeInTheDocument();
      expect(screen.queryByText('75/100')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ScoreBar score={75} label="Test Score" className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render with different sizes', () => {
      const { container, rerender } = render(
        <ScoreBar score={75} label="Test Score" size="sm" />
      );

      // Small size should have h-1.5 for the bar
      expect(container.querySelector('.bg-slate-200')).toHaveClass('h-1.5');

      rerender(<ScoreBar score={75} label="Test Score" size="lg" />);
      expect(container.querySelector('.bg-slate-200')).toHaveClass('h-3');
    });
  });

  describe('score prop', () => {
    it('should handle score of 0', () => {
      const { container } = render(<ScoreBar score={0} label="Zero Score" />);

      expect(screen.getByText('0/100')).toBeInTheDocument();
      // Should show critical rating (red)
      expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    });

    it('should handle perfect score of 100', () => {
      const { container } = render(
        <ScoreBar score={100} label="Perfect Score" />
      );

      expect(screen.getByText('100/100')).toBeInTheDocument();
      // Should show excellent rating (green)
      expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    });

    it('should handle custom maxScore', () => {
      const { container } = render(
        <ScoreBar score={150} maxScore={200} label="Custom Max" />
      );

      expect(screen.getByText('150/200')).toBeInTheDocument();
      // 150/200 = 75% which should be good (emerald)
      expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('should clamp bar width to 0-100% range', () => {
      const { container, rerender } = render(
        <ScoreBar score={-10} label="Negative Score" />
      );

      // The bar width should be clamped to 0%
      const barElement = container.querySelector('[style*="width"]');
      expect(barElement).toHaveStyle('width: 0%');

      rerender(<ScoreBar score={150} label="Over Max" />);
      // The bar width should be clamped to 100%
      expect(barElement).toHaveStyle('width: 100%');
    });
  });

  describe('label display', () => {
    it('should render the provided label', () => {
      render(<ScoreBar score={75} label="Custom Label" />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should display label in correct size based on size prop', () => {
      const { rerender } = render(
        <ScoreBar score={75} label="Test" size="sm" />
      );

      expect(screen.getByText('Test')).toHaveClass('text-xs');

      rerender(<ScoreBar score={75} label="Test" size="lg" />);
      expect(screen.getByText('Test')).toHaveClass('text-base');
    });
  });

  describe('color based on score', () => {
    it('should show green color for excellent scores (>=80)', () => {
      const { container } = render(<ScoreBar score={85} label="Excellent" />);

      // Check for green-500 background class
      expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    });

    it('should show emerald color for good scores (>=60)', () => {
      const { container } = render(<ScoreBar score={70} label="Good" />);

      // Check for emerald-500 background class
      expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('should show amber color for fair scores (>=40)', () => {
      const { container } = render(<ScoreBar score={50} label="Fair" />);

      // Check for amber-500 background class
      expect(container.querySelector('.bg-amber-500')).toBeInTheDocument();
    });

    it('should show orange color for needs-work scores (>=20)', () => {
      const { container } = render(<ScoreBar score={30} label="Needs Work" />);

      // Check for orange-500 background class
      expect(container.querySelector('.bg-orange-500')).toBeInTheDocument();
    });

    it('should show red color for critical scores (<20)', () => {
      const { container } = render(<ScoreBar score={10} label="Critical" />);

      // Check for red-500 background class
      expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA structure', () => {
      render(<ScoreBar score={75} label="Accessibility Test" />);

      // The component should have proper div structure for screen readers
      // The label and score should be visible to screen readers
      expect(screen.getByText('Accessibility Test')).toBeInTheDocument();
      expect(screen.getByText('75/100')).toBeInTheDocument();
    });
  });
});

describe('ScoreCard', () => {
  it('should render with score and rating', () => {
    render(<ScoreCard score={85} title="Test Card" />);

    expect(screen.getByText('85/100')).toBeInTheDocument();
    expect(screen.getByText('Excellent Rating')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should render breakdown when provided', () => {
    const breakdown = [
      { label: 'Security', score: 90 },
      { label: 'Performance', score: 80 },
    ];

    render(<ScoreCard score={85} breakdown={breakdown} />);

    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('90/100')).toBeInTheDocument();
    expect(screen.getByText('80/100')).toBeInTheDocument();
  });

  it('should calculate and display formula when breakdown has weights', () => {
    const breakdown = [
      { label: 'Security', score: 90, weight: 2 },
      { label: 'Performance', score: 80, weight: 1 },
    ];

    render(<ScoreCard score={87} breakdown={breakdown} />);

    // Formula: 90×2 + 80×1 / 100 = 87
    expect(screen.getByText('90×2 + 80×1 / 100 = 87')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ScoreCard score={75} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
