"use client";

import { useClass } from "@/lib/api/hooks";

interface ClassFeaturesSectionProps {
  classIndex: string;
  level: number;
  subclassIndex?: string;
  register: any;
  watch: any;
  errors: any;
}

export default function ClassFeaturesSection({
  classIndex,
  level,
  subclassIndex,
  register,
  watch,
  errors,
}: ClassFeaturesSectionProps) {
  const { data: classQueryData } = useClass(classIndex);
  const selectedClass = classQueryData?.class;

  if (!classIndex || !selectedClass || !selectedClass.class_levels) {
    return null;
  }

  const cumulativeFeatures: any[] = [];
  for (let lvl = 1; lvl <= level; lvl++) {
    const levelData = selectedClass.class_levels.find((l: any) => l.level === lvl);
    if (levelData?.features) {
      cumulativeFeatures.push(...levelData.features);
    }
  }

  if (cumulativeFeatures.length === 0) {
    return null;
  }

  const selectedSubclass = selectedClass.subclasses?.find((s: any) => s.index === subclassIndex);
  const classNameDisplay = selectedClass.name + (selectedSubclass ? ` - ${selectedSubclass.name}` : "");

  const classOnlyFeatures = cumulativeFeatures.filter((f: any) => {
    return !selectedSubclass || !f.index.includes(selectedClass.index);
  });

  const subclassFeatures = selectedSubclass ? cumulativeFeatures.filter((f: any) => {
    return f.index.includes(selectedClass.index) && f.index.includes(subclassIndex);
  }) : [];

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-martial-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 012 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Características da Classe - {classNameDisplay} (Nível {level})
      </h3>

      {classOnlyFeatures.length > 0 && (
        <div className="space-y-4">
          {classOnlyFeatures.map((feature: any) => (
            <div key={feature.index} className="p-4 bg-bg-inset rounded border border-border-default">
              <h4 className="font-semibold text-martial-400 mb-2">{feature.name}</h4>
              <div className="text-sm text-text-secondary">
                {feature.desc && Array.isArray(feature.desc) ? (
                  feature.desc.map((d: string, i: number) => <p key={i} className="mb-1">{d}</p>)
                ) : feature.desc ? (
                  <p>{feature.desc}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {subclassFeatures.length > 0 && (
        <>
          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-border-default"></div>
            <span className="text-xs text-text-secondary uppercase tracking-wider">Recursos da Subclasse</span>
            <div className="flex-1 h-px bg-border-default"></div>
          </div>
          <div className="space-y-4">
            {subclassFeatures.map((feature: any) => (
              <div key={feature.index} className="p-4 bg-bg-inset rounded border border-border-default">
                <h4 className="font-semibold text-nature-400 mb-2">{feature.name}</h4>
                <div className="text-sm text-text-secondary">
                  {feature.desc && Array.isArray(feature.desc) ? (
                    feature.desc.map((d: string, i: number) => <p key={i} className="mb-1">{d}</p>)
                  ) : feature.desc ? (
                    <p>{feature.desc}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
