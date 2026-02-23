import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../Select';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_: unknown, tag: string) =>
      React.forwardRef(
        (
          {
            children,
            whileHover: _wh,
            whileTap: _wt,
            initial: _i,
            variants: _v,
            animate: _a,
            exit: _e,
            transition: _tr,
            layoutId: _lid,
            ...props
          }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) => React.createElement(tag, { ...props, ref }, children)
      ),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useReducedMotion: () => null,
}));

vi.mock('@/lib/motion/variants', () => ({
  modalVariants: {},
  backdropVariants: {},
  bottomSheetVariants: {},
  cardHover: {},
}));

vi.mock('@/lib/motion/tokens', () => ({
  duration: { fast: 0.15, normal: 0.3 },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Select', () => {
  it('renders the SelectTrigger as a combobox', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders a label element when the label prop is provided on SelectTrigger', () => {
    render(
      <Select>
        <SelectTrigger label="Choose option">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders an error message when the error prop is provided', () => {
    render(
      <Select>
        <SelectTrigger error="This field is required">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('sets aria-invalid="true" on the trigger when error prop is provided', () => {
    render(
      <Select>
        <SelectTrigger error="Required">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error prop is provided', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  it('renders SelectItem text in the dropdown after opening the trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders SelectValue placeholder text when no value is selected', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick something..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Pick something...')).toBeInTheDocument();
  });

  it('disabled prop prevents interaction with the trigger', () => {
    render(
      <Select>
        <SelectTrigger disabled>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('SelectLabel renders group label text', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Fruits')).toBeInTheDocument();
  });
});
