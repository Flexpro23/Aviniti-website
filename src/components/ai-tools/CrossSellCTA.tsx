/**
 * Cross-Sell CTA
 *
 * "Next step" card linking to another AI tool.
 * Shown after results to guide users to related tools.
 *
 * Props:
 * - targetTool: Slug of tool to promote (idea-lab, ai-analyzer, etc.)
 * - message: Custom message for this cross-sell
 */

'use client';

import { ArrowRight, Sparkles, Search, Calculator, TrendingUp } from 'lucide-react';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';

interface CrossSellCTAProps {
  targetTool: 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';
  message: string;
  className?: string;
  estimateData?: Record<string, unknown>;
  analyzerData?: Record<string, unknown>;
  roiData?: Record<string, unknown>;
}

const toolConfig = {
  'idea-lab': {
    nameKey: 'idea_lab',
    color: 'orange' as const,
    icon: Sparkles,
    href: '/idea-lab',
  },
  'ai-analyzer': {
    nameKey: 'ai_analyzer',
    color: 'blue' as const,
    icon: Search,
    href: '/ai-analyzer',
  },
  'get-estimate': {
    nameKey: 'get_estimate',
    color: 'green' as const,
    icon: Calculator,
    href: '/get-estimate',
  },
  'roi-calculator': {
    nameKey: 'roi_calculator',
    color: 'purple' as const,
    icon: TrendingUp,
    href: '/roi-calculator',
  },
};

const colorClasses = {
  orange: 'bg-tool-orange/10 border-tool-orange/30',
  blue: 'bg-tool-blue/10 border-tool-blue/30',
  green: 'bg-tool-green/10 border-tool-green/30',
  purple: 'bg-tool-purple/10 border-tool-purple/30',
};

export function CrossSellCTA({ targetTool, message, className, estimateData, analyzerData, roiData }: CrossSellCTAProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const tool = toolConfig[targetTool];
  const Icon = tool.icon;
  const toolName = t(`ai_tools.${tool.nameKey}.name`);
  const toolDescription = t(`ai_tools.${tool.nameKey}.description`);
  const tryToolText = t('ai_tools.try_tool', { tool: toolName });

  return (
    <div
      className={cn(
        'rounded-xl p-6 border-2',
        colorClasses[tool.color],
        className
      )}
    >
      {/* Message */}
      <p className="text-sm font-medium text-muted mb-4">{message}</p>

      {/* Tool Info */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-blue flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-base font-semibold text-white mb-1">{toolName}</h4>
          <p className="text-sm text-muted">{toolDescription}</p>
        </div>
      </div>

      {/* CTA Button */}
      {estimateData && targetTool === 'roi-calculator' ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight />}
          onClick={() => {
            sessionStorage.setItem('aviniti_roi_estimate_data', JSON.stringify(estimateData));
            router.push(tool.href + '?fromEstimate=true');
          }}
        >
          {tryToolText}
        </Button>
      ) : roiData && targetTool === 'get-estimate' ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight />}
          onClick={() => {
            sessionStorage.setItem('aviniti_estimate_roi_data', JSON.stringify(roiData));
            router.push(tool.href + '?fromROI=true');
          }}
        >
          {tryToolText}
        </Button>
      ) : analyzerData && targetTool === 'get-estimate' ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight />}
          onClick={() => {
            sessionStorage.setItem('aviniti_estimate_analyzer_data', JSON.stringify(analyzerData));
            router.push(tool.href + '?fromAnalyzer=true');
          }}
        >
          {tryToolText}
        </Button>
      ) : (
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight />}
        >
          <Link href={tool.href}>{tryToolText}</Link>
        </Button>
      )}
    </div>
  );
}
