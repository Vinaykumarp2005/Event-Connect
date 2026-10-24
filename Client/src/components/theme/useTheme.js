import { useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const systemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

// Persisted under the same 'recoil-persist' key as userAtom; index.html reads it to avoid a flash
export const themeAtom = atom({
  key: 'themeAtom',
  default: systemTheme(),
  effects_UNSTABLE: [persistAtom],
});

export const applyThemeClass = (theme) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
};

export function useTheme() {
  const [theme, setTheme] = useRecoilState(themeAtom);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Circular reveal from the click point (View Transitions API), instant switch as fallback
  const toggleTheme = useCallback(
    (event) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        flushSync(() => setTheme(next));
        applyThemeClass(next);
      };

      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduceMotion || !event) {
        apply();
        return;
      }

      const x = event.clientX ?? window.innerWidth / 2;
      const y = event.clientY ?? 0;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const transition = document.startViewTransition(apply);
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
          );
        })
        .catch(() => {});
    },
    [theme, setTheme]
  );

  return { theme, toggleTheme };
}
