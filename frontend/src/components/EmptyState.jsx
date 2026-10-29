export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center rounded-xl2 border border-dashed border-line">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-surface2 flex items-center justify-center">
          <Icon className="h-6 w-6 text-mist" />
        </div>
      )}
      <p className="font-display font-semibold text-paper">{title}</p>
      {description && <p className="text-sm text-mist max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
