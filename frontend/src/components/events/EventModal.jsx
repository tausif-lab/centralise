import React from 'react';
import Modal from '../common/Modal';
import EventForm from './EventForm';

const EventModal = ({ isOpen, onClose, onSubmit, selectedDate }) => {
  const handleSubmit = (formData) => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Event"
      size="xl"
    >
      <EventForm onSubmit={handleSubmit} selectedDate={selectedDate} />
    </Modal>
  );
};

export default EventModal;