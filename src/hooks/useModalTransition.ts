import { useState } from 'react';
import type { AnimationEvent } from 'react';

/**
 * 모달 등장/퇴장 애니메이션 공통 로직.
 * 퇴장 애니메이션이 실제로 끝났을 때(onAnimationEnd) onExited를 호출한다.
 *
 * @param onExited 퇴장 애니메이션 종료 후 실행 (실제 닫기/언마운트)
 */
export function useModalTransition(onExited: () => void) {
  const [closing, setClosing] = useState(false);

  // 닫기 시작 — 퇴장 애니메이션 재생
  const beginClose = () => setClosing(true);

  // 패널 자신의 퇴장 애니메이션이 끝났을 때만 실제 종료 (자식 애니메이션은 무시)
  const handleAnimationEnd = (e: AnimationEvent) => {
    if (closing && e.target === e.currentTarget) {
      setClosing(false);
      onExited();
    }
  };

  return {
    closing,
    setClosing,
    beginClose,
    handleAnimationEnd,
    overlayClass: closing ? 'modal-overlay-out' : 'modal-overlay-in',
    panelClass: closing ? 'modal-panel-out' : 'modal-panel-in',
  };
}
