
import React from 'react';
import { StudentRawData } from '../types';
import { UserCheck, Target, Brain, Calendar, Clock, BookOpen, GraduationCap, Award } from 'lucide-react';

interface ArchiveTemplateProps {
  data: StudentRawData;
  titlePrefix?: string;
  displayName?: string; // 外部传入的真实姓名
}

const ArchiveTemplate: React.FC<ArchiveTemplateProps> = ({ data, titlePrefix, displayName }) => {
  // 定义更丰富的潜力判断逻辑与配色
  const getPotentialAnalysis = (base: string) => {
    if (base.includes('95') || base.includes('100')) {
      return { 
        level: '卓越型（Level S）', 
        desc: '数学直觉极强，具备跨学科联想能力，建议深度挖掘高阶思维。',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        iconColor: 'text-amber-500'
      };
    }
    if (base.includes('90') || base.includes('80') || base.includes('95')) {
      return { 
        level: '稳健型（Level A）', 
        desc: '基础扎实，逻辑链条完整。重点在于提升复杂问题的拆解能力。',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        iconColor: 'text-blue-500'
      };
    }
    return { 
      level: '成长型（Level B）', 
      desc: '具备较大的上升空间，建议从兴趣激发入手，建立学习自信心。',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-500'
    };
  };

  const potential = getPotentialAnalysis(data.mathFoundation);

  // 拼接标题逻辑：前缀-真实姓名-学员信息档案
  // 优先显示 displayName (手动输入的姓名)
  const nameToDisplay = displayName || data.userId;
  const fullTitle = `${titlePrefix ? titlePrefix + '-' : ''}${nameToDisplay ? nameToDisplay + '-' : ''}学员信息档案`;

  // 过滤老师姓名中的数字
  const cleanedTeacherName = data.classTeacher.replace(/\d+/g, '');

  const InfoCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) => (
    <div className={`p-8 rounded-[40px] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-base font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      {/* 调大内容字号 */}
      <p className="text-2xl text-slate-700 font-black leading-snug whitespace-pre-wrap flex-1">
        {value || '（暂无记录）'}
      </p>
    </div>
  );

  return (
    <div className="bg-[#FCFDFF] p-12 md:p-20 max-w-[840px] mx-auto shadow-[0_20px_80px_rgba(0,0,0,0.08)] print:shadow-none print:p-8 rounded-[80px] relative border border-slate-50 overflow-hidden">
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"></div>
      
      {/* Header Section */}
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-black tracking-[0.2em] uppercase shadow-sm">
            Professional Archive
          </div>
          {/* 适度缩小主标题字号，更显精致 */}
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {fullTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-400 font-black text-base">
            <span className="flex items-center gap-3 bg-slate-100 px-5 py-2.5 rounded-2xl text-slate-600">
              <UserCheck size={18} /> 学员标识: {data.userId}
            </span>
            <span className="opacity-30 text-xl">|</span>
            <span className="bg-slate-50 px-5 py-2.5 rounded-2xl font-bold">生成日期：{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* 负责老师板块 */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[48px] text-white shadow-2xl shadow-indigo-200 min-w-[280px] transform hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <GraduationCap size={24} />
            <span className="text-xs font-black uppercase tracking-widest">首席导师</span>
          </div>
          <p className="text-4xl font-black mb-3">{cleanedTeacherName}</p>
          <div className="h-2 w-12 bg-white/30 rounded-full mb-5"></div>
          <p className="text-sm font-bold leading-relaxed opacity-90">
            全流程成长监护人<br/>提供专业教学规划
          </p>
        </div>
      </header>

      {/* 核心：学员培养潜力判断 */}
      <section className={`mb-16 p-12 rounded-[56px] border-2 ${potential.color} relative overflow-hidden shadow-sm`}>
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <Award className={potential.iconColor} size={42} />
            <h2 className="text-2xl font-black tracking-tight">学员培养潜力判断</h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            {/* 适度缩小潜力标题字号 */}
            <div className="text-3xl font-black whitespace-nowrap tracking-tighter">{potential.level}</div>
            <div className="h-px md:h-16 w-full md:w-px bg-current opacity-20"></div>
            {/* 调大内容描述字号 */}
            <p className="text-xl font-bold leading-relaxed">{potential.desc}</p>
          </div>
        </div>
        {/* 装饰性背景图标 */}
        <Award className="absolute -right-12 -bottom-12 opacity-[0.04] rotate-12" size={280} />
      </section>

      {/* 数据网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-full">
          <InfoCard 
            icon={Brain} 
            label="校内数学基础" 
            value={data.mathFoundation} 
            colorClass="bg-blue-50 text-blue-500" 
          />
        </div>
        <div className="h-full">
          <InfoCard 
            icon={Target} 
            label="孩子学习状态" 
            value={data.learningStatus} 
            colorClass="bg-rose-50 text-rose-500" 
          />
        </div>
        <div className="h-full">
          <InfoCard 
            icon={Calendar} 
            label="课外班级安排" 
            value={data.extracurricular} 
            colorClass="bg-emerald-50 text-emerald-500" 
          />
        </div>
        <div className="h-full">
          <InfoCard 
            icon={Clock} 
            label="思维投入时间" 
            value={data.timeInvestment} 
            colorClass="bg-amber-50 text-amber-500" 
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <InfoCard 
            icon={BookOpen} 
            label="家长核心成长诉求" 
            value={data.coreNeeds} 
            colorClass="bg-indigo-50 text-indigo-500" 
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <InfoCard 
            icon={BookOpen} 
            label="希望收获与培养目标" 
            value={data.desiredGains} 
            colorClass="bg-sky-50 text-sky-500" 
          />
        </div>
      </div>

      {/* 底部寄语 */}
      <footer className="mt-24 pt-20 border-t border-slate-100 flex flex-col items-center">
        <div className="text-center max-w-2xl space-y-8">
          <p className="text-slate-800 text-2xl font-black italic-chinese leading-relaxed">
            “ 每一个思维的跳跃，都是通往未来无限可能的阶梯。 ”
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm font-black tracking-[0.4em] uppercase">
              EDUCATING FOR A BETTER FUTURE
            </p>
            <div className="flex gap-3">
              <div className="w-20 h-2 rounded-full bg-indigo-500"></div>
              <div className="w-8 h-2 rounded-full bg-slate-200"></div>
              <div className="w-8 h-2 rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArchiveTemplate;
