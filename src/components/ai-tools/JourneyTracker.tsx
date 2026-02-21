'use client';

import { Sparkles, Search, Calculator, TrendingUp, Check, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useJourneyProgress, type ToolSlug } from '@/hooks/useJourneyProgress';
import { cn } from '@/lib/utils/cn';

interface JourneyTrackerProps {
  currentTool: ToolSlug;
}

const toolConfig: {
  slug: ToolSlug;
  nameKey: string;
  icon: typeof Sparkles;
  href: string;
  color: string;
}[] = [
  {
    slug: 'idea-lab',
    nameKey: 'idea_lab',
    icon: Sparkles,
    href: '/idea-lab',
    color: 'orange',
  },
  {
    slug: 'ai-analyzer',
    nameKey: 'ai_analyzer',
    icon: Search,
    href: '/ai-analyzer',
    color: 'blue',
  },
  {
    slug: 'get-estimate',
    nameKey: 'get_estimate',
    icon: Calculator,
    href: '/get-estimate',
    color: 'green',
  },
  {
    slug: 'roi-calculator',
    nameKey: 'roi_calculator',
    icon: TrendingUp,
    href: '/roi-calculator',
    color: 'purple',
  },
];

const activeRingColors: Record<string, string> = {
  orange: 'ring-1 ring-tool-orange/50 border-tool-orange/40 bg-tool-orange/10',
  blue: 'ring-1 ring-tool-blue/50 border-tool-blue/40 bg-tool-blue/10',
  green: 'ring-1 ring-tool-green/50 border-tool-green/40 bg-tool-green/10',
  purple: 'ring-1 ring-tool-purple/50 border-tool-purple/40 bg-tool-purple/10',
};

const activeTextColors: Record<string, string> = {
  orange: 'text-tool-orange-light',
  blue: 'text-tool-blue-light',
  green: 'text-tool-green-light',
  purple: 'text-tool-purple-light',
};

export function JourneyTracker({ currentTool }: JourneyTrackerProps) {
  const t = useTranslations('common');
  const { isCompleted, isCurrent } = useJourneyProgress(currentTool);

  return (
    <nav
      aria-label={t('journey_tracker.aria_label')}
      className="w-full bg-navy-light/50 border-b border-slate-blue-light/50 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <ol className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
          {toolConfig.map((tool, index) => {
            const Icon = tool.icon;
            const completed = isCompleted(tool.slug);
            const current = isCurrent(tool.slug);
            const isLast = index === toolConfig.length - 1;

            return (
              <li key={tool.slug} className="flex items-center min-w-0">
                <Link
                  href={tool.href}
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap',
                    current
                      ? activeRingColors[tool.color]
                      : completed
                        ? 'border-success/30 bg-success/5 hover:bg-success/10'
                        : 'border-transparent hover:bg-slate-blue-light/30'
                  )}
                >
                  {completed && !current ? (
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                  ) : (
                    <Icon
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        current ? activeTextColors[tool.color] : 'text-muted'
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'text-xs font-medium hidden sm:inline',
                      current
                        ? 'text-white'
                        : completed
                          ? 'text-success/80'
                          : 'text-muted'
                    )}
                  >
                    {t(`ai_tools.${tool.nameKey}.name`)}
                  </span>
                </Link>
                {!isLast && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted/40 flex-shrink-0 mx-0.5 rtl:rotate-180" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
