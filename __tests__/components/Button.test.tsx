// /**
//  * Button Component Tests
//  * 
//  * Comprehensive test suite for Button component covering:
//  * - Rendering with different variants and sizes
//  * - Click handlers
//  * - Loading states
//  * - Disabled states
//  * - Accessibility attributes
//  * - Icon rendering
//  * 
//  * Target Coverage: 95%+
//  */

// import { render, screen, fireEvent } from '@testing-library/react';
// import { Plus, Trash } from 'lucide-react';
// import { Button } from '@/components/ui/Button';

// describe('Button Component', () => {
//   // Test: Basic rendering
//   describe('Rendering', () => {
//     it('should render with children text', () => {
//       render(<Button>Click Me</Button>);
//       expect(screen.getByText('Click Me')).toBeInTheDocument();
//     });

//     it('should render with custom className', () => {
//       render(<Button className="custom-class">Button</Button>);
//       const button = screen.getByText('Button');
//       expect(button).toHaveClass('custom-class');
//     });

//     it('should have type="button" by default', () => {
//       render(<Button>Button</Button>);
//       expect(screen.getByText('Button')).toHaveAttribute('type', 'button');
//     });

//     it('should accept custom type prop', () => {
//       render(<Button type="submit">Submit</Button>);
//       expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
//     });
//   });

//   // Test: Variants
//   describe('Variants', () => {
//     it('should render primary variant by default', () => {
//       render(<Button>Primary</Button>);
//       const button = screen.getByText('Primary');
//       expect(button).toHaveClass('bg-primary-600');
//     });

//     it('should render secondary variant', () => {
//       render(<Button variant="secondary">Secondary</Button>);
//       const button = screen.getByText('Secondary');
//       expect(button).toHaveClass('bg-neutral-200');
//     });

//     it('should render ghost variant', () => {
//       render(<Button variant="ghost">Ghost</Button>);
//       const button = screen.getByText('Ghost');
//       expect(button).toHaveClass('bg-transparent');
//     });

//     it('should render danger variant', () => {
//       render(<Button variant="danger">Danger</Button>);
//       const button = screen.getByText('Danger');
//       expect(button).toHaveClass('bg-error-600');
//     });
//   });

//   // Test: Sizes
//   describe('Sizes', () => {
//     it('should render medium size by default', () => {
//       render(<Button>Medium</Button>);
//       const button = screen.getByText('Medium');
//       expect(button).toHaveClass('px-4', 'py-2');
//     });

//     it('should render small size', () => {
//       render(<Button size="sm">Small</Button>);
//       const button = screen.getByText('Small');
//       expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
//     });

//     it('should render large size', () => {
//       render(<Button size="lg">Large</Button>);
//       const button = screen.getByText('Large');
//       expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
//     });
//   });

//   // Test: Click handlers
//   describe('Click Handlers', () => {
//     it('should call onClick when clicked', () => {
//       const handleClick = jest.fn();
//       render(<Button onClick={handleClick}>Click Me</Button>);

//       fireEvent.click(screen.getByText('Click Me'));
//       expect(handleClick).toHaveBeenCalledTimes(1);
//     });

//     it('should not call onClick when disabled', () => {
//       const handleClick = jest.fn();
//       render(
//         <Button onClick={handleClick} disabled>
//           Disabled
//         </Button>
//       );

//       fireEvent.click(screen.getByText('Disabled'));
//       expect(handleClick).not.toHaveBeenCalled();
//     });

//     it('should not call onClick when loading', () => {
//       const handleClick = jest.fn();
//       render(
//         <Button onClick={handleClick} isLoading>
//           Loading
//         </Button>
//       );

//       fireEvent.click(screen.getByText('Loading'));
//       expect(handleClick).not.toHaveBeenCalled();
//     });
//   });

//   // Test: Loading state
//   describe('Loading State', () => {
//     it('should show loading spinner when isLoading is true', () => {
//       render(<Button isLoading>Loading</Button>);
//       expect(screen.getByTestId('button-loading-spinner')).toBeInTheDocument();
//     });

//     it('should be disabled when loading', () => {
//       render(<Button isLoading>Loading</Button>);
//       expect(screen.getByText('Loading')).toBeDisabled();
//     });

//     it('should have aria-busy="true" when loading', () => {
//       render(<Button isLoading>Loading</Button>);
//       expect(screen.getByText('Loading')).toHaveAttribute('aria-busy', 'true');
//     });

//     it('should not show left icon when loading', () => {
//       render(
//         <Button isLoading leftIcon={<Plus data-testid="plus-icon" />}>
//           Loading
//         </Button>
//       );
//       expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
//     });
//   });

//   // Test: Disabled state
//   describe('Disabled State', () => {
//     it('should be disabled when disabled prop is true', () => {
//       render(<Button disabled>Disabled</Button>);
//       expect(screen.getByText('Disabled')).toBeDisabled();
//     });

//     it('should have aria-disabled="true" when disabled', () => {
//       render(<Button disabled>Disabled</Button>);
//       expect(screen.getByText('Disabled')).toHaveAttribute(
//         'aria-disabled',
//         'true'
//       );
//     });

//     it('should have reduced opacity when disabled', () => {
//       render(<Button disabled>Disabled</Button>);
//       expect(screen.getByText('Disabled')).toHaveClass('disabled:opacity-60');
//     });
//   });

//   // Test: Icons
//   describe('Icons', () => {
//     it('should render left icon', () => {
//       render(
//         <Button leftIcon={<Plus data-testid="left-icon" />}>
//           With Icon
//         </Button>
//       );
//       expect(screen.getByTestId('left-icon')).toBeInTheDocument();
//     });

//     it('should render right icon', () => {
//       render(
//         <Button rightIcon={<Trash data-testid="right-icon" />}>
//           With Icon
//         </Button>
//       );
//       expect(screen.getByTestId('right-icon')).toBeInTheDocument();
//     });

//     it('should render both left and right icons', () => {
//       render(
//         <Button
//           leftIcon={<Plus data-testid="left-icon" />}
//           rightIcon={<Trash data-testid="right-icon" />}
//         >
//           Both Icons
//         </Button>
//       );
//       expect(screen.getByTestId('left-icon')).toBeInTheDocument();
//       expect(screen.getByTestId('right-icon')).toBeInTheDocument();
//     });

//     it('should have aria-hidden on icons', () => {
//       const { container } = render(
//         <Button leftIcon={<Plus />}>With Icon</Button>
//       );
//       const iconWrapper = container.querySelector('span[aria-hidden="true"]');
//       expect(iconWrapper).toBeInTheDocument();
//     });
//   });

//   // Test: Full width
//   describe('Full Width', () => {
//     it('should be full width when fullWidth is true', () => {
//       render(<Button fullWidth>Full Width</Button>);
//       expect(screen.getByText('Full Width')).toHaveClass('w-full');
//     });

//     it('should not be full width by default', () => {
//       render(<Button>Normal</Button>);
//       expect(screen.getByText('Normal')).not.toHaveClass('w-full');
//     });
//   });

//   // Test: Accessibility
//   describe('Accessibility', () => {
//     it('should be keyboard accessible', () => {
//       const handleClick = jest.fn();
//       render(<Button onClick={handleClick}>Accessible</Button>);

//       const button = screen.getByText('Accessible');
//       button.focus();
//       expect(button).toHaveFocus();

//       fireEvent.keyDown(button, { key: 'Enter' });
//       expect(handleClick).toHaveBeenCalled();
//     });

//     it('should have focus ring styles', () => {
//       render(<Button>Focus Me</Button>);
//       expect(screen.getByText('Focus Me')).toHaveClass('focus:ring-2');
//     });

//     it('should maintain focus outline', () => {
//       render(<Button>Focus Outline</Button>);
//       expect(screen.getByText('Focus Outline')).toHaveClass(
//         'focus:outline-none'
//       );
//     });
//   });

//   // Test: Ref forwarding
//   describe('Ref Forwarding', () => {
//     it('should forward ref to button element', () => {
//       const ref = { current: null };
//       render(<Button ref={ref as any}>Button</Button>);
//       expect(ref.current).toBeInstanceOf(HTMLButtonElement);
//     });
//   });
// });