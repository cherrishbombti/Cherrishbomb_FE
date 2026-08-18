import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalTransition } from '../../hooks/useModalTransition';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  hasCloseButton?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  hasCloseButton = true,
}) => {
  const [render, setRender] = useState(isOpen);
  const { setClosing, beginClose, handleAnimationEnd, overlayClass, panelClass } =
    useModalTransition(() => setRender(false));

  /**
   * isOpen 변화를 effect가 아니라 렌더 중에 처리한다.
   * effect에서 setState를 호출하면 연쇄 렌더가 발생하므로,
   * 이전 값과 비교해 곧바로 상태를 조정한다.
   * 실제 언마운트는 퇴장 애니메이션 종료 시(onAnimationEnd) 이뤄진다.
   */
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setRender(true);
      setClosing(false);
    } else if (render) {
      beginClose();
    }
  }

  useEffect(() => {
    if (!render) return;
    // 스크롤바가 사라지며 콘텐츠가 튀지 않도록, 사라진 스크롤바 폭만큼 padding으로 보정
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [render]);

  if (!render) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 부모에 transform이 걸리면 fixed 기준이 바뀌므로 body 직속으로 렌더
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${overlayClass}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 flex flex-col gap-4 ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        {(title || hasCloseButton) && (
          <div className="flex items-center justify-between">
            {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}

            {hasCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-auto"
                aria-label="close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default BaseModal;
