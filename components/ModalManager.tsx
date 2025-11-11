'use client';

import { useModal } from '@/contexts/ModalContext';
import Modal from './Modal';
import TNRRequestForm from './TNRRequestForm';

export default function ModalManager() {
  const { currentModal, closeModal } = useModal();

  const renderModalContent = () => {
    switch (currentModal) {
      case 'tnr-request':
        return (
          <TNRRequestForm
            onSuccess={() => closeModal()}
            onClose={closeModal}
          />
        );
      case 'adoption':
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Adoption application form coming soon!
            </p>
          </div>
        );
      case 'donation':
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Donation form with Stripe integration coming soon!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (currentModal) {
      case 'tnr-request':
        return 'TNR Request Form';
      case 'adoption':
        return 'Adoption Application';
      case 'donation':
        return 'Make a Donation';
      default:
        return '';
    }
  };

  if (!currentModal) return null;

  return (
    <Modal
      isOpen={!!currentModal}
      onClose={closeModal}
      title={getModalTitle()}
      size="lg"
    >
      {renderModalContent()}
    </Modal>
  );
}

