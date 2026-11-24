import { useCallback, useRef, useState } from 'react'

/**
 * 轻量点击音效 —— 用 Web Audio API 实时合成，零外部资源，永不失效。
 * 返回一个 play() 方法与开关。浏览器要求用户交互后才能播放音频，
 * 本 hook 会在首次调用时惰性创建 AudioContext，符合自动播放策略。
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const [enabled, setEnabled] = useState(true)

  const play = useCallback(
    (kind: 'pop' | 'open' | 'close' = 'pop') => {
      if (!enabled) return
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!Ctx) return
        if (!ctxRef.current) ctxRef.current = new Ctx()
        const ctx = ctxRef.current
        if (ctx.state === 'suspended') void ctx.resume()

        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // 不同交互用不同音高：展开偏上扬，收起偏下沉
        const startFreq = kind === 'open' ? 520 : kind === 'close' ? 420 : 660
        osc.type = 'sine'
        osc.frequency.setValueAtTime(startFreq, now)
        osc.frequency.exponentialRampToValueAtTime(kind === 'close' ? 300 : startFreq * 1.5, now + 0.1)

        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.16, now + 0.012)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.17)
      } catch {
        // 音频不可用时静默降级，不影响交互
      }
    },
    [enabled]
  )

  return { play, enabled, setEnabled }
}
