import type { SourcePlatform } from '@/schemas/source'

import { Button } from '@/components/ui/button'
import { useContentParser } from '@/hooks/useContentParser'
import { useTRPC } from '@/hooks/useTRPC'
import { tones } from '@/schemas/tone'
import { TRPCClientError } from '@trpc/client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Tone({ source }: { source: SourcePlatform }) {
  const trpc = useTRPC()
  const parser = useContentParser(source)
  const [loadingTone, setLoadingTone] = useState<null | string>(null)
  const [usageData, setUsageData] = useState<any>(null)
  const [usageLimitReached, setUsageLimitReached] = useState(false)

  // Check usage status on component mount
  useEffect(() => {
    const checkUsage = async () => {
      try {
        const usage = await trpc.usage.query()
        setUsageData(usage)
        // Check if usage limit is reached
        if (usage?.currentMonthTotal >= usage?.planLimit) {
          setUsageLimitReached(true)
        }
      }
      catch (error) {
        console.error('Failed to fetch usage:', error)
      }
    }
    checkUsage()
  }, [])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const tone = tones.find(({ emoji }) => emoji === e.currentTarget.textContent)
    if (!tone)
      return

    // Check if usage limit is reached before attempting generation
    if (usageLimitReached) {
      await parser.setText('Usage limit exceeded for current billing period. Please upgrade your plan to continue.')
      return
    }

    setLoadingTone(tone.emoji)
    try {
      const content = parser.getContent(e.currentTarget)
      if (!content) {
        await parser.setText('Error: No content found')
        return
      }

      const response = await trpc.generate.mutate({ source, tone: tone.name, type: 'reply', ...content })
      if (!response)
        return

      await parser.setText(response.text)

      // Update usage data after successful generation
      if (usageData) {
        const newUsageData = {
          ...usageData,
          currentMonthTotal: usageData.currentMonthTotal + 1,
        }
        setUsageData(newUsageData)
        // Check if limit is now reached
        if (newUsageData.currentMonthTotal >= newUsageData.planLimit) {
          setUsageLimitReached(true)
        }
      }
    }
    catch (error) {
      if (error instanceof TRPCClientError && error.data?.code === 'FORBIDDEN') {
        setUsageLimitReached(true)
        await parser.setText('Usage limit exceeded for current billing period. Please upgrade your plan to continue.')
      }
      else {
        await parser.setText(error instanceof TRPCClientError ? error.message : 'Error: Unknown error')
      }
    }
    finally {
      setLoadingTone(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {usageLimitReached && (
        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
          <AlertTriangle className="h-3 w-3" />
          <span>Usage limit reached</span>
        </div>
      )}
      <div className="flex">
        {tones.map(({ emoji, name }) => (
          <Button
            disabled={loadingTone !== null || usageLimitReached}
            key={name}
            onClick={handleClick}
            size="icon"
            title={usageLimitReached ? 'Usage limit exceeded' : `Generate ${name} response`}
            variant="ghost"
          >
            {loadingTone === emoji
              ? (
                  <Loader2 className="animate-spin" />
                )
              : (
                  emoji
                )}
          </Button>
        ))}
      </div>
      {usageData && (
        <div className="text-xs text-gray-500">
          {usageData.currentMonthTotal}
          /
          {usageData.planLimit}
          {' '}
          used this month
        </div>
      )}
    </div>
  )
}
