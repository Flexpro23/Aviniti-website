import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../Accordion';

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

describe('Accordion', () => {
  it('renders AccordionItem with trigger text', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('AccordionContent is not visible initially (Radix hides collapsed content)', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    // Radix sets data-state=closed and hides the content from the accessibility tree
    const content = screen.queryByText('Answer 1');
    // Content may be in the DOM but hidden, or not rendered — either is acceptable
    if (content) {
      expect(content).not.toBeVisible();
    } else {
      expect(content).toBeNull();
    }
  });

  it('clicking AccordionTrigger opens the content', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByText('Question 1'));
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
  });

  it('clicking AccordionTrigger twice closes the content again', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByText('Question 1');
    fireEvent.click(trigger);
    // Open — content should be visible
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    fireEvent.click(trigger);
    // Closed — content is hidden or removed
    const content = screen.queryByText('Answer 1');
    if (content) {
      expect(content).not.toBeVisible();
    } else {
      expect(content).toBeNull();
    }
  });

  it('renders a ChevronDown svg icon inside the trigger', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByRole('button', { name: /Question 1/i });
    const svg = trigger.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders multiple accordion items', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent>Answer 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Question 3</AccordionTrigger>
          <AccordionContent>Answer 3</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
    expect(screen.getByText('Question 3')).toBeInTheDocument();
  });

  it('type="multiple" allows multiple items to be open simultaneously', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent>Answer 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByText('Question 1'));
    fireEvent.click(screen.getByText('Question 2'));
    // Both answers should now be in the DOM and visible
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
  });

  it('renders custom className on AccordionItem', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-item-class">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    // The AccordionItem wrapper div should carry the custom class
    const item = document.querySelector('.custom-item-class');
    expect(item).toBeInTheDocument();
  });
});
