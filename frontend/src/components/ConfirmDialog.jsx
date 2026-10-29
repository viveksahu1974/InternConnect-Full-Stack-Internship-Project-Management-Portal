export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl2 border border-line bg-surface p-6 shadow-glow">
        <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
        {description && <p className="mt-2 text-sm text-mist">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-mist hover:text-paper transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              danger ? 'bg-red-500/90 hover:bg-red-500 text-white' : 'bg-cyan text-ink hover:bg-cyan-soft'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
