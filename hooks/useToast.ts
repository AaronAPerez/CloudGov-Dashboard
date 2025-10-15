/**
 * useToast Hook
 */

export function useToast() {
  const showToast = ({ type, message }: { type: string; message: string }) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Integrate with your toast notification system
  };

  return { showToast };
}
