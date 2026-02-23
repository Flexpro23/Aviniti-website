import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Checkbox } from '../Checkbox';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Checkbox', () => {
  it('renders a checkbox element', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label text when label prop is provided', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('does not render a label element when label prop is not provided', () => {
    render(<Checkbox />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('associates label with checkbox via htmlFor and id', () => {
    render(<Checkbox id="my-checkbox" label="Remember me" />);
    const label = screen.getByText('Remember me').closest('label');
    expect(label).toHaveAttribute('for', 'my-checkbox');
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'my-checkbox');
  });

  it('checkbox is initially unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onCheckedChange when checkbox is clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards className to the checkbox root element', () => {
    render(<Checkbox className="custom-class" data-testid="cb" />);
    const checkbox = screen.getByTestId('cb');
    expect(checkbox).toBeInTheDocument();
  });
});
