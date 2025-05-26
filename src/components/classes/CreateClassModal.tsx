import { useState } from 'react';
import Modal from '../common/Modal';
import CreateClassForm from './CreateClassForm';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Class"
    >
      <CreateClassForm onSuccess={onClose} />
    </Modal>
  );
} 