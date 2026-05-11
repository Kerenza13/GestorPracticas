export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className='mr-2 text-base'>{isDark ? '☀️' : '🌙'}</span>
      {isDark ? 'Claro' : 'Oscuro'}
    </button>
  )
}
