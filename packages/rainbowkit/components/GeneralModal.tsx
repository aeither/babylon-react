import React, { type ReactNode, useEffect, useRef } from 'react';
import { Modal } from 'react-responsive-modal';
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
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <Modal
      ref={modalRef}
      open={open}
      onClose={() => onClose(false)}
      center
      classNames={{
        overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50',
        modalContainer: 'fixed inset-0 flex items-center justify-center z-50',
        modal: twMerge(
          'relative w-full bg-base-300 shadow-xl rounded-2xl',
          'max-h-[90vh] overflow-y-auto',
          'mx-4 md:mx-auto',
          small ? 'md:max-w-[25rem]' : 'md:max-w-[45rem] lg:max-w-[55rem]',
          'min-w-[20rem] md:min-w-[30rem]',
          className,
        ),
      }}
      showCloseIcon={false}
      closeOnEsc={closeOnEsc}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      {children}
    </Modal>
  );
};
