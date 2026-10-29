const STAGES = [
  { n: '01', title: 'Web Foundations', desc: 'Semantic HTML, accessibility, forms, links, media and page structure.' },
  { n: '02', title: 'Interface Design', desc: 'CSS layouts, responsive design, typography, spacing and reusable components.' },
  { n: '03', title: 'Interactivity', desc: 'JavaScript events, DOM manipulation, validation, arrays and application logic.' },
  { n: '04', title: 'Quality & Delivery', desc: 'Testing, performance, Git workflow, deployment and documentation.' },
];

export default function Program() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">The internship roadmap</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Every accepted internship on InternConnect runs through the same four-module roadmap. Mentors track your
        progress against these milestones, module by module.
      </p>

      <div className="mt-12 space-y-6">
        {STAGES.map((s, i) => (
          <div key={s.n} className="relative flex gap-6 pl-2">
            {i < STAGES.length - 1 && (
              <div className="absolute left-[27px] top-14 h-[calc(100%-1rem)] w-px bg-line" />
            )}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl2 border border-cyan/30 bg-cyan/10 font-display text-lg font-semibold text-cyan">
              {s.n}
            </div>
            <div className="rounded-xl2 border border-line bg-surface p-5 flex-1">
              <h3 className="font-display font-semibold text-paper">{s.title}</h3>
              <p className="mt-1.5 text-sm text-mist">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
