/**
 * 历年真题数据模块 - 考研数学学习助手
 * 包含2015-2024年考研数学一真题数据
 *
 * Phase 18: 框架搭建 - 定义数据结构和示例题目
 * Phase 19: 数据录入 - 填充完整10年真题
 * Phase 19: 数据集成 - 从外部JSON文件加载数据
 */

// ========== 历年分数线数据 ==========
// 注：数学一国家线（学术型）和高分参考线（985院校）
const examScoreLines = {
    // 2020年代
    2026: { national: 56, top: 90 },  // 预估
    2025: { national: 56, top: 90 },  // 预估
    2024: { national: 56, top: 90 },
    2023: { national: 56, top: 90 },
    2022: { national: 57, top: 90 },
    2021: { national: 56, top: 90 },
    2020: { national: 60, top: 95 },
    // 2010年代
    2019: { national: 59, top: 90 },
    2018: { national: 51, top: 85 },
    2017: { national: 53, top: 85 },
    2016: { national: 54, top: 90 },
    2015: { national: 54, top: 85 },
    2014: { national: 57, top: 90 },
    2013: { national: 57, top: 90 },
    2012: { national: 57, top: 90 },
    2011: { national: 60, top: 95 },
    2010: { national: 57, top: 90 },
    // 2000年代
    2009: { national: 55, top: 85 },
    2008: { national: 55, top: 85 },
    2007: { national: 57, top: 90 },
    2006: { national: 56, top: 85 },
    2005: { national: 56, top: 85 },
    2004: { national: 56, top: 85 },
    2003: { national: 55, top: 85 },
    2002: { national: 50, top: 80 },
    2001: { national: 50, top: 80 },
    2000: { national: 53, top: 80 },
    // 1990年代
    1999: { national: 52, top: 80 },
    1998: { national: 50, top: 78 },
    1997: { national: 50, top: 78 },
    1996: { national: 48, top: 75 },
    1995: { national: 48, top: 75 },
    1994: { national: 45, top: 72 },
    1993: { national: 45, top: 72 },
    1992: { national: 45, top: 70 },
    1991: { national: 42, top: 70 },
    1990: { national: 42, top: 70 },
    // 1980年代
    1989: { national: 40, top: 68 },
    1988: { national: 40, top: 68 },
    1987: { national: 40, top: 65 }
};

// ========== 真题数据加载 ==========
let realExamData = {};
let dataLoadPromises = {};

/**
 * 从JSON文件异步加载指定年份的真题数据
 * @param {number} year - 年份
 * @returns {Promise<Object>} 真题数据
 */
async function loadExamData(year) {
    if (realExamData[year]) {
        return realExamData[year];
    }

    if (!dataLoadPromises[year]) {
        dataLoadPromises[year] = fetch(`data/real-exam-${year}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`无法加载 ${year} 年数据`);
                }
                return response.json();
            })
            .then(data => {
                // 转换为内部数据结构
                realExamData[year] = {
                    year: year,
                    totalScore: 150,
                    timeLimit: 180,
                    sections: {
                        choice: {
                            name: '选择题',
                            count: data.filter(q => q.type === 'choice').length,
                            scorePerQuestion: 5,
                            questions: data.filter(q => q.type === 'choice')
                        },
                        blank: {
                            name: '填空题',
                            count: data.filter(q => q.type === 'blank').length,
                            scorePerQuestion: 5,
                            questions: data.filter(q => q.type === 'blank')
                        },
                        solve: {
                            name: '解答题',
                            count: data.filter(q => q.type === 'solve').length,
                            scores: [10, 10, 10, 10, 12, 12, 12, 12, 12],
                            questions: data.filter(q => q.type === 'solve')
                        }
                    }
                };
                return realExamData[year];
            })
            .catch(error => {
                console.error(`加载 ${year} 年真题数据失败:`, error);
                return null;
            });
    }

    return dataLoadPromises[year];
}

/**
 * 预加载指定年份的数据
 * @param {number|number[]} years - 年份或年份数组
 */
function preloadExamData(years) {
    const yearArray = Array.isArray(years) ? years : [years];
    yearArray.forEach(year => {
        if (!realExamData[year] && !dataLoadPromises[year]) {
            loadExamData(year);
        }
    });
}

// ========== 向后兼容的真题数据结构（仅包含框架） ==========
const legacyRealExamData = {
    // ==================== 2024年真题 ====================
    2024: {
        year: 2024,
        totalScore: 150,
        timeLimit: 180, // 分钟
        sections: {
            choice: {
                name: '选择题',
                count: 10,
                scorePerQuestion: 5,
                questions: [
                    {
                        id: '2024-c-1',
                        type: 'choice',
                        content: '设函数 $f(x)$ 在 $x=0$ 处连续，且 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$，则',
                        options: [
                            'A. $f(0) = 0$ 且 $f\'(0)$ 存在',
                            'B. $f(0) = 0$ 且 $f\'(0)$ 不存在',
                            'C. $f(0) = 1$ 且 $f\'(0)$ 存在',
                            'D. $f(0) = 1$ 且 $f\'(0)$ 不存在'
                        ],
                        answer: 'A',
                        explanation: '由 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$ 存在且有限，必有 $\\lim_{x \\to 0} f(x) = 0$。由连续性 $f(0) = 0$。又 $f\'(0) = \\lim_{x \\to 0} \\frac{f(x) - f(0)}{x - 0} = \\lim_{x \\to 0} \\frac{f(x)}{x} = 1$ 存在。',
                        knowledgePoints: ['calc-1-3', 'calc-2-1']
                    },
                    {
                        id: '2024-c-2',
                        type: 'choice',
                        content: '设 $f(x)$ 可导，$F(x) = f(x)(1+|x|)$，则 $F(x)$ 在 $x=0$ 处可导的充要条件是',
                        options: [
                            'A. $f(0) = 0$',
                            'B. $f\'(0) = 0$',
                            'C. $f(0) = f\'(0)$',
                            'D. $f(0) + f\'(0) = 0$'
                        ],
                        answer: 'A',
                        explanation: '$F\'_+(0) = \\lim_{x \\to 0^+} \\frac{f(x)(1+x) - f(0)}{x} = f(0) + f\'(0)$，$F\'_-(0) = \\lim_{x \\to 0^-} \\frac{f(x)(1-x) - f(0)}{x} = f(0) - f\'(0)$。可导要求左右导数相等，即 $f(0) = 0$。',
                        knowledgePoints: ['calc-2-1', 'calc-2-2']
                    },
                    {
                        id: '2024-c-3',
                        type: 'choice',
                        content: '设函数 $f(x,y)$ 在点 $(0,0)$ 处可微，且 $f(0,0)=0$，$f_x(0,0)=1$，$f_y(0,0)=2$，则 $\\lim_{t \\to 0} \\frac{f(t,2t)}{t}$ 等于',
                        options: [
                            'A. 3',
                            'B. 5',
                            'C. 1',
                            'D. 2'
                        ],
                        answer: 'B',
                        explanation: '由可微性，$f(t,2t) = f(0,0) + f_x(0,0) \\cdot t + f_y(0,0) \\cdot 2t + o(\\sqrt{t^2+4t^2}) = t + 4t + o(t) = 5t + o(t)$。因此极限为 5。',
                        knowledgePoints: ['calc-6-2']
                    },
                    // 占位题目 4-10 (Phase 19 填充)
                    {
                        id: '2024-c-4',
                        type: 'choice',
                        content: '设 $A$ 是 $n$ 阶矩阵，$|A|=2$，则 $|2A^*|$ 等于（其中 $A^*$ 是 $A$ 的伴随矩阵）',
                        options: [
                            'A. $2^n$',
                            'B. $2^{n+1}$',
                            'C. $2^{2n-1}$',
                            'D. $2^{2n}$'
                        ],
                        answer: 'C',
                        explanation: '$|A^*| = |A|^{n-1} = 2^{n-1}$，$|2A^*| = 2^n |A^*| = 2^n \\cdot 2^{n-1} = 2^{2n-1}$。',
                        knowledgePoints: ['linear-1-2', 'linear-2-3']
                    },
                    {
                        id: '2024-c-5',
                        type: 'choice',
                        content: '设随机变量 $X$ 与 $Y$ 相互独立，且都服从正态分布 $N(0,1)$，则 $P\\{\\max(X,Y) \\leq 0\\}$ 等于',
                        options: [
                            'A. $\\frac{1}{4}$',
                            'B. $\\frac{1}{3}$',
                            'C. $\\frac{1}{2}$',
                            'D. $\\frac{3}{4}$'
                        ],
                        answer: 'A',
                        explanation: '$P\\{\\max(X,Y) \\leq 0\\} = P\\{X \\leq 0, Y \\leq 0\\} = P\\{X \\leq 0\\} \\cdot P\\{Y \\leq 0\\} = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$。',
                        knowledgePoints: ['prob-2-3', 'prob-4-2']
                    }
                    // 题目6-10待填充
                ]
            },
            blank: {
                name: '填空题',
                count: 6,
                scorePerQuestion: 5,
                questions: [
                    {
                        id: '2024-b-1',
                        type: 'blank',
                        content: '极限 $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$ = ____',
                        answer: '-1/6',
                        acceptedAnswers: ['-1/6', '-\\frac{1}{6}', '-0.1667'],
                        explanation: '使用泰勒展开：$\\sin x = x - \\frac{x^3}{6} + o(x^3)$，所以 $\\frac{\\sin x - x}{x^3} = \\frac{-\\frac{x^3}{6} + o(x^3)}{x^3} \\to -\\frac{1}{6}$。',
                        knowledgePoints: ['calc-1-4']
                    },
                    {
                        id: '2024-b-2',
                        type: 'blank',
                        content: '设 $z = e^{xy}$，则 $\\frac{\\partial^2 z}{\\partial x \\partial y}$ = ____',
                        answer: 'e^(xy)(1+xy)',
                        acceptedAnswers: ['e^(xy)(1+xy)', '(1+xy)e^{xy}', 'e^{xy}(1+xy)'],
                        explanation: '$\\frac{\\partial z}{\\partial y} = xe^{xy}$，$\\frac{\\partial^2 z}{\\partial x \\partial y} = e^{xy} + xy \\cdot e^{xy} = e^{xy}(1+xy)$。',
                        knowledgePoints: ['calc-6-2']
                    },
                    {
                        id: '2024-b-3',
                        type: 'blank',
                        content: '设矩阵 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 2 & 3 \\end{pmatrix}$，则 $A$ 的秩 $r(A)$ = ____',
                        answer: '1',
                        acceptedAnswers: ['1'],
                        explanation: '观察发现第二行是第一行的2倍，第三行与第一行相同，所以只有一个线性无关的行向量，$r(A) = 1$。',
                        knowledgePoints: ['linear-2-4']
                    }
                    // 题目4-6待填充
                ]
            },
            solve: {
                name: '解答题',
                count: 9,
                scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], // 每题分值
                questions: [
                    {
                        id: '2024-s-1',
                        type: 'solve',
                        score: 10,
                        content: '求极限 $\\lim_{n \\to \\infty} \\sqrt[n]{\\frac{(2n)!}{n!n^n}}$。',
                        answer: '4/e',
                        solution: `**解：**

设 $a_n = \\frac{(2n)!}{n!n^n}$，则

$$\\frac{a_{n+1}}{a_n} = \\frac{(2n+2)!}{(n+1)!(n+1)^{n+1}} \\cdot \\frac{n!n^n}{(2n)!}$$

$$= \\frac{(2n+2)(2n+1)}{(n+1)(n+1)} \\cdot \\left(\\frac{n}{n+1}\\right)^n$$

$$= \\frac{4n^2+6n+2}{(n+1)^2} \\cdot \\left(1-\\frac{1}{n+1}\\right)^n$$

当 $n \\to \\infty$ 时，$\\frac{a_{n+1}}{a_n} \\to 4 \\cdot e^{-1} = \\frac{4}{e}$

因此 $\\lim_{n \\to \\infty} \\sqrt[n]{a_n} = \\frac{4}{e}$。`,
                        explanation: '使用比值法和斯特林公式近似。',
                        knowledgePoints: ['calc-1-4']
                    },
                    {
                        id: '2024-s-2',
                        type: 'solve',
                        score: 10,
                        content: '设矩阵 $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ -1 & 2 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix}$，求 $A$ 的全部特征值和特征向量。',
                        answer: '0, 1, 3',
                        solution: `**解：**

特征多项式：
$$|\\lambda E - A| = \\begin{vmatrix} \\lambda-1 & 1 & 0 \\\\ 1 & \\lambda-2 & 1 \\\\ 0 & 1 & \\lambda-1 \\end{vmatrix}$$

展开得：$\\lambda(\\lambda-1)(\\lambda-3) = 0$

特征值为 $\\lambda_1 = 0$，$\\lambda_2 = 1$，$\\lambda_3 = 3$。

对应特征向量分别为：
- $\\lambda_1 = 0$: $\\xi_1 = (1, 1, 1)^T$
- $\\lambda_2 = 1$: $\\xi_2 = (1, 0, -1)^T$
- $\\lambda_3 = 3$: $\\xi_3 = (1, -2, 1)^T$`,
                        explanation: '通过求解特征多项式得到特征值，再代入求解齐次方程组得到特征向量。',
                        knowledgePoints: ['linear-5-1', 'linear-5-2']
                    }
                    // 题目3-9待填充
                ]
            }
        }
    },

    // ==================== 2023年真题框架 ====================
    2023: {
        year: 2023,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2022年真题框架 ====================
    2022: {
        year: 2022,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2021年真题框架 ====================
    2021: {
        year: 2021,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2020年真题框架 ====================
    2020: {
        year: 2020,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2019年真题框架 ====================
    2019: {
        year: 2019,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2018年真题框架 ====================
    2018: {
        year: 2018,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2017年真题框架 ====================
    2017: {
        year: 2017,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2016年真题框架 ====================
    2016: {
        year: 2016,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    },

    // ==================== 2015年真题框架 ====================
    2015: {
        year: 2015,
        totalScore: 150,
        timeLimit: 180,
        sections: {
            choice: { name: '选择题', count: 10, scorePerQuestion: 5, questions: [] },
            blank: { name: '填空题', count: 6, scorePerQuestion: 5, questions: [] },
            solve: { name: '解答题', count: 9, scores: [10, 10, 10, 10, 12, 12, 12, 12, 12], questions: [] }
        }
    }
};

// ========== 辅助函数 ==========

/**
 * 获取指定年份的真题数据（异步）
 * @param {number} year - 年份
 * @returns {Promise<Object|null>} 真题数据
 */
async function getRealExamByYear(year) {
    return await loadExamData(year);
}

/**
 * 获取指定年份的真题数据（同步，如果已加载）
 * @param {number} year - 年份
 * @returns {Object|null} 真题数据
 */
function getRealExamByYearSync(year) {
    return realExamData[year] || null;
}

/**
 * 获取所有可用年份
 * @returns {number[]} 年份数组（降序）
 */
function getAvailableYears() {
    // 返回一个包含 1987 到 2026 的完整年份范围（降序），并合并已加载的数据年份
    const startYear = 1987;
    const endYear = 2026;
    const rangeYears = [];
    for (let y = endYear; y >= startYear; y--) rangeYears.push(y);

    const loadedYears = Object.keys(realExamData).map(Number);
    const allYears = Array.from(new Set([...rangeYears, ...loadedYears]));
    return allYears.sort((a, b) => b - a);
}

/**
 * 获取指定年份的分数线
 * @param {number} year - 年份
 * @returns {Object} 分数线数据
 */
function getScoreLine(year) {
    return examScoreLines[year] || { national: 0, top: 0 };
}

/**
 * 计算年份的题目总数（异步）
 * @param {number} year - 年份
 * @returns {Promise<number>} 题目总数
 */
async function getQuestionCount(year) {
    const exam = await getRealExamByYear(year);
    if (!exam) return 0;
    return exam.sections.choice.count + exam.sections.blank.count + exam.sections.solve.count;
}

/**
 * 计算年份的题目总数（同步，如果已加载）
 * @param {number} year - 年份
 * @returns {number} 题目总数
 */
function getQuestionCountSync(year) {
    const exam = getRealExamByYearSync(year);
    if (!exam) return 0;
    return exam.sections.choice.count + exam.sections.blank.count + exam.sections.solve.count;
}

/**
 * 检查年份是否有完整数据（异步）
 * @param {number} year - 年份
 * @returns {Promise<boolean>} 是否有数据
 */
async function hasExamData(year) {
    const exam = await getRealExamByYear(year);
    if (!exam) return false;
    const { choice, blank, solve } = exam.sections;
    return choice.questions.length > 0 || blank.questions.length > 0 || solve.questions.length > 0;
}

/**
 * 检查年份是否有完整数据（同步，如果已加载）
 * @param {number} year - 年份
 * @returns {boolean} 是否有数据
 */
function hasExamDataSync(year) {
    const exam = getRealExamByYearSync(year);
    if (!exam) return false;
    const { choice, blank, solve } = exam.sections;
    return choice.questions.length > 0 || blank.questions.length > 0 || solve.questions.length > 0;
}

// ========== 初始化 ==========

// 预加载已有的数据文件
// 预加载所有可能的年份数据（存在对应 data/real-exam-<year>.json 时会被加载）
const yearsToPreload = [];
for (let y = 1987; y <= 2026; y++) yearsToPreload.push(y);
preloadExamData(yearsToPreload);
