import { type ReactNode, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface GeneralModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  small?: boolean;
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const GeneralModal = ({
  open,
  onClose,
  children,
  small,
  className = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: GeneralModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose(false);
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => closeOnOverlayClick && onClose(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          ref={modalRef}
          className={twMerge(
            'relative bg-base-300 shadow-xl rounded-2xl',
            'max-h-[90vh] overflow-y-auto',
            'mx-4 md:mx-auto',
            small ? 'md:max-w-[25rem]' : 'md:max-w-[45rem] lg:max-w-[55rem]',
            'min-w-[20rem] md:min-w-[30rem]',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};