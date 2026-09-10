import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  FileCheck,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CandidateAnalysis, GeneralAtsTip } from '../types';

interface AtsTipsSectionProps {
  candidates?: CandidateAnalysis[];
  generalTips?: GeneralAtsTip[];
}

export const AtsTipsSection: React.FC<AtsTipsSectionProps> = ({
  candidates = [],
  generalTips = [],
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[1]?.candidateId || candidates[0]?.candidateId || ''
  );
  const [activeFactorTab, setActiveFactorTab] = useState<
    'skills' | 'experience' | 'alignment' | 'education' | 'keywords' | 'formatting'
  >('skills');

  const selectedCandidate = candidates.find((c) => c.candidateId === selectedCandidateId);

  const factorBlueprints = {
    skills: {
      title: 'Required Skills (40% Total Weight)',
      badge: 'Highest Score Impact',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description:
        'Skills account for nearly half of the entire ATS score. Parsers do not just count keyword occurrences—they examine where the skill appears, frequency, and whether it is verified by hands-on project work.',
      actionItems: [
        'Place core skills in both a dedicated "TECHNICAL SKILLS" section AND within experience bullet points.',
        'Use both the full name and industry acronym: e.g. "Amazon Web Services (AWS)", "TypeScript (TS)".',
        'Group skills logically (Languages, Frontend, Backend, Databases, Cloud & DevOps).',
        'Eliminate obsolete or irrelevant tools (e.g. listing jQuery or Visual Basic for a modern React role).',
      ],
      pointsGain: '+15 to +25 Points',
    },
    experience: {
      title: 'Relevant Experience (25% Total Weight)',
      badge: 'Proof of Competence',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description:
        'ATS and recruiters rank candidates with metric-driven accomplishments far above candidates with passive job descriptions.',
      actionItems: [
        'Apply the Google XYZ Formula: "Accomplished [X] as measured by [Y] by doing [Z]".',
        'Include at least one concrete metric per role (e.g., "reduced latency by 42%", "supporting 150k+ DAU").',
        'Begin every bullet with strong action verbs: "Architected", "Engineered", "Optimized", "Spearheaded".',
        'Highlight leadership and code quality: code reviews, mentoring, and testing coverage.',
      ],
      pointsGain: '+10 to +18 Points',
    },
    alignment: {
      title: 'JD-Role Alignment (20% Total Weight)',
      badge: 'First-Impression Match',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description:
        'Measures how directly your target title, career narrative, and past responsibilities mirror what this employer needs.',
      actionItems: [
        'Customize your Professional Summary to mirror the exact target title (e.g. "Senior Full Stack Engineer").',
        'Align your project scope to the employer\'s domain (e.g. High-throughput SaaS, Fintech, Healthcare).',
        'Make sure recent positions clearly demonstrate progression into the requested responsibilities.',
        'Address company pain points directly in your opening headline.',
      ],
      pointsGain: '+8 to +14 Points',
    },
    education: {
      title: 'Education & Qualifications (10% Total Weight)',
      badge: 'Hard Gate Check',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description:
        'Many ATS systems filter by minimum degree or required certifications before a human recruiter even sees the application.',
      actionItems: [
        'Format degree cleanly: Degree Level, Major, University, Graduation Year.',
        'If your degree is outside computer science, highlight "or equivalent practical engineering experience".',
        'Place official cloud credentials (e.g. AWS Solutions Architect) in a prominent "Certifications" section.',
        'List license credential IDs and verification URLs to pass automated verification parsers.',
      ],
      pointsGain: '+5 to +10 Points',
    },
    keywords: {
      title: 'Relevant Keywords (5% Total Weight)',
      badge: 'Search Relevancy',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description:
        'Secondary keywords provide contextual depth. Modern ATS platforms reject keyword stuffing (such as repeating a word 20 times in white font). Context is key.',
      actionItems: [
        'Integrate contextual methodologies: "Agile/Scrum", "CI/CD", "Microservices", "TDD".',
        'Naturally weave tools into sentences: "Utilized Redis for distributed cache invalidation".',
        'Never use white-font keyword dumping—modern parsers strip formatting and flag it as manipulation.',
      ],
      pointsGain: '+3 to +5 Points',
    },
    formatting: {
      title: 'ATS Parser Formatting & Layout',
      badge: 'Avoid Disqualification',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description:
        'Up to 30% of resumes fail to be parsed correctly due to bad layouts, multi-column tables, or unreadable PDF layers.',
      actionItems: [
        'Use standard single-column layouts. Multi-column tables often cause text to be read out of sequence.',
        'Stick to standard headers: "WORK EXPERIENCE", "EDUCATION", "TECHNICAL SKILLS", "PROJECTS".',
        'Avoid text boxes, embedded graphics, icons representing skill bars, and header/footer contact info.',
        'Save as clean, selectable-text PDF or standard DOCX.',
      ],
      pointsGain: 'Prevents 0/100 Parsing Failures',
    },
  };

  const currentBlueprint = factorBlueprints[activeFactorTab];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-indigo-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Zap className="h-3.5 w-3.5" />
              ATS Optimization Playbook
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tips to Gain More ATS Score Points
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step-by-step guidance to optimize candidate resumes for ATS parsers and human recruiters, using the official 5-factor scoring weight model.
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-300 block font-medium">Avg Score Boost</span>
              <span className="text-2xl font-black text-emerald-400">+15 to +30 pts</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-300 block font-medium">Core Factors</span>
              <span className="text-2xl font-black text-indigo-300">5 Dimensions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Candidate-Specific Booster Recommendations */}
      {candidates.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Personalized Score Booster for Evaluated Candidates
              </h3>
              <p className="text-xs text-slate-500">
                Select a candidate to see tailored tips and concrete phrasing rewrites for this JD
              </p>
            </div>

            {/* Candidate Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Candidate:</span>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {candidates.map((cand) => (
                  <option key={cand.candidateId} value={cand.candidateId}>
                    {cand.candidateName} (Score: {cand.atsScore}/100)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCandidate && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Candidate Profile</span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedCandidate.candidateName} &mdash; Current ATS Score:{' '}
                    <span className="text-indigo-600 font-mono">{selectedCandidate.atsScore}/100</span>{' '}
                    ({selectedCandidate.alignment} Fit)
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Potential Score Jump:</span>
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    +
                    {selectedCandidate.scoreBoosterTips?.reduce(
                      (acc, t) => acc + (t.potentialPoints || 0),
                      0
                    ) || 18}{' '}
                    Points
                  </span>
                </div>
              </div>

              {/* Tips Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCandidate.scoreBoosterTips && selectedCandidate.scoreBoosterTips.length > 0 ? (
                  selectedCandidate.scoreBoosterTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {tip.category}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 font-mono flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />+{tip.potentialPoints} pts
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Identified Resume Gap
                          </span>
                          <p className="text-xs text-slate-700 mt-0.5">{tip.currentGap}</p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Recommended Fix
                          </span>
                          <p className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">
                            {tip.actionableTip}
                          </p>
                        </div>

                        {tip.exampleRewrite && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                              Example Bullet Rewrite
                            </span>
                            <p className="text-xs font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                              {tip.exampleRewrite}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    Detailed suggestions generated based on scoring criteria.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. The 5-Factor Scoring Optimization Blueprint */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            The 5-Factor Score Optimization Blueprint
          </h3>
          <p className="text-xs text-slate-500">
            How ATS ranking algorithms calculate scores across each category and how to maximize every point
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'skills', label: '1. Required Skills (40%)' },
            { id: 'experience', label: '2. Relevant Experience (25%)' },
            { id: 'alignment', label: '3. Role Alignment (20%)' },
            { id: 'education', label: '4. Education & Certs (10%)' },
            { id: 'keywords', label: '5. Keywords (5%)' },
            { id: 'formatting', label: 'ATS Formatting Rules' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFactorTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeFactorTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-slate-900">{currentBlueprint.title}</h4>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentBlueprint.badgeColor}`}
                >
                  {currentBlueprint.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {currentBlueprint.description}
              </p>
            </div>

            <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Potential Impact
              </span>
              <span className="text-sm font-black text-emerald-600 font-mono">
                {currentBlueprint.pointsGain}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Actionable Strategy Checklist:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentBlueprint.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Before & After Transformation Gallery */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Resume Bullet Transformation Gallery (Before & After)
          </h3>
          <p className="text-xs text-slate-500">
            Real transformations that turn low-scoring duty statements into high-ranking ATS bullet points
          </p>
        </div>

        <div className="space-y-4">
          {/* Example 1 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Domain: Database & Backend Optimization</span>
              <span className="text-emerald-700 font-mono">+12 Score Points</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-4 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> ❌ Weak / Low ATS Score
                </span>
                <p className="text-xs text-slate-600 bg-rose-50/60 p-3 rounded-lg border border-rose-200 leading-relaxed">
                  "Responsible for managing PostgreSQL database and writing backend API queries."
                </p>
                <span className="text-[10px] text-slate-400 block italic">
                  Why it fails: Passive language, zero metrics, no scope, missing performance keywords.
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ✅ ATS-Optimized Master Bullet
                </span>
                <p className="text-xs text-slate-800 font-medium bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                  "Architected PostgreSQL relational schemas with custom B-tree indexing and partitioning, reducing API response latency by 42% for 150,000+ daily active users."
                </p>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  Hits keywords: PostgreSQL, schemas, indexing, partitioning, API, latency metrics.
                </span>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Domain: Cloud & DevOps Infrastructure</span>
              <span className="text-emerald-700 font-mono">+15 Score Points</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-4 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> ❌ Weak / Low ATS Score
                </span>
                <p className="text-xs text-slate-600 bg-rose-50/60 p-3 rounded-lg border border-rose-200 leading-relaxed">
                  "Helped deploy containers to AWS and set up GitHub pipelines."
                </p>
                <span className="text-[10px] text-slate-400 block italic">
                  Why it fails: 'Helped' signals lack of ownership; no specific AWS services or results listed.
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ✅ ATS-Optimized Master Bullet
                </span>
                <p className="text-xs text-slate-800 font-medium bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                  "Containerized Node.js microservices with Docker and orchestrated automated zero-downtime CI/CD deployment pipelines on AWS ECS and RDS via GitHub Actions."
                </p>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  Hits keywords: Docker, AWS ECS, RDS, GitHub Actions, microservices, CI/CD.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
