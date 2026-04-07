'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function PreferencesPage() {
  const router = useRouter()
  const { selectedDomain, selectedSubTrack, setPreferences } = useStore()

  const [hours, setHours] = useState<number>(2)
  const [targetLevel, setTargetLevel] = useState<'Fundamentals' | 'Job Ready' | 'Expert'>('Job Ready')
  const [deadline, setDeadline] = useState<string>('')

  // Optional: Redirect if no domain/subtrack selected
  useEffect(() => {
    if (!selectedDomain || !selectedSubTrack) {
      router.push('/select')
    }
  }, [selectedDomain, selectedSubTrack, router])

  const handleGenerate = () => {
    setPreferences({
      hoursPerDay: hours,
      targetLevel,
      deadline: deadline || undefined
    })
    router.push('/generating')
  }

  // If missing state, prevent rendering the main content briefly
  if (!selectedDomain || !selectedSubTrack) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .btn-glow:hover {
          animation: glow-pulse 1.5s infinite;
        }
        .custom-range {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: #1f1f1f;
          border-radius: 9999px;
          outline: none;
        }
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #0a0a0a;
          transition: transform 0.1s ease;
        }
        .custom-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      ` }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[560px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-10"
      >
        {/* Breadcrumb */}
        <div className="text-sm text-[#737373] mb-8 flex items-center gap-2">
          <span>{selectedDomain}</span>
          <span>→</span>
          <span>{selectedSubTrack}</span>
          <span>→</span>
          <span className="text-[#e5e5e5]">Preferences</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Set Your Pace</h1>

        <div className="space-y-10">
          {/* Input 1 — Time Commitment */}
          <div className="space-y-4">
            <label className="block text-[#e5e5e5] font-semibold text-lg tracking-wide">
              How many hours can you commit per day?
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="custom-range flex-1"
              />
              <div className="text-right sm:w-32 whitespace-nowrap text-[#a3a3a3] text-sm bg-[#171717] px-3 py-2 rounded-lg border border-[#262626]">
                <span className="text-[#e5e5e5] font-bold text-base">{hours}</span> hrs/day
                <div className="text-xs mt-0.5">~{Math.round(hours * 7)} hrs/week</div>
              </div>
            </div>
          </div>

          {/* Input 2 — Target Level */}
          <div className="space-y-4">
            <label className="block text-[#e5e5e5] font-semibold text-lg tracking-wide">
              What level do you want to reach?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Fundamentals', icon: '🌱', desc: 'Core concepts and foundations' },
                { id: 'Job Ready', icon: '💼', desc: 'Skills to land your first role' },
                { id: 'Expert', icon: '🏆', desc: 'Deep mastery and specialization' }
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setTargetLevel(level.id as any)}
                  className={`flex flex-col items-center text-center p-4 border rounded-xl transition-all duration-200 focus:outline-none ${
                    targetLevel === level.id
                      ? 'border-[#6366f1] bg-[#6366f1]/10 transform scale-[1.02]'
                      : 'border-[#262626] bg-[#171717] hover:border-[#404040] hover:bg-[#1f1f1f]'
                  }`}
                >
                  <span className="text-2xl mb-2 drop-shadow-sm">{level.icon}</span>
                  <span className="font-semibold text-sm text-[#e5e5e5] mb-1">{level.id}</span>
                  <span className="text-[11px] text-[#a3a3a3] leading-snug px-1">{level.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 3 — Deadline */}
          <div className="space-y-4">
            <label className="block text-[#e5e5e5] font-semibold text-lg tracking-wide">
              Got a deadline? <span className="text-[#737373] text-sm font-normal italic">(optional)</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#171717] border border-[#262626] rounded-xl px-4 py-3 text-[#e5e5e5] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="btn-glow w-full bg-[#6366f1] text-white font-semibold text-lg py-4 rounded-xl flex items-center justify-center gap-2 mt-4 transition-all hover:bg-[#4f46e5]"
          >
            Generate My Roadmap &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  )
}
