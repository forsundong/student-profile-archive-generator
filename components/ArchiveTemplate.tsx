import React from 'react';
import { StudentRawData } from '../types';
import { UserCheck, Target, Brain, Calendar, Clock, BookOpen, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface ArchiveTemplateProps {
  data: StudentRawData;
  titlePrefix?: string;
  displayName?: string;
}

const ArchiveTemplate: React.FC<ArchiveTemplateProps> = ({ data, titlePrefix, displayName }) => {
  const getPotentialAnalysis = (base: string) => {
    const text = base.toLowerCase();
    if (text.includes('95') || text.includes('100') || text.includes('卓越')) {
      return { 
        level: '卓越卓越型 (L-Elite)', 
        desc: '数学直觉与逻辑迁移能力极强。建议通过竞赛类挑战保持其思维活跃度。',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        accent: 'bg-orange-600',
        iconColor: 'text-orange-500'
      };
    }
    if (text.includes('90') || text.includes('80') || text.includes('良好')) {
      return { 
        level: '稳健进取型 (L-Alpha)', 
        desc: '基础扎实，执行力高。下一步应侧重于复杂综合问题的拆解与多维思维训练。',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        accent: 'bg-blue-600',
        iconColor: 'text-blue-500'
      };
    }
    return { 
      level: '潜能触发型 (L-Beta)', 
      desc: '具备明显的成长曲线。建议通过成就感驱动，从具象思维逐步向抽象思维过渡。',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accent: 'bg-emerald-600',
      iconColor: 'text-emerald-500'
    };
  };

  const potential = getPotentialAnalysis(data.mathFoundation);
  const nameToDisplay = displayName || data.userId;
  const fullTitle = `${titlePrefix ? titlePrefix + ' · ' : ''}${nameToDisplay} 学员信息档案`;
  const cleanedTeacherName = data.classTeacher.replace(/\d+/g, '');

  const InfoCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) => (
    <div className="group p-8 rounded-[32px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={80} strokeWidth={1} />
      </div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className={`p-2.5 rounded-xl ${colorClass} shadow-sm`}>
          <Icon size={20} />
        </div>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-[1.35rem] text-slate-800 font-black leading-relaxed whitespace-pre-wrap flex-1 relative z-10 italic-chinese">
        {value || '（未记录数据）'}
      </p>
    </div>
  );

  return (
    <div className="bg-white p-12 md:p-16 max-w-[840px] mx-auto shadow-[0_40px_100px_rgba(0,0,0,0.1)] print:shadow-none print:p-8 rounded-[48px] relative border border-slate-100 overflow-hidden text-slate-900">
      {/* 顶部饰条 */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-400"></div>

      {/* 头部布局 */}
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-[0.25em] uppercase shadow-lg shadow-slate-200">
            <CheckCircle2 size={12} className="text-emerald-400" /> Professional Educational Archive
          </div>
          <h1 className="text-[2.6rem] font-black tracking-tight leading-none text-slate-900 italic-chinese">
            {fullTitle}
          </h1>
          <div className="flex items-center gap-5 text-slate-400 font-bold text-sm">
            <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-600">
              <UserCheck size={16} /> ID: {data.userId}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <span className="text-slate-500">档案锁定：{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* 导师信息区 */}
        <div className="bg-slate-900 p-8 rounded-[36px] text-white shadow-2xl relative overflow-hidden min-w-[240px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <GraduationCap size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Senior Mentor</span>
            </div>
            <p className="text-3xl font-black mb-2 italic-chinese">{cleanedTeacherName}</p>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              学习规划专家<br/>全周期成长主理人
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </header>

      {/* 核心潜力板块 */}
      <section className={`mb-12 p-10 rounded-[40px] border ${potential.color} relative overflow-hidden group`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <Award className={potential.iconColor} size={32} />
              <h2 className="text-sm font-black tracking-[0.1em] text-slate-500 uppercase">潜力评估维度</h2>
            </div>
            <div className="text-3xl font-black tracking-tighter italic-chinese">{potential.level}</div>
          </div>
          <div className="hidden md:block h-16 w-px bg-current opacity-10"></div>
          <div className="flex-1">
            <p className="text-lg font-bold leading-relaxed text-slate-700">{potential.desc}</p>
          </div>
        </div>
        <Award className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12 transition-transform duration-700 group-hover:scale-110" size={200} />
      </section>

      {/* 数据栅格系统 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={Brain} label="校内数学基础" value={data.mathFoundation} colorClass="bg-blue-50 text-blue-600" />
        <InfoCard icon={Target} label="学习内驱力状态" value={data.learningStatus} colorClass="bg-rose-50 text-rose-600" />
        <InfoCard icon={Calendar} label="过往课外规划" value={data.extracurricular} colorClass="bg-emerald-50 text-emerald-600" />
        <InfoCard icon={Clock} label="专注时长投入" value={data.timeInvestment} colorClass="bg-amber-50 text-amber-600" />
        <div className="md:col-span-2">
          <InfoCard icon={BookOpen} label="核心成长诉求" value={data.coreNeeds} colorClass="bg-violet-50 text-violet-600" />
        </div>
        <div className="md:col-span-2">
          <InfoCard icon={CheckCircle2} label="培养目标与预期" value={data.desiredGains} colorClass="bg-sky-50 text-sky-600" />
        </div>
      </div>

      {/* 底部寄语 */}
      <footer className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6">
          The future belongs to those who believe in the beauty of their dreams
        </p>
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-slate-100"></div>
          <p className="text-slate-800 text-xl font-black italic-chinese">
            “ 每一个思维火花，都值得被温柔对待。 ”
          </p>
          <div className="h-px w-12 bg-slate-100"></div>
        </div>
        <div className="mt-8 flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </footer>
    </div>
  );
};

export default ArchiveTemplate;