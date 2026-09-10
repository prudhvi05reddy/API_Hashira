import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  Code2,
  FolderKanban,
  FileCheck,
} from 'lucide-react';
import { CandidateAnalysis } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface CandidateCardProps {
  candidate: CandidateAnalysis;
  index: number;
  totalCandidates: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  index,
  totalCandidates,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);

  // Alignment badge colors
  const alignmentStyles = {
    Excellent: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500/20',
    Strong: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-500/20',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500/20',
    Weak: 'bg-rose-100 text-rose-800 border-rose-300 ring-rose-500/20',
  }[candidate.alignment] || 'bg-slate-100 text-slate-800 border-slate-300';

  const { scoreBreakdown, skillSetMatch, missingGaps, recommendedCourses } = candidate;

  return (
    <div
      id={`candidate-card-${candidate.candidateId}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
    >
      {/* Candidate Card Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 via-white to-indigo-50/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Candidate Info */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
              #{index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {candidate.candidateName}
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${alignmentStyles}`}
                >
                  {candidate.alignment} Alignment
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Candidate Evaluation ID: <span className="font-mono text-slate-700">{candidate.candidateId}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 self-start lg:self-center">
            {/* 1. Overall ATS Score */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <ScoreGauge score={candidate.atsScore} size={84} strokeWidth={8} label="ATS Score" />
              <div className="text-left pr-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Match Rating
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {candidate.atsScore >= 85
                    ? 'Top Tier Match'
                    : candidate.atsScore >= 70
                    ? 'Viable Fit'
                    : candidate.atsScore >= 50
                    ? 'Partial Potential'
                    : 'Low Suitability'}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Skill Match: {skillSetMatch.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Required Outputs Content */}
      <div className="p-6 space-y-8">
        {/* OUTPUT 1: ATS COMPATIBILITY SCORE & WEIGHTED BREAKDOWN */}
        <section id={`candidate-${index}-output-1`} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                1
              </span>
              ATS Compatibility Score (0–100)
            </h4>
            <span className="text-xs font-mono font-bold text-slate-700">
              Overall: {candidate.atsScore}/100
            </span>
          </div>

          {/* Weighted factor grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Required Skills 40% */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Required Skills</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scoreBreakdown.requiredSkills}/40
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(scoreBreakdown.requiredSkills / 40) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Weight: 40%</span>
            </div>

            {/* Relevant Experience 25% */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Experience</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scoreBreakdown.relevantExperience}/25
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(scoreBreakdown.relevantExperience / 25) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Weight: 25%</span>
            </div>

            {/* Role Alignment 20% */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Role Alignment</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scoreBreakdown.roleAlignment}/20
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(scoreBreakdown.roleAlignment / 20) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Weight: 20%</span>
            </div>

            {/* Education 10% */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Education</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scoreBreakdown.educationQualifications}/10
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(scoreBreakdown.educationQualifications / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Weight: 10%</span>
            </div>

            {/* Keywords 5% */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Keywords</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scoreBreakdown.relevantKeywords}/5
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(scoreBreakdown.relevantKeywords / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Weight: 5%</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Scoring Factors Breakdown:</span>
            {scoreBreakdown.explanation}
          </div>
        </section>

        {/* OUTPUT 2: SKILL SET MATCH */}
        <section id={`candidate-${index}-output-2`} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                2
              </span>
              Skill Set Match ({skillSetMatch.percentage}%)
            </h4>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> {skillSetMatch.matched.length} Matched
              </span>
              <span className="text-amber-700 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> {skillSetMatch.partiallyMatched.length} Partial
              </span>
              <span className="text-rose-700 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" /> {skillSetMatch.missing.length} Missing
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Required Skills Found */}
            <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Required Skills Found ({skillSetMatch.matched.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillSetMatch.matched.length > 0 ? (
                  skillSetMatch.matched.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-200 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No required skills verified</span>
                )}
              </div>
            </div>

            {/* Partially Matched */}
            <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Partially Matched ({skillSetMatch.partiallyMatched.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillSetMatch.partiallyMatched.length > 0 ? (
                  skillSetMatch.partiallyMatched.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-white text-amber-800 border border-amber-200 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">None</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="border border-rose-200 bg-rose-50/30 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-600" />
                Required Skills Missing ({skillSetMatch.missing.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillSetMatch.missing.length > 0 ? (
                  skillSetMatch.missing.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-white text-rose-800 border border-rose-200 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-medium">No critical skills missing</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* OUTPUT 3: RESUME–JD ALIGNMENT */}
        <section id={`candidate-${index}-output-3`} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                3
              </span>
              Resume–JD Alignment
            </h4>
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>{showEvidence ? 'Hide Evidence Matrix' : 'View Role Evidence Details'}</span>
              {showEvidence ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Assessment:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${alignmentStyles}`}>
                {candidate.alignment}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {candidate.alignmentExplanation}
            </p>

            {/* Expandable Evidence from JD & Resume */}
            {showEvidence && (
              <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Job Role & Responsibilities
                  </span>
                  <p className="text-slate-600 text-[11px]">{candidate.alignmentFactors.jobRole} — {candidate.alignmentFactors.responsibilities}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" /> Experience & Projects
                  </span>
                  <p className="text-slate-600 text-[11px]">{candidate.alignmentFactors.experience} | {candidate.alignmentFactors.projects}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Code2 className="h-3.5 w-3.5 text-indigo-500" /> Technologies
                  </span>
                  <p className="text-slate-600 text-[11px]">{candidate.alignmentFactors.technologies}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> Education & Certifications
                  </span>
                  <p className="text-slate-600 text-[11px]">{candidate.alignmentFactors.education} | {candidate.alignmentFactors.certifications}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* OUTPUT 4: WHAT IS MISSING (PRIORITIZED GAPS) */}
        <section id={`candidate-${index}-output-4`} className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
              4
            </span>
            What is Missing (Prioritized Gaps)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* HIGH Gaps */}
            <div className="border border-rose-200 bg-rose-50/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-600"></span>
                  HIGH Priority
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                  Critical
                </span>
              </div>
              <ul className="space-y-1.5">
                {missingGaps.high.length > 0 ? (
                  missingGaps.high.map((gap, gIdx) => (
                    <li key={gIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-emerald-700 font-medium">None identified</li>
                )}
              </ul>
            </div>

            {/* MEDIUM Gaps */}
            <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                  MEDIUM Priority
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                  Important
                </span>
              </div>
              <ul className="space-y-1.5">
                {missingGaps.medium.length > 0 ? (
                  missingGaps.medium.map((gap, gIdx) => (
                    <li key={gIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">None</li>
                )}
              </ul>
            </div>

            {/* LOW Gaps */}
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  LOW Priority
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">
                  Nice-to-Have
                </span>
              </div>
              <ul className="space-y-1.5">
                {missingGaps.low.length > 0 ? (
                  missingGaps.low.map((gap, gIdx) => (
                    <li key={gIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">None</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* OUTPUT 5: RECOMMENDED COURSES / LEARNING */}
        <section id={`candidate-${index}-output-5`} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                5
              </span>
              Recommended Courses / Targeted Learning
            </h4>
            <span className="text-[11px] text-slate-400">
              Based solely on identified job gaps
            </span>
          </div>

          <div className="space-y-2.5">
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map((rec, rIdx) => {
                const badgeColor =
                  rec.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : rec.priority === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-800 border-slate-200';

                return (
                  <div
                    key={rIdx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0 font-bold text-[11px]">
                        {rIdx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">
                          {rec.courseOrTopic}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          <span className="font-semibold text-slate-700">Why it matters for this JD:</span> {rec.reason}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider self-start sm:self-center shrink-0 ${badgeColor}`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No major learning gaps identified for the target requirements!</span>
              </div>
            )}
          </div>
        </section>

        {/* OUTPUT 6: TIPS TO GAIN MORE ATS SCORE */}
        {candidate.scoreBoosterTips && candidate.scoreBoosterTips.length > 0 && (
          <section id={`candidate-${index}-output-6`} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">
                  ★
                </span>
                Tips to Gain More ATS Score Points
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Potential Boost: +{candidate.scoreBoosterTips.reduce((a, b) => a + (b.potentialPoints || 0), 0)} pts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {candidate.scoreBoosterTips.map((tip, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {tip.category}
                    </span>
                    <span className="text-xs font-black font-mono text-emerald-600">
                      +{tip.potentialPoints} pts
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Gap / Phrasing Issue
                    </span>
                    <p className="text-xs text-slate-700 mt-0.5">{tip.currentGap}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Actionable Optimization
                    </span>
                    <p className="text-xs text-slate-900 font-medium mt-0.5">{tip.actionableTip}</p>
                  </div>

                  {tip.exampleRewrite && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                        Example Rewrite
                      </span>
                      <p className="text-[11px] font-mono text-slate-800 bg-white p-2 rounded-md border border-slate-200 mt-1 leading-relaxed">
                        {tip.exampleRewrite}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
