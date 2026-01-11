#!/usr/bin/env python3
"""
历年真题PDF导入脚本 - 考研数学学习助手
用于从PDF文件中提取和解析历年真题数据

Phase 19: 历年真题数据录入 - 自动导入工具
"""

import os
import re
import json
import csv
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import fitz  # PyMuPDF for PDF text extraction
import pytesseract
from PIL import Image
import io

# 知识点映射数据（从前端系统复制）
KNOWLEDGE_POINT_MAPPING = {
    # 微积分关键词
    '极限': ['calc-1-3', 'calc-1-4', 'calc-1-5'],
    '导数': ['calc-2-1', 'calc-2-2'],
    '微分': ['calc-2-1', 'calc-2-2', 'calc-2-3'],
    '不定积分': ['calc-4-1', 'calc-4-2'],
    '定积分': ['calc-5-1', 'calc-5-2'],
    '微分方程': ['calc-7-1', 'calc-7-2'],
    '多元微分': ['calc-8-1', 'calc-8-2'],
    '重积分': ['calc-9-1', 'calc-9-2'],
    '级数': ['calc-10-1', 'calc-10-2'],

    # 线代关键词
    '行列式': ['la-1-1', 'la-1-2'],
    '矩阵': ['la-2-1', 'la-2-2'],
    '特征值': ['la-3-1', 'la-3-2'],
    '特征向量': ['la-3-1', 'la-3-2'],
    '线性方程组': ['la-4-1', 'la-4-2'],
    '二次型': ['la-5-1', 'la-5-2'],
    '相似对角化': ['la-6-1', 'la-6-2'],

    # 概率论关键词
    '概率': ['prob-1-1', 'prob-1-2'],
    '随机变量': ['prob-2-1', 'prob-2-2'],
    '分布': ['prob-2-1', 'prob-2-2', 'prob-2-3'],
    '期望': ['prob-4-1'],
    '方差': ['prob-4-2'],
    '大数定律': ['prob-5-1'],
    '中心极限定理': ['prob-5-2']
}


@dataclass
class QuestionCandidate:
    """题目候选对象"""
    id: str
    type: str  # 'choice', 'blank', 'solve'
    content: str
    options: Optional[List[str]] = None
    answer: Optional[str] = None
    accepted_answers: Optional[List[str]] = None
    score: Optional[int] = None
    solution: Optional[str] = None
    explanation: str = ""
    knowledge_points: List[str] = None
    page_num: int = 0
    confidence: float = 0.0
    parsing_notes: str = ""


class KnowledgePointMapper:
    """知识点映射器"""

    def __init__(self):
        self.keyword_mapping = KNOWLEDGE_POINT_MAPPING

    def infer_knowledge_points(self, question_text: str) -> List[str]:
        """根据题目内容推断知识点"""
        question_lower = question_text.lower()
        matched_points = set()

        for keyword, points in self.keyword_mapping.items():
            if keyword.lower() in question_lower:
                matched_points.update(points)

        return list(matched_points)


class PDFTextExtractor:
    """PDF文本提取器"""

    def __init__(self):
        self.ocr_fallback = True

    def extract_text(self, pdf_path: str) -> List[Tuple[int, str]]:
        """从PDF提取文本，按页返回"""
        pages_text = []

        try:
            doc = fitz.open(pdf_path)

            for page_num in range(len(doc)):
                page = doc.load_page(page_num)

                # 直接提取文本
                text = page.get_text()

                # 如果文本太少，尝试OCR（如果可用）
                if len(text.strip()) < 100 and self.ocr_fallback:
                    try:
                        ocr_text = self._extract_with_ocr(page)
                        if ocr_text:
                            text = ocr_text
                    except Exception as ocr_error:
                        print(f"OCR failed for page {page_num + 1}, using original text: {ocr_error}")

                pages_text.append((page_num + 1, text.strip()))

            doc.close()

        except Exception as e:
            print(f"Error extracting text from {pdf_path}: {e}")
            return []

        return pages_text

    def _extract_with_ocr(self, page) -> str:
        """使用OCR提取文本"""
        try:
            # 检查tesseract是否可用
            import pytesseract
            pytesseract.get_tesseract_version()  # 这会抛出异常如果不可用

            # 将页面转换为图像
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x缩放提高质量
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))

            # OCR识别
            text = pytesseract.image_to_string(img, lang='chi_sim+eng')
            return text
        except ImportError:
            print("pytesseract not available, OCR disabled")
            return ""
        except Exception as e:
            print(f"OCR failed: {e}")
            return ""


class QuestionParser:
    """题目解析器"""

    def __init__(self):
        # 题目类型识别模式 - 支持多种格式
        self.choice_pattern = re.compile(r'\([A-D]\)', re.MULTILINE)  # 包含选项的认为是选择题
        self.blank_pattern = re.compile(r'____|（\s*）|【\s*】', re.MULTILINE)  # 填空符号
        self.solve_pattern = re.compile(r'解[：:]|证明|计算|求|解：', re.MULTILINE)  # 解答题关键词

        # 选项识别模式 - 支持多种格式
        self.option_pattern = re.compile(r'\(([A-D])\)|([A-D])[.、]\s*([^(\n]+)', re.MULTILINE)

        # 答案识别模式
        self.answer_pattern = re.compile(r'答案[：:]\s*([A-D]|\d+|[^。\n]+)', re.MULTILINE)

        # 分数识别模式
        self.score_pattern = re.compile(r'\((\d+)分\)|(\d+)分', re.MULTILINE)

    def parse_questions(self, pages_text: List[Tuple[int, str]], year: int) -> List[QuestionCandidate]:
        """解析题目"""
        questions = []

        for page_num, text in pages_text:
            page_questions = self._parse_page_questions(text, year, page_num)
            questions.extend(page_questions)

        print(f"Parsed {len(questions)} questions total")
        return questions

    def _parse_page_questions(self, text: str, year: int, page_num: int) -> List[QuestionCandidate]:
        """解析单页题目"""
        questions = []

        # 清理文本
        text = self._clean_text(text)

        # 分割题目（通常以数字开头）
        question_blocks = self._split_questions(text)

        for i, block in enumerate(question_blocks):
            question = self._parse_single_question(block, year, i + 1, page_num)
            if question:
                questions.append(question)

        return questions

    def _clean_text(self, text: str) -> str:
        """清理文本"""
        # 移除多余空白
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def _split_questions(self, text: str) -> List[str]:
        """分割题目块"""
        # 使用正则表达式在连续文本中分割题目
        # 匹配题目开始模式：(数字) 或 一、 或 数字. 等
        question_pattern = r'(\([0-9]+\)[^(\(]*?)(?=\([0-9]+\)|$)'

        questions = re.findall(question_pattern, text, re.DOTALL)

        # 如果上面的模式找不到，尝试更简单的分割
        if not questions:
            # 按括号中的数字分割
            parts = re.split(r'(\([0-9]+\))', text)
            questions = []
            current_question = ""

            for i, part in enumerate(parts):
                if re.match(r'^\([0-9]+\)$', part):
                    if current_question:
                        questions.append(current_question.strip())
                    current_question = part
                else:
                    current_question += part

            if current_question:
                questions.append(current_question.strip())

        print(f"Split into {len(questions)} question blocks")
        for i, q in enumerate(questions[:3]):  # 只显示前3个
            print(f"Question {i+1}: {q[:100]}...")

        return questions

    def _is_option_line(self, line: str) -> bool:
        """检查是否是选项行"""
        return bool(re.match(r'^\(?[A-D]\)?\.?\s', line))

    def _parse_single_question(self, block: str, year: int, question_num: int, page_num: int) -> Optional[QuestionCandidate]:
        """解析单个题目"""
        try:
            # 确定题目类型
            question_type = self._determine_question_type(block)

            if not question_type:
                return None

            # 生成题目ID
            type_prefix = {'choice': 'c', 'blank': 'b', 'solve': 's'}[question_type]
            question_id = f"{year}-{type_prefix}-{question_num}"

            question = QuestionCandidate(
                id=question_id,
                type=question_type,
                content=block,
                page_num=page_num,
                confidence=0.5,  # 基础置信度
                parsing_notes="自动解析，需要人工审核"
            )

            # 根据类型解析具体内容
            if question_type == 'choice':
                self._parse_choice_question(question, block)
            elif question_type == 'blank':
                self._parse_blank_question(question, block)
            elif question_type == 'solve':
                self._parse_solve_question(question, block)

            return question

        except Exception as e:
            print(f"Error parsing question {question_num}: {e}")
            return None

    def _determine_question_type(self, block: str) -> Optional[str]:
        """确定题目类型"""
        # 检查是否有选项（选择题特征）
        if self.choice_pattern.search(block):
            return 'choice'

        # 检查是否有填空符号
        if self.blank_pattern.search(block):
            return 'blank'

        # 检查是否有解答关键词或分数（解答题特征）
        if self.solve_pattern.search(block) or self.score_pattern.search(block):
            return 'solve'

        # 如果都不匹配，可能是解答题
        return 'solve'

    def _parse_choice_question(self, question: QuestionCandidate, block: str):
        """解析选择题"""
        # 从题目文本中提取选项 (A) (B) (C) (D) 格式
        option_pattern = r'\(([A-D])\)'
        option_matches = list(re.finditer(option_pattern, block))

        if option_matches:
            # 找到选项，分割题目内容和选项
            first_option_pos = option_matches[0].start()
            question.content = block[:first_option_pos].strip()

            # 提取选项
            options = []
            for match in option_matches[:4]:  # 最多4个选项
                option_letter = match.group(1)
                # 找到下一个选项或文本结束的位置
                next_option_pos = len(block)
                for next_match in option_matches:
                    if next_match.start() > match.start():
                        next_option_pos = next_match.start()
                        break

                option_text = block[match.end():next_option_pos].strip()
                options.append(f"{option_letter}. {option_text}")

            question.options = options
        else:
            # 如果没有找到选项格式，整个block作为题目内容
            question.content = block
            question.options = []

        # 尝试提取答案
        answer_match = self.answer_pattern.search(block)
        if answer_match:
            question.answer = answer_match.group(1).strip()

    def _parse_blank_question(self, question: QuestionCandidate, block: str):
        """解析填空题"""
        # 填空题内容就是整个block
        question.content = block

        # 尝试提取答案
        answer_match = self.answer_pattern.search(block)
        if answer_match:
            answer = answer_match.group(1).strip()
            question.answer = answer
            question.accepted_answers = [answer]

    def _parse_solve_question(self, question: QuestionCandidate, block: str):
        """解析解答题"""
        lines = block.split('\n')
        content_lines = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # 提取分数
            score_match = self.score_pattern.search(line)
            if score_match:
                question.score = int(score_match.group(1))
                # 移除分数信息
                line = self.score_pattern.sub('', line).strip()

            content_lines.append(line)

        question.content = '\n'.join(content_lines)

        # 解答题通常需要完整的答案和解题步骤
        # 这里暂时只设置基本结构


class DataExporter:
    """数据导出器"""

    def __init__(self, output_dir: str = "data", review_dir: str = "review", temp_dir: str = "tmp/exam_pages"):
        self.output_dir = Path(output_dir)
        self.review_dir = Path(review_dir)
        self.temp_dir = Path(temp_dir)

        # 创建目录
        self.output_dir.mkdir(exist_ok=True)
        self.review_dir.mkdir(exist_ok=True)
        self.temp_dir.mkdir(parents=True, exist_ok=True)

    def export_candidate_json(self, questions: List[QuestionCandidate], year: int):
        """导出候选JSON文件"""
        # 转换为字典格式
        question_dicts = []
        for q in questions:
            q_dict = {
                "id": q.id,
                "type": q.type,
                "content": q.content,
                "explanation": q.explanation,
                "knowledgePoints": q.knowledge_points or [],
                "page_num": q.page_num,
                "confidence": q.confidence,
                "parsing_notes": q.parsing_notes
            }

            if q.type == 'choice':
                q_dict.update({
                    "options": q.options or [],
                    "answer": q.answer or ""
                })
            elif q.type == 'blank':
                q_dict.update({
                    "answer": q.answer or "",
                    "acceptedAnswers": q.accepted_answers or []
                })
            elif q.type == 'solve':
                q_dict.update({
                    "score": q.score or 10,
                    "answer": q.answer or "",
                    "solution": q.solution or ""
                })

            question_dicts.append(q_dict)

        # 写入文件
        output_file = self.output_dir / f"real-exam-{year}.candidate.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(question_dicts, f, ensure_ascii=False, indent=2)

        print(f"Exported {len(question_dicts)} candidate questions to {output_file}")

    def export_review_csv(self, questions: List[QuestionCandidate], year: int):
        """导出审核CSV文件"""
        csv_file = self.review_dir / f"{year}_mappings.csv"

        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'type', 'page_num', 'confidence', 'parsing_notes', 'content_preview'])

            for q in questions:
                content_preview = q.content[:100].replace('\n', ' ') + '...'
                writer.writerow([
                    q.id,
                    q.type,
                    q.page_num,
                    q.confidence,
                    q.parsing_notes,
                    content_preview
                ])

        print(f"Exported review CSV to {csv_file}")

    def export_question_bank_json(self, questions: List[Dict], year: int):
        """导出题库格式JSON文件"""
        output_file = self.output_dir / f"real-exam-{year}.question-bank.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

        print(f"Exported {len(questions)} question bank questions to {output_file}")

    def export_page_texts(self, pages_text: List[Tuple[int, str]], year: int):
        """导出页面文本文件"""
        year_dir = self.temp_dir / str(year)
        year_dir.mkdir(exist_ok=True)

        for page_num, text in pages_text:
            page_file = year_dir / f"{page_num:03d}.txt"
            with open(page_file, 'w', encoding='utf-8') as f:
                f.write(text)

        print(f"Exported {len(pages_text)} page text files to {year_dir}")


class QuestionBankConverter:
    """题库格式转换器"""

    def __init__(self):
        self.subject_mapping = {
            'calc': 'calculus',
            'la': 'linear',
            'prob': 'probability'
        }

    def convert_candidates_to_question_bank(self, candidate_questions: List[Dict], year: int) -> List[Dict]:
        """将候选题目转换为题库格式"""
        converted_questions = []

        for candidate in candidate_questions:
            question = self._convert_single_question(candidate, year)
            if question:
                converted_questions.append(question)

        return converted_questions

    def _convert_single_question(self, candidate: Dict, year: int) -> Optional[Dict]:
        """转换单个题目"""
        try:
            # 基本字段映射
            question = {
                'id': f'real-exam-{year}-{candidate["id"]}',
                'type': candidate['type'],
                'subject': self._infer_subject_from_content(candidate['content']),
                'difficulty': 'intermediate',  # 真题默认中等难度
                'source': 'real-exam',
                'createdAt': f'{year}-01-01T00:00:00.000Z',  # 使用年份作为创建时间
                'knowledgePoints': candidate.get('knowledgePoints', []),
                'explanation': candidate.get('explanation', ''),
                'question': self._clean_question_content(candidate['content'])
            }

            # 根据类型添加特定字段
            if candidate['type'] == 'choice':
                question.update({
                    'options': candidate.get('options', []),
                    'answer': candidate.get('answer', '')
                })
            elif candidate['type'] == 'blank':
                question.update({
                    'answer': candidate.get('answer', ''),
                    'acceptedAnswers': candidate.get('acceptedAnswers', [])
                })
            elif candidate['type'] == 'solve':
                question.update({
                    'score': candidate.get('score', 10),
                    'answer': candidate.get('answer', ''),
                    'solution': candidate.get('solution', '')
                })

            return question

        except Exception as e:
            print(f"转换题目失败 {candidate.get('id', 'unknown')}: {e}")
            return None

    def _infer_subject_from_content(self, content: str) -> str:
        """根据内容推断学科"""
        content_lower = content.lower()

        # 检查关键词来判断学科
        if any(word in content_lower for word in ['极限', '导数', '积分', '级数']):
            return 'calculus'
        elif any(word in content_lower for word in ['行列式', '矩阵', '特征值', '线性方程']):
            return 'linear'
        elif any(word in content_lower for word in ['概率', '随机变量', '分布', '期望']):
            return 'probability'

        return 'calculus'  # 默认微积分

    def _clean_question_content(self, content: str) -> str:
        """清理题目内容"""
        # 移除题号前缀
        content = re.sub(r'^\d+\.\s*', '', content.strip())
        # 移除多余空白
        content = re.sub(r'\s+', ' ', content)
        return content.strip()


class ExamImporter:
    """历年真题导入器"""

    def __init__(self):
        self.extractor = PDFTextExtractor()
        self.parser = QuestionParser()
        self.exporter = DataExporter()
        self.knowledge_mapper = KnowledgePointMapper()
        self.converter = QuestionBankConverter()

    def import_year(self, pdf_path: str, year_or_type):
        """导入一年份的真题或合集"""
        print(f"🔄 开始导入: {pdf_path}")

        if year_or_type in ["collection", "answers"]:
            return self.import_collection(pdf_path, year_or_type)
        else:
            return self.import_single_year(pdf_path, year_or_type)

    def import_single_year(self, pdf_path: str, year: int):
        """导入一年份的真题"""
        print(f"🔄 开始导入 {year} 年真题: {pdf_path}")

        # 1. 提取文本
        print("📄 提取PDF文本...")
        pages_text = self.extractor.extract_text(pdf_path)
        if not pages_text:
            print(f"❌ 无法提取 {year} 年PDF文本")
            return False

        # 2. 导出页面文本
        self.exporter.export_page_texts(pages_text, year)

        # 3. 解析题目
        print("🔍 解析题目...")
        questions = self.parser.parse_questions(pages_text, year)
        if not questions:
            print(f"⚠️ 未找到 {year} 年的题目")
            return False

        # 4. 添加知识点推断
        print("🧠 推断知识点...")
        for question in questions:
            knowledge_points = self.knowledge_mapper.infer_knowledge_points(question.content)
            question.knowledge_points = knowledge_points
            if knowledge_points:
                question.confidence += 0.2  # 知识点匹配增加置信度

        print(f"📝 发现 {len(questions)} 个题目候选")

        # 5. 导出候选数据
        self.exporter.export_candidate_json(questions, year)

        # 6. 转换为题库格式并导出
        print("🔄 转换为题库格式...")
        question_bank_questions = self.converter.convert_candidates_to_question_bank(
            [self._candidate_to_dict(q) for q in questions], year
        )
        self.exporter.export_question_bank_json(question_bank_questions, year)

        # 7. 导出审核文件
        self.exporter.export_review_csv(questions, year)

        print(f"✅ {year} 年真题导入完成")
        return True

    def import_collection(self, pdf_path: str, collection_type: str):
        """导入合集PDF"""
        print(f"🔄 开始导入合集: {pdf_path}")

        # 1. 提取文本
        print("📄 提取PDF文本...")
        pages_text = self.extractor.extract_text(pdf_path)
        if not pages_text:
            print(f"❌ 无法提取合集PDF文本")
            return False

        # 2. 按年份分割页面
        year_sections = self._split_collection_by_years(pages_text, collection_type)

        # 3. 对每个年份分别处理
        success_count = 0
        for year, year_pages in year_sections.items():
            if len(year_pages) > 5:  # 只处理有足够内容的年份
                print(f"📝 处理 {year} 年 ({len(year_pages)} 页)...")

                # 导出页面文本
                self.exporter.export_page_texts(year_pages, year)

                # 解析题目
                questions = self.parser.parse_questions(year_pages, year)
                if questions:
                    # 添加知识点推断
                    for question in questions:
                        knowledge_points = self.knowledge_mapper.infer_knowledge_points(question.content)
                        question.knowledge_points = knowledge_points
                        if knowledge_points:
                            question.confidence += 0.2

                    print(f"  发现 {len(questions)} 个题目候选")

                    # 导出候选数据
                    self.exporter.export_candidate_json(questions, year)

                    # 转换为题库格式并导出
                    question_bank_questions = self.converter.convert_candidates_to_question_bank(
                        [self._candidate_to_dict(q) for q in questions], year
                    )
                    self.exporter.export_question_bank_json(question_bank_questions, year)

                    # 导出审核文件
                    self.exporter.export_review_csv(questions, year)

                    success_count += 1
                else:
                    print(f"  ⚠️ 未找到 {year} 年的题目")

        print(f"✅ 合集导入完成，处理了 {success_count} 个年份")
        return success_count > 0

    def _candidate_to_dict(self, candidate: QuestionCandidate) -> Dict:
        """将候选对象转换为字典"""
        result = {
            'id': candidate.id,
            'type': candidate.type,
            'content': candidate.content,
            'explanation': candidate.explanation,
            'knowledgePoints': candidate.knowledge_points or [],
            'page_num': candidate.page_num,
            'confidence': candidate.confidence,
            'parsing_notes': candidate.parsing_notes
        }

        if candidate.type == 'choice':
            result.update({
                'options': candidate.options or [],
                'answer': candidate.answer or ''
            })
        elif candidate.type == 'blank':
            result.update({
                'answer': candidate.answer or '',
                'acceptedAnswers': candidate.accepted_answers or []
            })
        elif candidate.type == 'solve':
            result.update({
                'score': candidate.score or 10,
                'answer': candidate.answer or '',
                'solution': candidate.solution or ''
            })

        return result

    def _split_collection_by_years(self, pages_text: List[Tuple[int, str]], collection_type: str) -> Dict[int, List[Tuple[int, str]]]:
        """按年份分割合集页面"""
        year_sections = {}
        current_year = None
        current_pages = []

        # 年份识别模式
        year_pattern = re.compile(r'(\d{4})年.*?数学')
        answer_year_pattern = re.compile(r'(\d{4})年.*?答案')

        for page_num, text in pages_text:
            # 查找年份标题
            year_match = None
            if collection_type == "collection":
                year_match = year_pattern.search(text)
            else:  # answers
                year_match = answer_year_pattern.search(text)

            if year_match:
                year = int(year_match.group(1))

                # 保存之前年份的页面
                if current_year is not None and current_pages:
                    if current_year not in year_sections:
                        year_sections[current_year] = []
                    year_sections[current_year].extend(current_pages)

                # 开始新年份
                current_year = year
                current_pages = [(page_num, text)]
            else:
                # 继续当前年份
                if current_year is not None:
                    current_pages.append((page_num, text))
                else:
                    # 还没找到第一个年份，暂时归到临时组
                    current_pages.append((page_num, text))

        # 保存最后一个年份
        if current_year is not None and current_pages:
            if current_year not in year_sections:
                year_sections[current_year] = []
            year_sections[current_year].extend(current_pages)

        return year_sections

    def import_all_years(self, pdf_dir: str = "考研真题"):
        """导入所有年份的真题"""
        pdf_dir = Path(pdf_dir)
        if not pdf_dir.exists():
            print(f"❌ PDF目录不存在: {pdf_dir}")
            return

        # PDF文件名到年份的映射
        year_mapping = {
            "2026年考研数学一真题及参考答案.pdf": 2026,
            "2025考研数学（一）真题试卷及解析详细版.pdf": 2025,
            "2024年考研数学一真题及答案.pdf": 2024,
            "2023年考研数学一试题.pdf": 2023,
            "2023年考研数学一参考答案及解析.pdf": 2023,  # 答案文件
            "1987-2022数一真题合集.pdf": "collection",  # 合集需要特殊处理
            "1987-2022数一答案.pdf": "answers",  # 答案合集
        }

        success_count = 0
        for pdf_file in pdf_dir.glob("*.pdf"):
            year = year_mapping.get(pdf_file.name)
            if year is None:
                print(f"⚠️ 跳过未知PDF文件: {pdf_file.name}")
                continue

            try:
                if self.import_year(str(pdf_file), year):
                    success_count += 1
            except Exception as e:
                print(f"❌ 导入 {year} 年失败: {e}")

        print(f"\n📊 导入完成: {success_count} 个年份成功导入")


def main():
    """主函数"""
    print("🚀 考研数学历年真题导入工具")
    print("=" * 50)

    importer = ExamImporter()

    # 检查命令行参数
    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "import-to-app":
            # 导入到应用题库
            import_to_app()
        elif command.endswith('.pdf'):
            # 导入指定PDF
            pdf_path = command
            if len(sys.argv) > 2:
                year = int(sys.argv[2])
            else:
                # 从文件名推断年份
                year_match = re.search(r'(\d{4})', pdf_path)
                year = int(year_match.group(1)) if year_match else 2024

            importer.import_year(pdf_path, year)
        else:
            # 导入指定年份的JSON到应用
            year = int(command)
            import_year_to_app(year)
    else:
        # 导入所有年份
        importer.import_all_years()


def import_to_app():
    """将所有生成的题库JSON导入到应用中"""
    import json
    import os

    print("📥 开始导入题库到应用...")

    # 读取所有题库JSON文件
    data_dir = Path("data")
    if not data_dir.exists():
        print("❌ data目录不存在")
        return

    all_questions = []

    for json_file in data_dir.glob("real-exam-*.question-bank.json"):
        print(f"📖 读取 {json_file.name}...")
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                questions = json.load(f)
                all_questions.extend(questions)
                print(f"  ✓ 加载了 {len(questions)} 道题目")
        except Exception as e:
            print(f"  ❌ 读取失败: {e}")

    if not all_questions:
        print("⚠️ 没有找到题目文件")
        return

    # 生成应用使用的题库格式
    app_question_bank = {
        "questions": all_questions,
        "favorites": [],
        "lastUpdated": datetime.now().isoformat()
    }

    # 保存到应用格式
    output_file = data_dir / "real-exam-complete.question-bank.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(app_question_bank, f, ensure_ascii=False, indent=2)

    print(f"✅ 已生成应用题库文件: {output_file}")
    print(f"📊 共 {len(all_questions)} 道题目")
    print("\n🔄 接下来请在浏览器中打开应用，进入'题库管理'页面，点击'导入题库'按钮选择此文件进行导入。")


def import_year_to_app(year: int):
    """导入指定年份的题库到应用"""
    json_file = Path("data") / f"real-exam-{year}.question-bank.json"
    if not json_file.exists():
        print(f"❌ 文件不存在: {json_file}")
        return

    print(f"📖 读取 {year} 年题库...")
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            questions = json.load(f)

        # 生成应用使用的题库格式
        app_question_bank = {
            "questions": questions,
            "favorites": [],
            "lastUpdated": datetime.now().isoformat()
        }

        # 保存到应用格式
        output_file = Path("data") / f"real-exam-{year}-app.question-bank.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(app_question_bank, f, ensure_ascii=False, indent=2)

        print(f"✅ 已生成 {year} 年应用题库文件: {output_file}")
        print(f"📊 共 {len(questions)} 道题目")

    except Exception as e:
        print(f"❌ 导入失败: {e}")


if __name__ == "__main__":
    main()
