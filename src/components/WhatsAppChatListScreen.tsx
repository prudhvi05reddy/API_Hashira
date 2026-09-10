import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Camera,
  Archive,
  Pin,
  CheckCheck,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
  Phone,
  CircleDot,
  Plus,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Award,
  ChevronRight,
} from 'lucide-react';
import { UploadedDoc } from '../types';

interface WhatsAppChatListScreenProps {
  onOpenAtsAnalyzer: (presetCandidateName?: string) => void;
  onLoadSample: () => void;
  resumesCount: number;
  highestScore?: number;
}

interface ChatItem {
  id: string;
  name: string;
  avatarText: string;
  avatarBg: string;
  avatarImg?: string;
  lastMessage: string;
  timestamp: string;
  isDocument?: boolean;
  docName?: string;
  isPinned?: boolean;
  isRead?: boolean;
  isBlueCheck?: boolean;
  unreadCount?: number;
  hasMetaAi?: boolean;
  isYou?: boolean;
  sampleContent?: string;
}

export const WhatsAppChatListScreen: React.FC<WhatsAppChatListScreenProps> = ({
  onOpenAtsAnalyzer,
  onLoadSample,
  resumesCount,
  highestScore = 94,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'favourites' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBottomNav, setActiveBottomNav] = useState<'chats' | 'updates' | 'communities' | 'calls' | 'you'>('chats');

  // Exact chat list matching the user's screenshot
  const initialChats: ChatItem[] = [
    {
      id: 'chat-1',
      name: 'PRUDHVI REDDY ❤️ (You)',
      avatarText: 'PR',
      avatarBg: 'bg-amber-700',
      avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Hashira resume.pdf',
      docName: 'Hashira resume.pdf',
      isDocument: true,
      timestamp: '12:00 am',
      isPinned: true,
      isBlueCheck: true,
      isYou: true,
      sampleContent: `PRUDHVI REDDY
Email: prudhvi.reddy@email.com | Phone: +91 98765 43210 | Bangalore, India
LinkedIn: linkedin.com/in/prudhvireddy | GitHub: github.com/prudhvireddy

SUMMARY:
Results-driven Full Stack Software Developer with 4+ years of experience in React, TypeScript, Node.js, and Cloud architectures. Skilled in PostgreSQL, AWS, and CI/CD pipelines. Developed enterprise microservices with high test coverage.

WORK EXPERIENCE:
Senior Software Engineer | TechCorp Labs | Bangalore
2021 – Present
- Built React & TypeScript scalable dashboards for 100K+ monthly active users.
- Designed RESTful & GraphQL backend microservices in Node.js and PostgreSQL.
- Decreased query latency by 38% with database indexing and Redis caching.
- Automated CI/CD deployments using Docker and GitHub Actions on AWS ECS.

SKILLS:
- TypeScript, JavaScript, React, Redux, Node.js, Express, PostgreSQL, Docker, AWS, Git.`,
    },
    {
      id: 'chat-2',
      name: 'Manoj(B tech DS)',
      avatarText: 'M',
      avatarBg: 'bg-emerald-800',
      avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Resume_11.pdf',
      docName: 'Resume_11.pdf',
      isDocument: true,
      timestamp: '11:10 am',
      sampleContent: `MANOJ KUMAR
Data Science & Full Stack Engineering Graduate (B.Tech DS)
Email: manoj.ds@email.com | Phone: +91 91234 56789 | Hyderabad, India

SUMMARY:
Aspiring Software & Data Engineer with strong programming foundations in Python, JavaScript, React, and SQL. Hands-on experience building machine learning models and web dashboards.

PROJECTS & EXPERIENCE:
Software Development Intern | DataScale Tech | 2023 - 2024
- Implemented frontend features using React, Vite, and Tailwind CSS.
- Handled API integration with Node.js and MongoDB.
- Analyzed 500K+ data records using Pandas and PostgreSQL.

SKILLS:
Python, React, JavaScript, SQL, PostgreSQL, Docker, Git, REST APIs.`,
    },
    {
      id: 'chat-3',
      name: 'Vivek Kosireddi',
      avatarText: 'VK',
      avatarBg: 'bg-teal-700',
      avatarImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Plagiarism lekunda',
      timestamp: '11:05 am',
    },
    {
      id: 'chat-4',
      name: 'Ahmed (Btech DS)',
      avatarText: 'A',
      avatarBg: 'bg-indigo-700',
      avatarImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Ahmed Ali SDE Intern Resume(1) 2...',
      docName: 'Ahmed Ali SDE Intern Resume(1).pdf',
      isDocument: true,
      timestamp: '11:04 am',
      sampleContent: `AHMED ALI
Email: ahmed.ali@email.com | Phone: +91 99887 76655
SDE Intern & Computer Science Student

SUMMARY:
Software developer with focus on frontend React development, TypeScript, and backend Node.js APIs. Built several production-ready academic and freelance projects.

SKILLS:
React, TypeScript, Node.js, Express, PostgreSQL, Git, Tailwind CSS.`,
    },
    {
      id: 'chat-5',
      name: 'Employability Assessment...',
      avatarText: 'EA',
      avatarBg: 'bg-blue-600',
      lastMessage: 'Harikrishna: Hashira students ple...',
      timestamp: '11:00 am',
      hasMetaAi: true,
    },
    {
      id: 'chat-6',
      name: 'Teja ❤️ 🫀',
      avatarText: 'T',
      avatarBg: 'bg-amber-800',
      avatarImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'Haa..chepparaa',
      timestamp: 'Yesterday',
    },
  ];

  // Filter chats by search query and active tab
  const filteredChats = initialChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.docName && chat.docName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'unread') return matchesSearch && chat.unreadCount;
    if (activeTab === 'groups') return matchesSearch && chat.name.includes('Assessment');
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B141A] text-[#E9EDEF] flex justify-center font-sans antialiased selection:bg-[#00A884] selection:text-white select-none">
      {/* Mobile-sized container centered on wide screens, full-width on mobile */}
      <div className="w-full max-w-md md:max-w-lg min-h-screen flex flex-col relative bg-[#111B21] border-x border-[#202C33] shadow-2xl">
        
        {/* 1. TOP SYSTEM STATUS BAR (Android style matching screenshot) */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-xs text-[#8696A0] font-medium tracking-tight">
          <span className="font-bold text-white text-[13px]">11:26</span>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="px-1 py-0.2 rounded bg-[#202C33] text-[9px] font-bold text-white">PAYTM</span>
            <span>0.92 KB/s</span>
            <span>VoLTE</span>
            <div className="flex items-center gap-0.5">
              <span className="h-2 w-1 bg-white inline-block rounded-xs"></span>
              <span className="h-2.5 w-1 bg-white inline-block rounded-xs"></span>
              <span className="h-3 w-1 bg-white inline-block rounded-xs"></span>
            </div>
            <div className="flex items-center border border-white/60 rounded px-1 text-[9px] text-white">
              80
            </div>
          </div>
        </div>

        {/* 2. WHATSAPP HEADER APP BAR */}
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-[#E9EDEF] tracking-tight">WhatsApp</h1>
          <div className="flex items-center space-x-5 text-[#AEBAC1]">
            {/* Currency Rupee Icon */}
            <button
              type="button"
              title="Payments"
              className="h-7 w-7 rounded-full border border-[#AEBAC1]/60 flex items-center justify-center hover:text-white hover:border-white transition-colors cursor-pointer text-xs font-bold"
            >
              ₹
            </button>
            {/* Camera */}
            <button
              type="button"
              title="Camera"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Camera className="h-5 w-5" />
            </button>
            {/* Three Dots Menu */}
            <button
              type="button"
              title="Options"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3. SEARCH BAR ("Ask Meta AI or Search") */}
        <div className="px-4 pb-2.5">
          <div className="relative flex items-center bg-[#202C33] rounded-full px-4 py-2 text-sm text-[#8696A0]">
            <Search className="h-4 w-4 mr-3 text-[#8696A0] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Meta AI or Search"
              className="w-full bg-transparent text-[#E9EDEF] placeholder-[#8696A0] text-sm focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8696A0] hover:text-white px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4. FILTER PILLS (All, Unread, Favourites, Groups, +) */}
        <div className="flex items-center space-x-2 px-4 py-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#0A332C] text-[#00A884] font-bold border border-[#00A884]/30'
                : 'bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
              activeTab === 'unread'
                ? 'bg-[#0A332C] text-[#00A884] font-bold'
                : 'bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
              activeTab === 'favourites'
                ? 'bg-[#0A332C] text-[#00A884] font-bold'
                : 'bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            Favourites
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
              activeTab === 'groups'
                ? 'bg-[#0A332C] text-[#00A884] font-bold'
                : 'bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]'
            }`}
          >
            Groups
          </button>
          <button
            type="button"
            className="h-7 w-7 rounded-full bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF] flex items-center justify-center shrink-0 cursor-pointer"
            title="Add Filter"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* 5. ARCHIVED ROW */}
        <div
          className="flex items-center justify-between px-5 py-3 hover:bg-[#202C33]/40 active:bg-[#202C33] transition-colors"
        >
          <div className="flex items-center space-x-6">
            <div className="text-[#8696A0]">
              <Archive className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-[#E9EDEF]">Archived</span>
          </div>
          <span className="text-xs text-[#00A884] font-bold">1</span>
        </div>

        {/* 6. CHAT LIST ITEMS (Matching screenshot exactly) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#202C33]/40 pb-28">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center px-4 py-3 hover:bg-[#202C33]/30 transition-colors group cursor-default"
            >
              {/* Profile Avatar */}
              <div className="relative mr-3.5 shrink-0">
                {chat.avatarImg ? (
                  <img
                    src={chat.avatarImg}
                    alt={chat.name}
                    className="h-12 w-12 rounded-full object-cover border border-[#202C33]"
                  />
                ) : (
                  <div
                    className={`h-12 w-12 rounded-full ${chat.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-xs`}
                  >
                    {chat.name.includes('Assessment') ? (
                      <Users className="h-5 w-5 text-white" />
                    ) : (
                      chat.avatarText
                    )}
                  </div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-[15px] font-semibold text-[#E9EDEF] truncate flex items-center gap-1">
                    {chat.name}
                  </h3>
                  <span className="text-[11px] text-[#8696A0] shrink-0 ml-2 font-normal">
                    {chat.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-[#8696A0] truncate">
                    {/* Blue checkmark */}
                    {chat.isBlueCheck && (
                      <CheckCheck className="h-4 w-4 text-[#53BDEB] shrink-0" />
                    )}

                    {/* PDF/Document Icon */}
                    {chat.isDocument && (
                      <span className="inline-flex items-center text-[#8696A0] shrink-0">
                        <FileText className="h-3.5 w-3.5 mr-1 text-[#8696A0]" />
                      </span>
                    )}

                    <span className="truncate group-hover:text-white transition-colors">
                      {chat.lastMessage}
                    </span>
                  </div>

                  {/* Pin icon or unread count */}
                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {chat.isPinned && <Pin className="h-3.5 w-3.5 text-[#8696A0] rotate-45" />}
                    {chat.hasMetaAi && (
                      <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Guidance banner */}
          <div className="p-4 mx-4 mt-2 rounded-2xl bg-[#182229] border border-[#202C33] text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00A884]" />
              <span className="text-xs font-bold text-[#00A884]">ATS Resume Analyzer</span>
            </div>
            <p className="text-xs text-[#8696A0] leading-relaxed">
              Click the green <strong className="text-white">ATS icon button</strong> at the bottom right to open the full-screen ATS Resume Analyzer!
            </p>
          </div>
        </div>

        {/* 7. BOTTOM RIGHT FLOATING ACTION BUTTON (ATS RESUME ANALYZER) */}
        {/* Exactly positioned in the bottom right like in the screenshot! */}
        <div className="absolute bottom-20 right-4 flex flex-col items-end gap-3 z-30 pointer-events-auto">
          {/* Meta AI / ATS circular icon right above FAB */}
          <button
            onClick={() => onOpenAtsAnalyzer()}
            title="Ask ATS AI"
            aria-label="Ask ATS AI"
            className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-purple-500 shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </button>

          {/* Primary Green Floating Action Button (FAB) */}
          <div className="relative group">
            {/* Tooltip / Label */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#202C33] text-[#E9EDEF] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-[#00A884]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00A884]"></span>
              <span>Open ATS Resume Analyzer</span>
            </div>

            {/* Vibrant Green Rounded Square Button */}
            <button
              id="btn-ats-resume-analyzer-fab"
              onClick={() => onOpenAtsAnalyzer()}
              aria-label="Open ATS Resume Analyzer in Full Screen"
              className="h-14 w-14 rounded-[18px] bg-[#00A884] hover:bg-[#009373] active:scale-95 text-[#111B21] flex flex-col items-center justify-center shadow-2xl shadow-[#00A884]/40 transition-all duration-200 cursor-pointer border-2 border-white/30 hover:shadow-[#00A884]/60"
            >
              {/* Message + icon / ATS Icon */}
              <div className="relative flex items-center justify-center">
                <MessageSquare className="h-6 w-6 fill-[#111B21] stroke-[#111B21]" />
                <span className="absolute text-[10px] font-black text-white leading-none font-sans -top-0.5">
                  +
                </span>
              </div>
              <span className="text-[9px] font-black tracking-tighter text-[#111B21] uppercase mt-0.5">
                ATS
              </span>
            </button>
          </div>
        </div>

        {/* 8. BOTTOM NAVIGATION BAR (Chats, Updates, Communities, Calls, You) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#111B21] border-t border-[#202C33] flex items-center justify-around px-2 z-20 select-none">
          {/* Chats */}
          <button
            type="button"
            onClick={() => setActiveBottomNav('chats')}
            className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
          >
            <div className={`px-4 py-1 rounded-full ${activeBottomNav === 'chats' ? 'bg-[#0A332C]' : ''}`}>
              <MessageSquare className={`h-5 w-5 ${activeBottomNav === 'chats' ? 'text-[#00A884] fill-[#00A884]' : 'text-[#8696A0]'}`} />
            </div>
            <span className={`text-[11px] font-medium mt-0.5 ${activeBottomNav === 'chats' ? 'text-[#E9EDEF] font-bold' : 'text-[#8696A0]'}`}>
              Chats
            </span>
          </button>

          {/* Updates */}
          <button
            type="button"
            onClick={() => setActiveBottomNav('updates')}
            className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
          >
            <div className={`px-4 py-1 rounded-full ${activeBottomNav === 'updates' ? 'bg-[#0A332C]' : ''}`}>
              <CircleDot className={`h-5 w-5 ${activeBottomNav === 'updates' ? 'text-[#00A884]' : 'text-[#8696A0]'}`} />
            </div>
            <span className={`text-[11px] font-medium mt-0.5 ${activeBottomNav === 'updates' ? 'text-[#E9EDEF] font-bold' : 'text-[#8696A0]'}`}>
              Updates
            </span>
          </button>

          {/* Communities */}
          <button
            type="button"
            onClick={() => setActiveBottomNav('communities')}
            className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
          >
            <div className={`px-4 py-1 rounded-full ${activeBottomNav === 'communities' ? 'bg-[#0A332C]' : ''}`}>
              <Users className={`h-5 w-5 ${activeBottomNav === 'communities' ? 'text-[#00A884]' : 'text-[#8696A0]'}`} />
            </div>
            <span className={`text-[11px] font-medium mt-0.5 ${activeBottomNav === 'communities' ? 'text-[#E9EDEF] font-bold' : 'text-[#8696A0]'}`}>
              Communities
            </span>
          </button>

          {/* Calls */}
          <button
            type="button"
            onClick={() => setActiveBottomNav('calls')}
            className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
          >
            <div className={`px-4 py-1 rounded-full ${activeBottomNav === 'calls' ? 'bg-[#0A332C]' : ''}`}>
              <Phone className={`h-5 w-5 ${activeBottomNav === 'calls' ? 'text-[#00A884]' : 'text-[#8696A0]'}`} />
            </div>
            <span className={`text-[11px] font-medium mt-0.5 ${activeBottomNav === 'calls' ? 'text-[#E9EDEF] font-bold' : 'text-[#8696A0]'}`}>
              Calls
            </span>
          </button>

          {/* You */}
          <button
            type="button"
            onClick={() => setActiveBottomNav('you')}
            className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
          >
            <div className="h-7 w-7 rounded-full overflow-hidden border-2 border-[#8696A0] group-hover:border-[#00A884] transition-colors">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="You"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[11px] font-medium mt-0.5 text-[#8696A0]">You</span>
          </button>
        </div>

      </div>
    </div>
  );
};
