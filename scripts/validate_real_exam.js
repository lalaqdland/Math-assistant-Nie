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
const REVIEW_DIR = path.join(__dirname, '..', 'review');
const EXPECTED_YEARS = [2022, 2023, 2024, 2025, 2026];
const EXPECTED_QUESTION_COUNTS = {
    choice: 10,  // 选择题
    blank: 6,    // 填空题
    solve: 9     // 解答题
};

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.json', '.candidate.json'];

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
 * @param {boolean} isCandidate - 是否为候选文件
 * @returns {Object} 验证结果 {valid: boolean, errors: string[], warnings: string[]}
 */
function validateChoiceQuestion(question, year, isCandidate = false) {
    const errors = [];
    const warnings = [];
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
        if (isCandidate) {
            warnings.push(`选择题选项数量不正确: 期望4个, 实际${question.options ? question.options.length : 0}个`);
        } else {
            errors.push('选择题必须有4个选项');
        }
    } else {
        // 检查选项格式
        question.options.forEach((option, index) => {
            if (!/^A\.|B\.|C\.|D\.|A |B |C |D /.test(option)) {
                warnings.push(`选项 ${index + 1} 格式不正确: ${option}`);
            }
        });
    }
    if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
        if (isCandidate) {
            warnings.push(`答案格式不正确: ${question.answer}`);
        } else {
            errors.push(`答案必须是A/B/C/D之一, 实际为: ${question.answer}`);
        }
    }

    // 候选文件可以没有解析和知识点
    if (!isCandidate) {
        if (!question.explanation || question.explanation.trim().length === 0) {
            errors.push('解析内容不能为空');
        }
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            errors.push('知识点不能为空');
        }
    } else {
        if (!question.explanation || question.explanation.trim().length === 0) {
            warnings.push('解析内容为空');
        }
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            warnings.push('知识点为空');
        }
    }

    return { valid: errors.length === 0, errors, warnings };
}

/**
 * 验证填空题格式
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @param {boolean} isCandidate - 是否为候选文件
 * @returns {Object} 验证结果 {valid: boolean, errors: string[], warnings: string[]}
 */
function validateBlankQuestion(question, year, isCandidate = false) {
    const errors = [];
    const warnings = [];
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
        if (isCandidate) {
            warnings.push('答案为空');
        } else {
            errors.push('答案不能为空');
        }
    }

    // 候选文件可以没有解析和知识点
    if (!isCandidate) {
        if (!question.explanation || question.explanation.trim().length === 0) {
            errors.push('解析内容不能为空');
        }
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            errors.push('知识点不能为空');
        }
    } else {
        if (!question.explanation || question.explanation.trim().length === 0) {
            warnings.push('解析内容为空');
        }
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            warnings.push('知识点为空');
        }
    }

    return { valid: errors.length === 0, errors, warnings };
}

/**
 * 验证解答题格式
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @param {boolean} isCandidate - 是否为候选文件
 * @returns {Object} 验证结果 {valid: boolean, errors: string[], warnings: string[]}
 */
function validateSolveQuestion(question, year, isCandidate = false) {
    const errors = [];
    const warnings = [];
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
        if (isCandidate) {
            warnings.push('解题步骤为空');
        } else {
            errors.push('解题步骤不能为空');
        }
    }

    // 分数检查
    if (typeof question.score !== 'number' || question.score <= 0) {
        if (isCandidate) {
            warnings.push(`分数格式不正确: ${question.score}`);
        } else {
            errors.push(`分数必须是正数, 实际为: ${question.score}`);
        }
    }

    // 候选文件可以没有知识点
    if (!isCandidate) {
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            errors.push('知识点不能为空');
        }
    } else {
        if (!Array.isArray(question.knowledgePoints) || question.knowledgePoints.length === 0) {
            warnings.push('知识点为空');
        }
    }

    return { valid: errors.length === 0, errors, warnings };
}

/**
 * 验证单个题目
 * @param {Object} question - 题目对象
 * @param {number} year - 年份
 * @param {boolean} isCandidate - 是否为候选文件
 * @returns {Object} 验证结果 {valid: boolean, errors: string[], warnings: string[]}
 */
function validateQuestion(question, year, isCandidate = false) {
    switch (question.type) {
        case 'choice':
            return validateChoiceQuestion(question, year, isCandidate);
        case 'blank':
            return validateBlankQuestion(question, year, isCandidate);
        case 'solve':
            return validateSolveQuestion(question, year, isCandidate);
        default:
            return { valid: false, errors: [`未知的题目类型: ${question.type}`], warnings: [] };
    }
}

/**
 * 验证整个年份的数据文件
 * @param {Object[]} questions - 题目数组
 * @param {number} year - 年份
 * @param {boolean} isCandidate - 是否为候选文件
 * @returns {Object} 验证结果
 */
function validateYearData(questions, year, isCandidate = false) {
    const results = {
        year,
        valid: true,
        totalQuestions: questions.length,
        questionCounts: { choice: 0, blank: 0, solve: 0 },
        errors: [],
        warnings: [],
        isCandidate
    };

    // 统计题目类型
    questions.forEach(q => {
        if (results.questionCounts.hasOwnProperty(q.type)) {
            results.questionCounts[q.type]++;
        }
    });

    // 检查题目数量（仅对正式文件）
    if (!isCandidate) {
        Object.keys(EXPECTED_QUESTION_COUNTS).forEach(type => {
            const expected = EXPECTED_QUESTION_COUNTS[type];
            const actual = results.questionCounts[type];
            if (actual !== expected) {
                results.warnings.push(`${type}题数量不匹配: 期望${expected}题, 实际${actual}题`);
            }
        });
    }

    // 验证每个题目
    questions.forEach((question, index) => {
        const questionResult = validateQuestion(question, year, isCandidate);
        if (!questionResult.valid) {
            results.valid = false;
            results.errors.push(`第${index + 1}题 (${question.id}): ${questionResult.errors.join(', ')}`);
        }
        if (questionResult.warnings && questionResult.warnings.length > 0) {
            results.warnings.push(`第${index + 1}题 (${question.id}): ${questionResult.warnings.join(', ')}`);
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
                warnings: [],
                isCandidate: false
            };
        }

        // 检查是否为候选文件
        const isCandidate = filePath.endsWith('.candidate.json');
        return validateYearData(questions, year, isCandidate);
    } catch (error) {
        return {
            year,
            valid: false,
            errors: [`文件解析失败: ${error.message}`],
            warnings: [],
            isCandidate: false
        };
    }
}

/**
 * 查找指定年份的所有相关文件
 * @param {number} year - 年份
 * @returns {Object} 文件路径对象
 */
function findYearFiles(year) {
    const files = {
        final: null,
        candidate: null
    };

    // 检查正式文件
    const finalPath = path.join(DATA_DIR, `real-exam-${year}.json`);
    if (fs.existsSync(finalPath)) {
        files.final = finalPath;
    }

    // 检查候选文件
    const candidatePath = path.join(DATA_DIR, `real-exam-${year}.candidate.json`);
    if (fs.existsSync(candidatePath)) {
        files.candidate = candidatePath;
    }

    return files;
}

/**
 * 主验证函数
 * @returns {Object} 验证结果汇总
 */
function validateAll() {
    const summary = {
        totalFiles: 0,
        validFiles: 0,
        invalidFiles: 0,
        candidateFiles: 0,
        totalErrors: 0,
        totalWarnings: 0,
        results: []
    };

    console.log('🔍 开始验证历年真题数据...\n');

    EXPECTED_YEARS.forEach(year => {
        const yearFiles = findYearFiles(year);

        if (!yearFiles.final && !yearFiles.candidate) {
            console.log(`❌ ${year} 年数据文件不存在`);
            summary.invalidFiles++;
            summary.results.push({
                year,
                valid: false,
                errors: ['数据文件不存在'],
                warnings: [],
                isCandidate: false
            });
            return;
        }

        // 优先验证候选文件（如果存在）
        const fileToValidate = yearFiles.candidate || yearFiles.final;
        const isCandidate = !!yearFiles.candidate;

        console.log(`📄 验证 ${year} 年${isCandidate ? '候选' : ''}数据文件: ${fileToValidate}`);

        const result = validateFile(fileToValidate, year);
        summary.results.push(result);
        summary.totalFiles++;

        if (isCandidate) {
            summary.candidateFiles++;
        }

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
 * 生成候选文件审核报告
 * @param {Object} summary - 验证结果汇总
 */
function generateReviewReport(summary) {
    const candidateResults = summary.results.filter(r => r.isCandidate);

    if (candidateResults.length === 0) {
        return;
    }

    console.log('\n📋 生成候选文件审核报告...\n');

    candidateResults.forEach(result => {
        const reportPath = path.join(REVIEW_DIR, `${result.year}_review_report.txt`);

        try {
            let report = `考研数学一 ${result.year} 年真题候选数据审核报告\n`;
            report += '='.repeat(50) + '\n\n';
            report += `生成时间: ${new Date().toLocaleString()}\n`;
            report += `验证状态: ${result.valid ? '✅ 通过' : '❌ 失败'}\n`;
            report += `题目总数: ${result.totalQuestions}\n`;
            report += `题目统计: ${result.questionCounts.choice}选择 + ${result.questionCounts.blank}填空 + ${result.questionCounts.solve}解答\n\n`;

            if (result.errors.length > 0) {
                report += '🔴 错误列表:\n';
                result.errors.forEach((error, index) => {
                    report += `   ${index + 1}. ${error}\n`;
                });
                report += '\n';
            }

            if (result.warnings.length > 0) {
                report += '🟡 警告列表 (需要人工审核):\n';
                result.warnings.forEach((warning, index) => {
                    report += `   ${index + 1}. ${warning}\n`;
                });
                report += '\n';
            }

            report += '📝 审核建议:\n';
            if (result.errors.length > 0) {
                report += '   - 修复上述错误后重新验证\n';
            }
            if (result.warnings.length > 0) {
                report += '   - 检查警告项，完善题目数据\n';
                report += '   - 确认答案格式和解析内容\n';
                report += '   - 添加正确的知识点标签\n';
            }
            if (result.valid && result.warnings.length === 0) {
                report += '   - 数据质量良好，可以转换为正式文件\n';
            }

            // 确保review目录存在
            if (!fs.existsSync(REVIEW_DIR)) {
                fs.mkdirSync(REVIEW_DIR, { recursive: true });
            }

            fs.writeFileSync(reportPath, report, 'utf8');
            console.log(`   📄 已生成审核报告: ${reportPath}`);

        } catch (error) {
            console.log(`   ❌ 生成 ${result.year} 年审核报告失败: ${error.message}`);
        }
    });
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
    console.log(`   📝 候选文件: ${summary.candidateFiles}`);
    console.log(`   🔴 总错误数: ${summary.totalErrors}`);
    console.log(`   🟡 总警告数: ${summary.totalWarnings}`);

    if (summary.candidateFiles > 0) {
        console.log('\n📋 已生成候选文件审核报告');
    }

    if (summary.invalidFiles === 0) {
        console.log('\n🎉 所有数据文件验证通过！');
    } else {
        console.log('\n⚠️  发现数据问题，请检查上述错误信息。');
        if (summary.candidateFiles > 0) {
            console.log('   候选文件可能需要人工审核和完善。');
        }
        process.exit(1);
    }
}

// ========== 执行验证 ==========
if (require.main === module) {
    const summary = validateAll();
    generateReviewReport(summary);
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


