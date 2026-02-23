import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SectionHeading } from '../SectionHeading';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SectionHeading', () => {
  it('renders an h2 with the title text', () => {
    render(<SectionHeading title="Our Services" />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Our Services' });
    expect(heading).toBeInTheDocument();
  });

  it('renders label text when label prop is provided', () => {
    render(<SectionHeading title="Title" label="WHAT WE DO" />);
    expect(screen.getByText('WHAT WE DO')).toBeInTheDocument();
  });

  it('does not render the label element when no label prop is provided', () => {
    render(<SectionHeading title="Title" />);
    expect(screen.queryByText('WHAT WE DO')).not.toBeInTheDocument();
  });

  it('renders subtitle paragraph when subtitle prop is provided', () => {
    render(<SectionHeading title="Title" subtitle="We build amazing things." />);
    expect(screen.getByText('We build amazing things.')).toBeInTheDocument();
  });

  it('does not render subtitle when no subtitle prop is provided', () => {
    render(<SectionHeading title="Title" />);
    expect(screen.queryByText('We build amazing things.')).not.toBeInTheDocument();
  });

  it('applies center alignment by default (text-center class on wrapper)', () => {
    const { container } = render(<SectionHeading title="Centered" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('text-center');
  });

  it('applies start alignment when align="start"', () => {
    const { container } = render(<SectionHeading title="Left" align="start" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('text-start');
    expect(wrapper.className).not.toContain('text-center');
  });

  it('renders id attribute on h2 when id prop is provided', () => {
    render(<SectionHeading title="Accessible Section" id="section-heading" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'section-heading');
  });
});
