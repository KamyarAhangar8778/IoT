import { useEffect, useRef, useState } from "react";

interface UseCardHeaderLayoutOptions {
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
}

/**
 * Custom hook for managing the layout and state of segment card header menus and dropdowns.
 * Handles centering relative to parent group and click-outside dismissal.
 */
export function useCardHeaderLayout(options?: UseCardHeaderLayoutOptions) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isSettingsOpen =
    options?.isSettingsOpen !== undefined ? options.isSettingsOpen : internalIsOpen;
  const setIsSettingsOpen = options?.setIsSettingsOpen || setInternalIsOpen;

  const [showAutoOffMenu, setShowAutoOffMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const autoOffButtonRef = useRef<HTMLButtonElement>(null);
  const autoOffMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | PointerEvent) => {
      const target = event.target as Node;
      if (!target) return;

      if (isSettingsOpen) {
        const isClickInsideMenu = menuRef.current?.contains(target);
        const isClickOnButton = buttonRef.current?.contains(target);

        if (!isClickInsideMenu && !isClickOnButton) {
          setIsSettingsOpen(false);
        }
      }

      if (showAutoOffMenu) {
        const isClickInsideAutoOff = autoOffMenuRef.current?.contains(target);
        const isClickOnAutoOffBtn = autoOffButtonRef.current?.contains(target);

        if (!isClickInsideAutoOff && !isClickOnAutoOffBtn) {
          setShowAutoOffMenu(false);
        }
      }
    };

    if (isSettingsOpen || showAutoOffMenu) {
      document.addEventListener("pointerdown", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, true);
    };
  }, [isSettingsOpen, showAutoOffMenu, setIsSettingsOpen]);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    showAutoOffMenu,
    setShowAutoOffMenu,
    buttonRef,
    menuRef,
    autoOffButtonRef,
    autoOffMenuRef,
  };
}
