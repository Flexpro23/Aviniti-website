import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from '../Modal';

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

describe('Modal', () => {
  it('Modal content is not in the DOM when closed by default', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
          <p>Modal body</p>
        </ModalContent>
      </Modal>
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('opens when the trigger is clicked', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
          <p>Modal body</p>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the title when the modal is open', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
          <p>Modal body</p>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the description when the modal is open', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
          <p>Modal body</p>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders children content when the modal is open', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
          <p>Modal body</p>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('close button is visible when the modal is open', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    // The sr-only span carries the closeLabel text
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('clicking the close button dismisses the modal', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    // Click the close button (button that contains the sr-only "Close" text)
    const closeBtn = screen.getByText('Close').closest('button');
    expect(closeBtn).not.toBeNull();
    fireEvent.click(closeBtn!);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders with mobileSheet=false variant', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Close" mobileSheet={false}>
          <ModalTitle>Sheet False</ModalTitle>
          <ModalDescription>Non-sheet modal</ModalDescription>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Sheet False')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closeLabel is applied to the close button sr-only text', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent closeLabel="Dismiss dialog">
          <ModalTitle>Test Title</ModalTitle>
          <ModalDescription>Test Description</ModalDescription>
        </ModalContent>
      </Modal>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Dismiss dialog')).toBeInTheDocument();
  });

  it('modal can be opened with defaultOpen=true', () => {
    render(
      <Modal defaultOpen>
        <ModalContent closeLabel="Close">
          <ModalTitle>Pre-opened</ModalTitle>
          <ModalDescription>Starts open</ModalDescription>
        </ModalContent>
      </Modal>
    );
    expect(screen.getByText('Pre-opened')).toBeInTheDocument();
  });
});
