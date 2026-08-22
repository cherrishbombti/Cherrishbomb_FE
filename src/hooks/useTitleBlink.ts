import { useEffect } from 'react';

const BLINK_INTERVAL_MS = 1000;

/**
 * 탭 제목을 원래 제목과 message 사이로 번갈아 바꿔 깜빡이게 한다.
 * 다른 탭·다른 프로그램을 보고 있어도 알림을 놓치지 않게 하는 용도.
 *
 * message가 null이면 아무것도 하지 않고, 탭으로 돌아오면(visible) 자동으로 멈춘다.
 * (화면에 이미 알림이 보이는 상태라 제목까지 깜빡일 이유가 없다)
 */
export function useTitleBlink(message: string | null) {
  useEffect(() => {
    if (!message) return;

    const baseTitle = document.title;
    let showingMessage = false;
    const intervalId = window.setInterval(() => {
      showingMessage = !showingMessage;
      document.title = showingMessage ? message : baseTitle;
    }, BLINK_INTERVAL_MS);

    const restore = () => {
      window.clearInterval(intervalId);
      document.title = baseTitle;
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') restore();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      restore();
    };
  }, [message]);
}
