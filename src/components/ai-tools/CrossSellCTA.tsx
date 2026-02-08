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
import { Link } from '@/lib/i18n/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface CrossSellCTAProps {
  targetTool: 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';
  message: string;
  className?: string;
  estimateData?: Record<string, unknown>;
}

const toolConfig = {
  'idea-lab': {
    name: 'Idea Lab',
    description: 'Generate app ideas tailored to your industry',
    color: 'orange' as const,
    icon: Sparkles,
    href: '/idea-lab',
  },
  'ai-analyzer': {
    name: 'AI Idea Analyzer',
    description: 'Validate your app idea with AI insights',
    color: 'blue' as const,
    icon: Search,
    href: '/ai-analyzer',
  },
  'get-estimate': {
    name: 'Get AI Estimate',
    description: 'Get instant project cost and timeline estimates',
    color: 'green' as const,
    icon: Calculator,
    href: '/get-estimate',
  },
  'roi-calculator': {
    name: 'ROI Calculator',
    description: 'Calculate the ROI of your app investment',
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

export function CrossSellCTA({ targetTool, message, className, estimateData }: CrossSellCTAProps) {
  const router = useRouter();
  const tool = toolConfig[targetTool];
  const Icon = tool.icon;

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
          <h4 className="text-base font-semibold text-white mb-1">{tool.name}</h4>
          <p className="text-sm text-muted">{tool.description}</p>
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
          Try {tool.name}
        </Button>
      ) : (
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight />}
        >
          <Link href={tool.href}>Try {tool.name}</Link>
        </Button>
      )}
    </div>
  );
}
