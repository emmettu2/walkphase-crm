'use client'

import { scoreColor, scoreTextColor, cn } from '@/lib/utils'

export function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold',
        sizeClasses[size],
        score >= 70 ? 'bg-wp-pale text-wp-deep' :
        score >= 45 ? 'bg-amber-50 text-amber-700' :
        'bg-gray-100 text-gray-500'
      )}
    >
      {score}
    </div>
  )
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="score-bar flex-1 max-w-[80px]">
        <div
          className={cn('score-fill', scoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('text-xs font-semibold tabular-nums', scoreTextColor(score))}>
        {score}
      </span>
    </div>
  )
}
