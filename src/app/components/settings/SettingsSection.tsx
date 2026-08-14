import { ReactNode } from "react";

interface SettingsSectionProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({
  icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      {/* Section Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 text-blue-400 shrink-0">{icon}</div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
            {description && (
              <p className="text-sm text-slate-400">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div>{children}</div>
    </div>
  );
}
