import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListUnderline,
  TabsTriggerUnderline,
} from '../Tabs';

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
// Helper: Radix Tabs requires mousedown before click to update state
// ---------------------------------------------------------------------------
function clickTab(tab: HTMLElement) {
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Tabs', () => {
  it('renders TabsList and TabsTrigger elements', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('default tab content is visible on initial render', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');
  });

  it('clicking a tab shows its content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    clickTab(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active');
  });

  it('clicking a tab hides the previous tab content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    clickTab(screen.getByRole('tab', { name: 'Tab 2' }));
    // Radix sets hidden="" on the inactive panel — it is in the DOM but not visible
    const tab1Controls = screen.getByRole('tab', { name: 'Tab 1' }).getAttribute('aria-controls');
    const inactivePanel = document.getElementById(tab1Controls!);
    expect(inactivePanel).not.toBeNull();
    expect(inactivePanel!.hidden).toBe(true);
  });

  it('TabsTrigger is disabled when the disabled prop is set', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled();
  });

  it('renders TabsListUnderline variant', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsListUnderline>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsListUnderline>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('renders TabsTriggerUnderline and clicking it shows its content', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsListUnderline>
          <TabsTriggerUnderline value="tab1" layoutId="test-tab">
            Tab 1
          </TabsTriggerUnderline>
          <TabsTriggerUnderline value="tab2" layoutId="test-tab">
            Tab 2
          </TabsTriggerUnderline>
        </TabsListUnderline>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    // Wrap in act to flush the MutationObserver-driven useState update inside TabsTriggerUnderline
    await act(async () => {
      clickTab(screen.getByRole('tab', { name: /Tab 2/i }));
    });
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Tab 2/i })).toHaveAttribute('data-state', 'active');
  });

  it('TabsContent panels are rendered in the DOM for all tab values', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
    // Radix renders all panels in the DOM; navigate to each and confirm content
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    clickTab(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    clickTab(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('active tab has aria-selected="true"', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
  });

  it('switching tabs updates aria-selected correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    clickTab(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
  });
});
