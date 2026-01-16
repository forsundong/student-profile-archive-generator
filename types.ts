
export interface StudentRawData {
  userId: string;            // 用户userid
  coreNeeds: string;         // 用户核心诉求
  suggestions: string;       // 沟通建议 (内部)
  impression: string;        // 课程领取印象 (内部)
  mathFoundation: string;    // 校内数学基础
  learningStatus: string;    // 孩子学习状态
  supervisor: string;        // 谁负责辅导学习?
  desiredGains: string;      // 希望收获什么
  extracurricular: string;   // 课外班
  timeInvestment: string;    // 投入时间
  classTeacher: string;      // 承接老师
}
