import { Contact } from "@/types";

interface Props {
  contacts: Contact[];
}

export default function ContactCards({ contacts }: Props) {
  if (contacts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Course Contacts</h3>
        <p className="text-xs text-gray-400 mt-0.5">{contacts.length} contact{contacts.length > 1 ? "s" : ""} extracted</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                <p className="text-[11px] text-indigo-500 font-medium">{c.role}</p>
              </div>
            </div>

            {c.email && (
              <a
                href={`mailto:${c.email}`}
                className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {c.email}
              </a>
            )}

            {c.office_hours && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {c.office_hours}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
