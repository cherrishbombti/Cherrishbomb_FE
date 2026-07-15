import React, { useEffect, useState } from 'react';

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
  const [closing, setClosing] = useState(false);

  // 열림/닫힘 전환. 실제 언마운트는 퇴장 애니메이션이 끝날 때(onAnimationEnd) 처리.
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setClosing(false);
    } else if (render) {
      setClosing(true);
    }
  }, [isOpen, render]);

  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || 'unset';
    };
  }, [render]);

  if (!render) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${closing ? 'modal-overlay-out' : 'modal-overlay-in'}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 flex flex-col gap-4 ${closing ? 'modal-panel-out' : 'modal-panel-in'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={(e) => {
          // 패널 자신의 퇴장 애니메이션이 끝났을 때만 언마운트 (자식 애니메이션 무시)
          if (closing && e.target === e.currentTarget) setRender(false);
        }}
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
    </div>
  );
};

export default BaseModal;
