/**
 * PageTransition - wraps each route with a CSS animation.
 * The parent in App.jsx passes key={location.pathname}, which
 * causes React to unmount+remount this element on every navigation,
 * naturally restarting the animation from scratch.
 */
export default function PageTransition({ children }) {
  return (
    <div
      style={{
        animation: 'page-enter 0.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
