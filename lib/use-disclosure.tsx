import React from "react";

export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const onOpen = React.useCallback(() => setIsOpen(true), []);
  const onClose = React.useCallback(() => setIsOpen(false), []);
  const onToggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onOpen, onClose, onToggle };
};
