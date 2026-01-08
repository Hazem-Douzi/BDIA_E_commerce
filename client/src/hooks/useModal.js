import { useState, useCallback } from 'react';

export const useModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showModal = useCallback(({ title, message, type = 'info', onConfirm = null }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback((message, title = 'Succès', onConfirm = null) => {
    showModal({ title, message, type: 'success', onConfirm });
  }, [showModal]);

  const showError = useCallback((message, title = 'Erreur', onConfirm = null) => {
    showModal({ title, message, type: 'error', onConfirm });
  }, [showModal]);

  const showWarning = useCallback((message, title = 'Attention', onConfirm = null) => {
    showModal({ title, message, type: 'warning', onConfirm });
  }, [showModal]);

  const showInfo = useCallback((message, title = 'Information', onConfirm = null) => {
    showModal({ title, message, type: 'info', onConfirm });
  }, [showModal]);

  return {
    modal,
    showModal,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
