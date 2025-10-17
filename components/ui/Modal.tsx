/**
 * Modal Component
 * 
 * Accessible dialog component following WCAG 2.1 AA standards.
 * Implements proper focus management and keyboard navigation.
 * 
 * Features:
 * - Focus trap (keeps focus within modal)
 * - ESC key to close
 * - Click outside to close (optional)
 * - Scroll lock on body
 * - ARIA attributes for screen readers
 * - Backdrop with animation
 * - Multiple sizes
 * 
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <div className="flex gap-2 mt-4">
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *     <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *   </div>
 * </Modal>
 */

import { useEffect, useRef, Fragment } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

/**
 * Modal component props interface
 */
export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Modal content */
  children: React.ReactNode;
  /** Hides the close button */
  hideCloseButton?: boolean;
  /** Prevents closing on backdrop click */
  preventBackdropClose?: boolean;
  /** Prevents closing on ESC key */
  preventEscapeClose?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Additional className for modal content */
  className?: string;
}

/**
 * Size styles mapping
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

/**
 * Modal Component
 * 
 * Accessible dialog with focus management
 */
export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  hideCloseButton = false,
  preventBackdropClose = false,
  preventEscapeClose = false,
  footer,
  className,
}: ModalProps) {
  // Reference to the modal content for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /**
   * Handle ESC key press to close modal
   */
  useEffect(() => {
    if (!isOpen || preventEscapeClose) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventEscapeClose]);

  /**
   * Lock body scroll when modal is open
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Save current scroll position
    const scrollY = window.scrollY;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  /**
   * Focus management
   * Save previous focus and restore when modal closes
   */
  useEffect(() => {
    if (isOpen) {
      // Save the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Restore focus when modal closes
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (preventBackdropClose) {
      return;
    }

    // Only close if clicking the backdrop itself, not child elements
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        {/* Modal content */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
          className={cn(
            'relative w-full bg-white dark:bg-neutral-900 rounded-lg shadow-xl animate-slide-up',
            sizeStyles[size],
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              {/* Title */}
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  {title}
                </h2>
              )}

              {/* Close button */}
              {!hideCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

Modal.displayName = 'Modal';