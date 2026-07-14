import type { Profile } from "@/lib/api";

type Props = {
  profile: Profile | null;
};

export default function AboutSection({ profile }: Props) {
  if (!profile) return null;

  return (
    <section id="about" className="py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Avatar / Left */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl shadow-violet-500/20">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                About Me
              </h2>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm">
                {profile.title}
              </p>
            </div>
          </div>

          {/* Bio / Right */}
          <div className="lg:col-span-3">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {profile.bio.split("\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                // Simple markdown-like rendering
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-zinc-900 dark:text-zinc-100">
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }
                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                  return (
                    <p key={i} className="font-semibold text-zinc-900 dark:text-zinc-100 mt-4">
                      {trimmed.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3">
                Skills & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            {profile.email && (
              <div className="mt-8">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Get in touch
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
