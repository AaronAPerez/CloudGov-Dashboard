/**
 * Input Component Tests
 * 
 * Comprehensive test suite for Input component covering:
 * - Basic rendering
 * - Input types
 * - Labels and helper text
 * - Error states
 * - Disabled states
 * - Required fields
 * - Addons (left/right)
 * - Accessibility
 * 
 * Target Coverage: 95%+
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  // Test: Basic rendering
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(
        screen.getByText('Enter your email address')
      ).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  // Test: Input types
  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  // Test: Required field
  describe('Required Field', () => {
    it('should show required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should have aria-required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('should have required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  // Test: Error state
  describe('Error State', () => {
    it('should display error message', () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });

    it('should show error icon', () => {
      const { container } = render(<Input error="Error" />);
      const errorIcon = container.querySelector('svg');
      expect(errorIcon).toBeInTheDocument();
    });

    it('should have aria-invalid attribute', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('should have role="alert" on error message', () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // Test: Disabled state
  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled styling', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-neutral-100');
    });

    it('should not be focusable when disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).not.toHaveFocus();
    });
  });

  // Test: Addons
  describe('Addons', () => {
    it('should render left addon', () => {
      render(<Input leftAddon={<Mail data-testid="mail-icon" />} />);
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });

    it('should render right addon', () => {
      render(<Input rightAddon={<Lock data-testid="lock-icon" />} />);
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });

    it('should adjust padding with left addon', () => {
      render(<Input leftAddon={<Mail />} />);
      expect(screen.getByRole('textbox')).toHaveClass('pl-10');
    });

    it('should adjust padding with right addon', () => {
      render(<Input rightAddon={<Lock />} />);
      expect(screen.getByRole('textbox')).toHaveClass('pr-10');
    });
  });

  // Test: User interactions
  describe('User Interactions', () => {
    it('should accept text input', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus handler', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  // Test: Full width
  describe('Full Width', () => {
    it('should be full width when fullWidth is true', () => {
      const { container } = render(<Input fullWidth />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });
  });

  // Test: Accessibility
  describe('Accessibility', () => {
    it('should link label with input using htmlFor', () => {
      render(<Input label="Email" id="email-input" />);
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should have aria-describedby for helper text', () => {
      render(<Input helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });

    it('should have aria-describedby for error message', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });

    it('should be keyboard accessible', () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');

      // Tab to focus
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  // Test: Ref forwarding
  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = { current: null };
      render(<Input ref={ref as any} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});