/**
 * 历年真题数据验证脚本 - 考研数学学习助手
 * 用于校验 data/real-exam-*.json 文件的数据完整性和格式正确性
 *
 * Phase 19: 数据验证 - 校验历年真题数据的完整性和格式
 */

const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED_YEARS = [2022, 2023, 2024];
const EXPECTED_QUESTION_COUNTS = {
    choice: 10,  // 选择题
    blank: 6,    // 填空题
    solve: 9     // 解答题
};

// ========== 验证规则 ==========

/**
 * 验证题目ID格式
 * @param {string} id - 题目ID
 * @param {string} expectedPrefix - 期望的前缀
 * @returns {boolean} 是否有效
 */
function validateQuestionId(id, expectedPrefix) {
    const pattern = new RegExp(`^${expectedPrefix}-[cbs]-\\d+$`);
    return pattern.test(id);
}

/**
 * 验证选择题格式
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @returns {Object} 验证结果 {valid: boolean, errors: string[]}
 */
function validateChoiceQuestion(question, year) {
    const errors = [];
    const yearPrefix = year.toString();

    // 基本字段检查
    if (!question.id || !validateQuestionId(question.id, yearPrefix)) {
        errors.push(`无效的题目ID: ${question.id}`);
    }
    if (question.type !== 'choice') {
        errors.push(`选择题类型应为 'choice', 实际为: ${question.type}`);
    }
    if (!question.content || question.content.trim().length === 0) {
        errors.push('题目内容不能为空');
    }
    if (!Array.isArray(question.options) || question.options.length !== 4) {
        errors.push('选择题必须有4个选项');
    } else {
        // 检查选项格式
        question.options.forEach((option, index) => {
            if (!/^A\.|B\.|C\.|D\.|A |B |C |D /.test(option)) {
                errors.push(`选项 ${index + 1} 格式不正确: ${option}`);
            }
        });
    }
    if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
        errors.push(`答案必须是A/B/C/D之一, 实际为: ${question.answer}`);
    }
    if (!question.explanation || question.explanation.trim().length === 0) {
        errors.push('解析内容不能为空');
    }
    if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
        errors.push('知识点不能为空');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * 验证填空题格式
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @returns {Object} 验证结果 {valid: boolean, errors: string[]}
 */
function validateBlankQuestion(question, year) {
    const errors = [];
    const yearPrefix = year.toString();

    // 基本字段检查
    if (!question.id || !validateQuestionId(question.id, yearPrefix)) {
        errors.push(`无效的题目ID: ${question.id}`);
    }
    if (question.type !== 'blank') {
        errors.push(`填空题类型应为 'blank', 实际为: ${question.type}`);
    }
    if (!question.content || question.content.trim().length === 0) {
        errors.push('题目内容不能为空');
    }
    if (!question.answer || question.answer.toString().trim().length === 0) {
        errors.push('答案不能为空');
    }
    if (!question.explanation || question.explanation.trim().length === 0) {
        errors.push('解析内容不能为空');
    }
    if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
        errors.push('知识点不能为空');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * 验证解答题格式
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @returns {Object} 验证结果 {valid: boolean, errors: string[]}
 */
function validateSolveQuestion(question, year) {
    const errors = [];
    const yearPrefix = year.toString();

    // 基本字段检查
    if (!question.id || !validateQuestionId(question.id, yearPrefix)) {
        errors.push(`无效的题目ID: ${question.id}`);
    }
    if (question.type !== 'solve') {
        errors.push(`解答题类型应为 'solve', 实际为: ${question.type}`);
    }
    if (!question.content || question.content.trim().length === 0) {
        errors.push('题目内容不能为空');
    }
    if (!question.solution || question.solution.trim().length === 0) {
        errors.push('解题步骤不能为空');
    }
    if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
        errors.push('知识点不能为空');
    }
    if (typeof question.score !== 'number' || question.score <= 0) {
        errors.push(`分数必须是正数, 实际为: ${question.score}`);
    }

    return { valid: errors.length === 0, errors };
}

/**
 * 验证单个题目
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @returns {Object} 验证结果 {valid: boolean, errors: string[]}
 */
function validateQuestion(question, year) {
    switch (question.type) {
        case 'choice':
            return validateChoiceQuestion(question, year);
        case 'blank':
            return validateBlankQuestion(question, year);
        case 'solve':
            return validateSolveQuestion(question, year);
        default:
            return { valid: false, errors: [`未知的题目类型: ${question.type}`] };
    }
}

/**
 * 验证整个年份的数据文件
 * @param {Object[]} questions - 题目数组
 * @param {number} year - 年份
 * @returns {Object} 验证结果
 */
function validateYearData(questions, year) {
    const results = {
        year,
        valid: true,
        totalQuestions: questions.length,
        questionCounts: { choice: 0, blank: 0, solve: 0 },
        errors: [],
        warnings: []
    };

    // 统计题目类型
    questions.forEach(q => {
        if (results.questionCounts.hasOwnProperty(q.type)) {
            results.questionCounts[q.type]++;
        }
    });

    // 检查题目数量
    Object.keys(EXPECTED_QUESTION_COUNTS).forEach(type => {
        const expected = EXPECTED_QUESTION_COUNTS[type];
        const actual = results.questionCounts[type];
        if (actual !== expected) {
            results.warnings.push(`${type}题数量不匹配: 期望${expected}题, 实际${actual}题`);
        }
    });

    // 验证每个题目
    questions.forEach((question, index) => {
        const questionResult = validateQuestion(question, year);
        if (!questionResult.valid) {
            results.valid = false;
            results.errors.push(`第${index + 1}题 (${question.id}): ${questionResult.errors.join(', ')}`);
        }
    });

    // 检查ID唯一性
    const ids = questions.map(q => q.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        results.valid = false;
        results.errors.push(`发现重复的题目ID: ${duplicateIds.join(', ')}`);
    }

    return results;
}

/**
 * 验证单个JSON文件
 * @param {string} filePath - 文件路径
 * @param {number} year - 年份
 * @returns {Object} 验证结果
 */
function validateFile(filePath, year) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const questions = JSON.parse(content);

        if (!Array.isArray(questions)) {
            return {
                year,
                valid: false,
                errors: ['文件内容必须是题目数组'],
                warnings: []
            };
        }

        return validateYearData(questions, year);
    } catch (error) {
        return {
            year,
            valid: false,
            errors: [`文件解析失败: ${error.message}`],
            warnings: []
        };
    }
}

/**
 * 主验证函数
 * @returns {Object} 验证结果汇总
 */
function validateAll() {
    const summary = {
        totalFiles: EXPECTED_YEARS.length,
        validFiles: 0,
        invalidFiles: 0,
        totalErrors: 0,
        totalWarnings: 0,
        results: []
    };

    console.log('🔍 开始验证历年真题数据...\n');

    EXPECTED_YEARS.forEach(year => {
        const filePath = path.join(DATA_DIR, `real-exam-${year}.json`);
        console.log(`📄 验证 ${year} 年数据文件: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.log(`❌ 文件不存在: ${filePath}\n`);
            summary.invalidFiles++;
            summary.results.push({
                year,
                valid: false,
                errors: ['文件不存在'],
                warnings: []
            });
            return;
        }

        const result = validateFile(filePath, year);
        summary.results.push(result);

        if (result.valid) {
            summary.validFiles++;
            console.log(`✅ ${year} 年数据验证通过`);
        } else {
            summary.invalidFiles++;
            console.log(`❌ ${year} 年数据验证失败`);
        }

        if (result.errors.length > 0) {
            summary.totalErrors += result.errors.length;
            console.log('   错误:');
            result.errors.forEach(error => console.log(`     - ${error}`));
        }

        if (result.warnings.length > 0) {
            summary.totalWarnings += result.warnings.length;
            console.log('   警告:');
            result.warnings.forEach(warning => console.log(`     - ${warning}`));
        }

        console.log(`   题目统计: ${result.questionCounts.choice}选择 + ${result.questionCounts.blank}填空 + ${result.questionCounts.solve}解答 = ${result.totalQuestions}题\n`);
    });

    return summary;
}

/**
 * 输出验证结果摘要
 * @param {Object} summary - 验证结果汇总
 */
function printSummary(summary) {
    console.log('📊 验证结果摘要:');
    console.log(`   总文件数: ${summary.totalFiles}`);
    console.log(`   ✅ 验证通过: ${summary.validFiles}`);
    console.log(`   ❌ 验证失败: ${summary.invalidFiles}`);
    console.log(`   🔴 总错误数: ${summary.totalErrors}`);
    console.log(`   🟡 总警告数: ${summary.totalWarnings}`);

    if (summary.invalidFiles === 0) {
        console.log('\n🎉 所有数据文件验证通过！');
    } else {
        console.log('\n⚠️  发现数据问题，请检查上述错误信息。');
        process.exit(1);
    }
}

// ========== 执行验证 ==========
if (require.main === module) {
    const summary = validateAll();
    printSummary(summary);
}

module.exports = {
    validateFile,
    validateYearData,
    validateQuestion,
    validateChoiceQuestion,
    validateBlankQuestion,
    validateSolveQuestion
};
