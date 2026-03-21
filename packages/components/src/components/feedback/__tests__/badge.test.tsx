// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Badge } from '../../badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders with default variant', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <Badge variant="default" data-testid="badge">
          Default
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-primary');
    });

    it('renders secondary variant', () => {
      render(
        <Badge variant="secondary" data-testid="badge">
          Secondary
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-secondary');
    });

    it('renders destructive variant', () => {
      render(
        <Badge variant="destructive" data-testid="badge">
          Destructive
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-destructive');
    });

    it('renders outline variant', () => {
      render(
        <Badge variant="outline" data-testid="badge">
          Outline
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('text-foreground');
    });
  });

  describe('Children', () => {
    it('renders text children', () => {
      render(<Badge>Badge Text</Badge>);
      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Badge>
          <span>Icon</span>
          <span>Label</span>
        </Badge>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className with variant classes', () => {
      render(
        <Badge className="custom-class" data-testid="badge">
          Badge
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('custom-class');
    });
  });
});
