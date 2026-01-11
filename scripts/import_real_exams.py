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
import fitz  # PyMuPDF for PDF text extraction
import pytesseract
from PIL import Image
import io


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
        # 题目类型识别模式
        self.choice_pattern = re.compile(r'^(\d+)\.?\s*\(?([A-D])\)?', re.MULTILINE)
        self.blank_pattern = re.compile(r'(\d+)\.\s*\([^)]*____[^)]*\)', re.MULTILINE)
        self.solve_pattern = re.compile(r'(\d+)\.\s*\([^)]*分[^)]*\)', re.MULTILINE)

        # 选项识别模式
        self.option_pattern = re.compile(r'^([A-D])\.?\s*(.+)$', re.MULTILINE)

        # 答案识别模式
        self.answer_pattern = re.compile(r'答案[：:]\s*([A-D]|\d+|[^。\n]+)', re.MULTILINE)

        # 分数识别模式
        self.score_pattern = re.compile(r'\((\d+)分\)', re.MULTILINE)

    def parse_questions(self, pages_text: List[Tuple[int, str]], year: int) -> List[QuestionCandidate]:
        """解析题目"""
        questions = []

        for page_num, text in pages_text:
            page_questions = self._parse_page_questions(text, year, page_num)
            questions.extend(page_questions)

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
        # 按题号分割
        questions = []
        lines = text.split('\n')

        current_question = []
        for line in lines:
            # 检查是否是新题目的开始
            if re.match(r'^\d+\.', line.strip()):
                if current_question:
                    questions.append('\n'.join(current_question))
                current_question = [line]
            else:
                if current_question:
                    current_question.append(line)

        if current_question:
            questions.append('\n'.join(current_question))

        return questions

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
        if self.option_pattern.search(block):
            return 'choice'

        # 检查是否有填空符号
        if '____' in block or '（　　）' in block:
            return 'blank'

        # 检查是否有分数（解答题特征）
        if self.score_pattern.search(block):
            return 'solve'

        # 默认当作解答题
        return 'solve'

    def _parse_choice_question(self, question: QuestionCandidate, block: str):
        """解析选择题"""
        lines = block.split('\n')
        content_lines = []
        options = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # 检查是否是选项
            option_match = self.option_pattern.match(line)
            if option_match:
                options.append(f"{option_match.group(1)}. {option_match.group(2)}")
            else:
                content_lines.append(line)

        question.content = '\n'.join(content_lines)
        question.options = options[:4]  # 最多4个选项

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

    def export_page_texts(self, pages_text: List[Tuple[int, str]], year: int):
        """导出页面文本文件"""
        year_dir = self.temp_dir / str(year)
        year_dir.mkdir(exist_ok=True)

        for page_num, text in pages_text:
            page_file = year_dir / f"{page_num:03d}.txt"
            with open(page_file, 'w', encoding='utf-8') as f:
                f.write(text)

        print(f"Exported {len(pages_text)} page text files to {year_dir}")


class ExamImporter:
    """历年真题导入器"""

    def __init__(self):
        self.extractor = PDFTextExtractor()
        self.parser = QuestionParser()
        self.exporter = DataExporter()

    def import_year(self, pdf_path: str, year: int):
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

        print(f"📝 发现 {len(questions)} 个题目候选")

        # 4. 导出候选数据
        self.exporter.export_candidate_json(questions, year)

        # 5. 导出审核文件
        self.exporter.export_review_csv(questions, year)

        print(f"✅ {year} 年真题导入完成")
        return True

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
            "1987-2022数一真题合集.pdf": None,  # 需要特殊处理
            "1987-2022数一答案.pdf": None,  # 需要特殊处理
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
        # 导入指定年份
        pdf_path = sys.argv[1]
        if len(sys.argv) > 2:
            year = int(sys.argv[2])
        else:
            # 从文件名推断年份
            year_match = re.search(r'(\d{4})', pdf_path)
            year = int(year_match.group(1)) if year_match else 2024

        importer.import_year(pdf_path, year)
    else:
        # 导入所有年份
        importer.import_all_years()


if __name__ == "__main__":
    main()
