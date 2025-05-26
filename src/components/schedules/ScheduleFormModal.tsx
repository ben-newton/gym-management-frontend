import Modal from '../common/Modal';
import ScheduleForm from './ScheduleForm';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleFormModal({ isOpen, onClose }: ScheduleFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Schedule"
    >
      <ScheduleForm onSuccess={onClose} />
    </Modal>
  );
} 