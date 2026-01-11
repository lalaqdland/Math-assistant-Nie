/**
 * 题目模板系统 - 考研数学学习助手
 * Phase 21: 题库扩充系统
 *
 * 提供参数化题目模板，支持随机数值替换和答案自动计算
 */

const QuestionTemplateSystem = {
    /**
     * 生成随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 生成非零随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    randNonZero(min, max) {
        let n;
        do {
            n = this.randInt(min, max);
        } while (n === 0);
        return n;
    },

    /**
     * 从数组中随机选择
     * @param {Array} arr - 数组
     * @returns {*}
     */
    randChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * 打乱数组
     * @param {Array} arr - 数组
     * @returns {Array}
     */
    shuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * 格式化分数显示
     * @param {number} num - 分子
     * @param {number} den - 分母
     * @returns {string}
     */
    formatFraction(num, den) {
        if (den === 1) return `${num}`;
        if (num === 0) return '0';
        const gcd = this.gcd(Math.abs(num), Math.abs(den));
        const n = num / gcd;
        const d = den / gcd;
        if (d === 1) return `${n}`;
        if (d < 0) return `\\frac{${-n}}{${-d}}`;
        return `\\frac{${n}}{${d}}`;
    },

    /**
     * 最大公约数
     */
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    },

    // ==================== 微积分模板 ====================

    /**
     * 极限计算模板 - 基础型
     */
    limitBasic() {
        const templates = [
            // 多项式极限
            () => {
                const a = this.randNonZero(-5, 5);
                const b = this.randNonZero(-5, 5);
                const c = this.randInt(-5, 5);
                const x0 = this.randInt(-3, 3);
                const answer = a * x0 * x0 + b * x0 + c;
                return {
                    question: `求极限 $\\lim_{x \\to ${x0}} (${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c})$ = ____`,
                    answer: `${answer}`,
                    explanation: `直接代入 $x = ${x0}$，得 $${a} \\times ${x0}^2 ${b >= 0 ? '+' : ''}${b} \\times ${x0} ${c >= 0 ? '+' : ''}${c} = ${answer}$`
                };
            },
            // 0/0型极限
            () => {
                const a = this.randNonZero(1, 5);
                const answer = 2 * a;
                return {
                    question: `求极限 $\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x - ${a}}$ = ____`,
                    answer: `${answer}`,
                    explanation: `因式分解：$\\frac{x^2 - ${a * a}}{x - ${a}} = \\frac{(x-${a})(x+${a})}{x-${a}} = x + ${a}$，代入得 $${answer}$`
                };
            },
            // 三角函数极限
            () => {
                const n = this.randChoice([2, 3, 4, 5]);
                return {
                    question: `求极限 $\\lim_{x \\to 0} \\frac{\\sin ${n}x}{x}$ = ____`,
                    answer: `${n}`,
                    explanation: `由重要极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$，得 $\\lim_{x \\to 0} \\frac{\\sin ${n}x}{x} = ${n} \\cdot \\lim_{x \\to 0} \\frac{\\sin ${n}x}{${n}x} = ${n}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    /**
     * 导数计算模板
     */
    derivativeBasic() {
        const templates = [
            // 幂函数导数
            () => {
                const n = this.randInt(2, 6);
                const a = this.randNonZero(-5, 5);
                const coef = a * n;
                const exp = n - 1;
                return {
                    question: `设 $f(x) = ${a}x^${n}$，则 $f'(x)$ = ____`,
                    answer: `${coef}x^${exp}`,
                    explanation: `$(x^n)' = nx^{n-1}$，所以 $(${a}x^${n})' = ${a} \\cdot ${n}x^{${n}-1} = ${coef}x^${exp}$`
                };
            },
            // 指数函数导数
            () => {
                const a = this.randNonZero(2, 5);
                return {
                    question: `设 $f(x) = e^{${a}x}$，则 $f'(x)$ = ____`,
                    answer: `${a}e^{${a}x}`,
                    explanation: `$(e^{ax})' = ae^{ax}$，所以 $(e^{${a}x})' = ${a}e^{${a}x}$`
                };
            },
            // 三角函数导数
            () => {
                const funcs = [
                    { f: '\\sin x', d: '\\cos x' },
                    { f: '\\cos x', d: '-\\sin x' },
                    { f: '\\tan x', d: '\\sec^2 x' }
                ];
                const choice = this.randChoice(funcs);
                return {
                    question: `设 $f(x) = ${choice.f}$，则 $f'(x)$ = ____`,
                    answer: choice.d,
                    explanation: `根据基本导数公式，$(${choice.f})' = ${choice.d}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    /**
     * 积分计算模板
     */
    integralBasic() {
        const templates = [
            // 幂函数积分
            () => {
                const n = this.randInt(2, 5);
                const exp = n + 1;
                return {
                    question: `计算不定积分 $\\int x^${n} dx$ = ____`,
                    answer: `\\frac{x^{${exp}}}{${exp}} + C`,
                    explanation: `$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$，所以 $\\int x^${n} dx = \\frac{x^{${exp}}}{${exp}} + C$`
                };
            },
            // 指数函数积分
            () => {
                const a = this.randNonZero(2, 5);
                return {
                    question: `计算不定积分 $\\int e^{${a}x} dx$ = ____`,
                    answer: `\\frac{1}{${a}}e^{${a}x} + C`,
                    explanation: `$\\int e^{ax} dx = \\frac{1}{a}e^{ax} + C$，所以 $\\int e^{${a}x} dx = \\frac{1}{${a}}e^{${a}x} + C$`
                };
            },
            // 定积分计算
            () => {
                const a = 0;
                const b = this.randInt(1, 3);
                const n = 2;
                const answer = (b ** 3) / 3;
                return {
                    question: `计算定积分 $\\int_${a}^${b} x^${n} dx$ = ____`,
                    answer: this.formatFraction(b ** 3, 3),
                    explanation: `$\\int_${a}^${b} x^${n} dx = \\frac{x^3}{3}\\Big|_${a}^${b} = \\frac{${b}^3}{3} - 0 = ${this.formatFraction(b ** 3, 3)}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    // ==================== 线性代数模板 ====================

    /**
     * 行列式计算模板
     */
    determinantBasic() {
        const templates = [
            // 2阶行列式
            () => {
                const a = this.randInt(-5, 5);
                const b = this.randInt(-5, 5);
                const c = this.randInt(-5, 5);
                const d = this.randInt(-5, 5);
                const det = a * d - b * c;
                return {
                    question: `计算行列式 $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$ = ____`,
                    answer: `${det}`,
                    explanation: `二阶行列式 $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc = ${a} \\times ${d} - ${b} \\times ${c} = ${det}$`
                };
            },
            // 特殊3阶行列式（对角）
            () => {
                const a = this.randNonZero(-4, 4);
                const b = this.randNonZero(-4, 4);
                const c = this.randNonZero(-4, 4);
                const det = a * b * c;
                return {
                    question: `计算行列式 $\\begin{vmatrix} ${a} & 0 & 0 \\\\ 0 & ${b} & 0 \\\\ 0 & 0 & ${c} \\end{vmatrix}$ = ____`,
                    answer: `${det}`,
                    explanation: `对角矩阵的行列式等于对角线元素的乘积：$${a} \\times ${b} \\times ${c} = ${det}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    /**
     * 矩阵运算模板
     */
    matrixBasic() {
        const templates = [
            // 矩阵加法
            () => {
                const a = this.randInt(-5, 5);
                const b = this.randInt(-5, 5);
                const c = this.randInt(-5, 5);
                const d = this.randInt(-5, 5);
                return {
                    question: `设 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$，则 $A + A^T$ = ____`,
                    answer: `\\begin{pmatrix} ${2*a} & ${b+c} \\\\ ${b+c} & ${2*d} \\end{pmatrix}`,
                    explanation: `$A^T = \\begin{pmatrix} ${a} & ${c} \\\\ ${b} & ${d} \\end{pmatrix}$，$A + A^T = \\begin{pmatrix} ${2*a} & ${b+c} \\\\ ${b+c} & ${2*d} \\end{pmatrix}$`
                };
            },
            // 矩阵的秩
            () => {
                const a = this.randNonZero(-3, 3);
                const k = this.randInt(2, 3);
                return {
                    question: `设矩阵 $A = \\begin{pmatrix} ${a} & ${a*k} \\\\ ${a*2} & ${a*2*k} \\end{pmatrix}$，则 $r(A)$ = ____`,
                    answer: '1',
                    explanation: `第二行是第一行的 ${2} 倍，所以秩为 1`
                };
            },
            // 特征值
            () => {
                const a = this.randInt(1, 4);
                const b = this.randInt(1, 4);
                return {
                    question: `设对角矩阵 $A = \\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$，则 $A$ 的特征值为 ____`,
                    answer: `${a}, ${b}`,
                    explanation: `对角矩阵的特征值就是对角线上的元素：$\\lambda_1 = ${a}$，$\\lambda_2 = ${b}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    // ==================== 概率论模板 ====================

    /**
     * 概率计算模板
     */
    probabilityBasic() {
        const templates = [
            // 古典概型
            () => {
                const n = this.randInt(3, 6);
                const favorable = this.randInt(1, n);
                return {
                    question: `袋中有 ${n} 个球，其中 ${favorable} 个红球，其余为白球。随机取一球，取到红球的概率为 ____`,
                    answer: this.formatFraction(favorable, n),
                    explanation: `古典概型：$P = \\frac{红球数}{总球数} = ${this.formatFraction(favorable, n)}$`
                };
            },
            // 独立事件
            () => {
                const p1Num = this.randInt(1, 4);
                const p2Num = this.randInt(1, 4);
                return {
                    question: `设事件 $A$、$B$ 相互独立，$P(A) = ${this.formatFraction(p1Num, 5)}$，$P(B) = ${this.formatFraction(p2Num, 5)}$，则 $P(AB)$ = ____`,
                    answer: this.formatFraction(p1Num * p2Num, 25),
                    explanation: `独立事件：$P(AB) = P(A) \\cdot P(B) = ${this.formatFraction(p1Num, 5)} \\times ${this.formatFraction(p2Num, 5)} = ${this.formatFraction(p1Num * p2Num, 25)}$`
                };
            },
            // 期望值
            () => {
                const lambda = this.randInt(2, 5);
                return {
                    question: `设随机变量 $X$ 服从参数为 $${lambda}$ 的泊松分布，则 $E(X)$ = ____`,
                    answer: `${lambda}`,
                    explanation: `泊松分布 $X \\sim P(\\lambda)$ 的期望 $E(X) = \\lambda = ${lambda}$`
                };
            },
            // 方差
            () => {
                const n = this.randInt(5, 10);
                const p = this.randChoice([0.2, 0.3, 0.4, 0.5]);
                const variance = n * p * (1 - p);
                return {
                    question: `设随机变量 $X \\sim B(${n}, ${p})$，则 $D(X)$ = ____`,
                    answer: `${variance}`,
                    explanation: `二项分布 $X \\sim B(n, p)$ 的方差 $D(X) = np(1-p) = ${n} \\times ${p} \\times ${1-p} = ${variance}$`
                };
            }
        ];
        return this.randChoice(templates)();
    },

    // ==================== 选择题生成 ====================

    /**
     * 生成选择题（带干扰项）
     */
    generateChoiceQuestion(template) {
        const base = template();
        const correctAnswer = base.answer;

        // 生成干扰项
        const distractors = this.generateDistractors(correctAnswer, base.question);

        // 组合选项
        const allOptions = [correctAnswer, ...distractors.slice(0, 3)];
        const shuffled = this.shuffle(allOptions);
        const correctIndex = shuffled.indexOf(correctAnswer);
        const letters = ['A', 'B', 'C', 'D'];

        return {
            type: 'choice',
            question: base.question.replace(' = ____', ''),
            options: shuffled.map((opt, i) => `${letters[i]}. $${opt}$`),
            answer: letters[correctIndex],
            explanation: base.explanation,
            source: 'template'
        };
    },

    /**
     * 生成干扰项
     */
    generateDistractors(correct, question) {
        const distractors = [];
        const numCorrect = parseFloat(correct);

        if (!isNaN(numCorrect)) {
            // 数值型答案：生成相近的错误答案
            distractors.push(`${numCorrect + 1}`);
            distractors.push(`${numCorrect - 1}`);
            distractors.push(`${numCorrect * 2}`);
            distractors.push(`${-numCorrect}`);
        } else {
            // 非数值型：生成变体
            distractors.push(correct.replace(/\+/g, '-'));
            distractors.push(correct + ' + C');
            distractors.push('0');
            distractors.push('1');
        }

        return distractors.filter(d => d !== correct);
    },

    // ==================== 批量生成 ====================

    /**
     * 批量生成题目
     * @param {Object} config - 配置
     * @returns {Array} 题目数组
     */
    generateBatch(config) {
        const {
            subject = 'all',
            difficulty = 'all',
            type = 'all',
            count = 10
        } = config;

        const questions = [];
        const templates = this.getTemplates(subject, difficulty);

        for (let i = 0; i < count; i++) {
            const template = this.randChoice(templates);
            const base = template();

            let question;
            if (type === 'choice' || (type === 'all' && Math.random() < 0.5)) {
                question = this.generateChoiceQuestion(template);
            } else {
                question = {
                    type: 'blank',
                    question: base.question,
                    answer: base.answer,
                    explanation: base.explanation,
                    source: 'template'
                };
            }

            question.subject = this.inferSubject(template);
            question.difficulty = difficulty === 'all' ? this.randChoice(['basic', 'intermediate']) : difficulty;
            question.knowledgePoints = [];

            questions.push(question);
        }

        return questions;
    },

    /**
     * 获取对应的模板
     */
    getTemplates(subject, difficulty) {
        const allTemplates = [];

        if (subject === 'all' || subject === 'calculus') {
            allTemplates.push(
                () => this.limitBasic(),
                () => this.derivativeBasic(),
                () => this.integralBasic()
            );
        }
        if (subject === 'all' || subject === 'linear') {
            allTemplates.push(
                () => this.determinantBasic(),
                () => this.matrixBasic()
            );
        }
        if (subject === 'all' || subject === 'probability') {
            allTemplates.push(
                () => this.probabilityBasic()
            );
        }

        return allTemplates.length > 0 ? allTemplates : [() => this.limitBasic()];
    },

    /**
     * 推断学科
     */
    inferSubject(template) {
        const name = template.name || template.toString();
        if (name.includes('limit') || name.includes('derivative') || name.includes('integral')) {
            return 'calculus';
        }
        if (name.includes('determinant') || name.includes('matrix')) {
            return 'linear';
        }
        if (name.includes('probability')) {
            return 'probability';
        }
        return 'calculus';
    },

    /**
     * 初始化题库（生成初始题目）
     * @param {number} count - 生成数量
     * @returns {Array} 题目数组
     */
    initializeQuestionBank(count = 200) {
        const questions = [];
        const subjects = ['calculus', 'linear', 'probability'];
        const difficulties = ['basic', 'intermediate', 'advanced'];
        const types = ['choice', 'blank'];

        // 均匀分布生成
        const perCategory = Math.ceil(count / (subjects.length * difficulties.length));

        subjects.forEach(subject => {
            difficulties.forEach(difficulty => {
                const batch = this.generateBatch({
                    subject,
                    difficulty,
                    type: 'all',
                    count: perCategory
                });

                batch.forEach(q => {
                    q.subject = subject;
                    q.difficulty = difficulty;
                });

                questions.push(...batch);
            });
        });

        return questions.slice(0, count);
    }
};
