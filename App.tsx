
import React, { useState } from 'react';
import { FileUp, Printer, Users, UserCircle, Search, Trash2, FileText, LayoutGrid, Download, Loader2, Sparkles, Type, Settings2, UserRoundPen } from 'lucide-react';
import { StudentRawData } from './types';
import ArchiveTemplate from './components/ArchiveTemplate';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  const [students, setStudents] = useState<StudentRawData[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [titlePrefix, setTitlePrefix] = useState(''); 
  const [customNames, setCustomNames] = useState<Record<string, string>>({}); // 存储学员真实姓名映射
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (char === ',' && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result.map(v => v.replace(/^"|"$/g, ''));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines: string[] = [];
      let currentLine = '';
      let inQuote = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') inQuote = !inQuote;
        if ((char === '\n' || char === '\r') && !inQuote) {
          if (currentLine.trim()) lines.push(currentLine);
          currentLine = '';
          if (char === '\r' && text[i+1] === '\n') i++;
        } else {
          currentLine += char;
        }
      }
      if (currentLine.trim()) lines.push(currentLine);

      const rows = lines.slice(1);
      
      const parsedData: StudentRawData[] = rows.map(row => {
        const cols = parseCSVLine(row);
        return {
          userId: cols[0] || '',
          coreNeeds: cols[1] || '',
          suggestions: cols[2] || '',
          impression: cols[3] || '',
          mathFoundation: cols[4] || '',
          learningStatus: cols[5] || '',
          supervisor: cols[6] || '',
          desiredGains: cols[7] || '',
          extracurricular: cols[8] || '',
          timeInvestment: cols[9] || '',
          classTeacher: cols[10] || '',
        };
      });

      setStudents(prev => [...prev, ...parsedData]);
      if (parsedData.length > 0 && selectedIdx === null) {
        setSelectedIdx(0);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleCustomNameChange = (userId: string, name: string) => {
    setCustomNames(prev => ({ ...prev, [userId]: name }));
  };

  const batchExport = async () => {
    if (students.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    const zip = new JSZip();
    const exportContainer = document.getElementById('export-container');
    if (!exportContainer) return;

    const tempRootElement = document.createElement('div');
    exportContainer.appendChild(tempRootElement);
    const tempRoot = ReactDOM.createRoot(tempRootElement);

    try {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const displayName = customNames[student.userId] || student.userId;
        tempRoot.render(<ArchiveTemplate data={student} titlePrefix={titlePrefix} displayName={displayName} />);
        await new Promise(resolve => setTimeout(resolve, 600)); 

        const canvas = await html2canvas(tempRootElement, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#FCFDFF',
          logging: false,
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        if (blob) {
          const fileName = `${i + 1}_${displayName}_信息档案.png`.replace(/[\\/:*?"<>|]/g, '_');
          zip.file(fileName, blob);
        }
        setExportProgress(Math.round(((i + 1) / students.length) * 100));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `学员档案合集_${new Date().getTime()}.zip`;
      link.click();
    } catch (error) {
      console.error('Export Error:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
      tempRoot.unmount();
      exportContainer.innerHTML = '';
    }
  };

  const filteredStudents = students.filter(s => 
    s.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customNames[s.userId] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F1F3F9]">
      {/* 导出遮罩 */}
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-indigo-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="bg-white p-12 rounded-[56px] flex flex-col items-center max-w-md w-full shadow-2xl">
            <div className="relative mb-8">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">正在制作档案...</h3>
            <p className="text-slate-400 text-sm mb-10 font-medium">共 {students.length} 份报告</p>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
            </div>
            <p className="text-indigo-600 font-black text-lg">{exportProgress}%</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col no-print z-20 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Archive Pro</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">教育信息化助手 v2.2</p>
        </div>

        <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
          {/* 核心配置区域 */}
          <div className="bg-indigo-50/40 p-5 rounded-[32px] border border-indigo-100/50 space-y-5 shadow-inner">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
              <Settings2 size={16} /> 编辑预览参数
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type size={12} /> 档案标题前缀
              </label>
              <input 
                type="text" 
                placeholder="例如：2024秋季"
                className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold shadow-sm"
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
              />
            </div>

            {selectedIdx !== null && students[selectedIdx] && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <UserRoundPen size={12} /> 学员真实姓名
                </label>
                <input 
                  type="text" 
                  placeholder="输入姓名替换数字ID"
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold shadow-sm ring-2 ring-indigo-500/10"
                  value={customNames[students[selectedIdx].userId] || ''}
                  onChange={(e) => handleCustomNameChange(students[selectedIdx].userId, e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-4 rounded-[24px] flex items-center justify-center gap-2 transition-all font-black text-sm shadow-xl shadow-slate-200 group">
              <FileUp size={18} className="group-hover:scale-110 transition-transform" />
              上传学员 CSV 表
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={() => { if(confirm('确定清空所有数据？')) { setStudents([]); setSelectedIdx(null); setCustomNames({}); }}}
              className="py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-xs border border-transparent hover:border-rose-100"
            >
              清空数据队列
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="搜索学员或老师..."
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => (
              <button
                key={`${student.userId}-${idx}`}
                onClick={() => setSelectedIdx(students.indexOf(student))}
                className={`w-full p-5 rounded-[28px] flex items-center gap-4 transition-all text-left border-2 ${
                  selectedIdx === students.indexOf(student) 
                    ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-50 text-indigo-600 scale-[1.03]' 
                    : 'hover:bg-slate-50 text-slate-500 border-transparent bg-white/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  selectedIdx === students.indexOf(student) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <UserCircle size={28} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-black text-[15px] truncate tracking-tight">
                    {customNames[student.userId] || student.userId || '未命名'}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">
                    {student.classTeacher.replace(/\d+/g, '')}
                  </div>
                </div>
              </button>
            )) : (
              <div className="py-10 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">暂无结果</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Preview */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
        {selectedIdx !== null && students[selectedIdx] ? (
          <div className="w-full max-w-[840px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 no-print gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Sparkles size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">预览生成</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-0.5">档案已准备就绪</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={batchExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm font-black shadow-xl shadow-slate-200 group disabled:opacity-50"
                >
                  <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                  打包合集 ({students.length})
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all text-sm font-black shadow-sm group"
                >
                  <Printer size={20} className="group-hover:scale-110 transition-transform text-indigo-600" />
                  打印预览
                </button>
              </div>
            </div>
            
            <div className="print-area animate-in slide-in-from-bottom-8 duration-700 fade-in">
              <ArchiveTemplate 
                data={students[selectedIdx]} 
                titlePrefix={titlePrefix} 
                displayName={customNames[students[selectedIdx].userId] || students[selectedIdx].userId} 
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 no-print">
            <div className="bg-white p-20 rounded-[80px] shadow-2xl shadow-indigo-50/50 border border-slate-50 flex flex-col items-center text-center max-w-md">
              <div className="w-32 h-32 bg-indigo-50 rounded-[48px] flex items-center justify-center text-indigo-200 mb-10 border border-indigo-100 shadow-inner">
                <FileText size={64} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">档案系统就绪</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10">
                请先上传 CSV 表格，然后在左侧选择学员。您可以为每个学员设置真实姓名以便展示。
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
