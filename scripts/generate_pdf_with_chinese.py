#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF生成工具，支持中文显示
包含中文字体注册功能
"""

import os
import sys
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io

def register_chinese_fonts():
    """
    注册中文字体
    尝试使用系统中的中文字体，如果找不到则使用内置字体
    """
    font_registered = False

    # 尝试注册常见的Windows中文字体
    font_paths = [
        "C:/Windows/Fonts/simhei.ttf",      # 黑体
        "C:/Windows/Fonts/simkai.ttf",      # 楷体
        "C:/Windows/Fonts/simsun.ttc",      # 宋体
        "C:/Windows/Fonts/msyh.ttc",        # 微软雅黑
        "C:/Windows/Fonts/msyhbd.ttc",      # 微软雅黑粗体
    ]

    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                font_name = Path(font_path).stem
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                print(f"注册中文字体: {font_name} ({font_path})")
                font_registered = True
                break
            except Exception as e:
                print(f"注册字体失败 {font_path}: {e}")
                continue

    if not font_registered:
        print("警告: 未找到合适的中文字体，PDF中的中文可能无法正确显示")
        print("建议安装中文字体或将字体文件放在项目目录中")

    return font_registered

def create_pdf_with_text(text_content, output_path, title="Document"):
    """
    创建包含文本内容的PDF

    Args:
        text_content: 文本内容
        output_path: 输出PDF文件路径
        title: PDF标题
    """
    # 注册中文字体
    font_registered = register_chinese_fonts()

    # 创建PDF
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # 设置标题
    c.setFont("Helvetica", 16)  # 先用默认字体设置标题
    c.drawString(50, height - 50, title)

    # 设置正文字体
    y_position = height - 80
    line_height = 14

    # 如果注册了中文字体，使用中文字体，否则使用默认字体
    font_name = "Helvetica"  # 默认字体
    if font_registered:
        # 使用第一个注册的中文字体
        registered_fonts = [name for name in pdfmetrics.getRegisteredFontNames() if name not in ['Helvetica', 'Times-Roman']]
        if registered_fonts:
            font_name = registered_fonts[0]

    c.setFont(font_name, 12)

    # 分行显示文本
    for line in text_content.split('\n'):
        if y_position < 50:  # 如果接近页面底部，新建页面
            c.showPage()
            c.setFont(font_name, 12)
            y_position = height - 50

        # 处理长行自动换行
        words = line.split()
        current_line = ""
        for word in words:
            test_line = current_line + " " + word if current_line else word
            if c.stringWidth(test_line, font_name, 12) < width - 100:
                current_line = test_line
            else:
                if current_line:
                    c.drawString(50, y_position, current_line)
                    y_position -= line_height
                current_line = word

        if current_line:
            c.drawString(50, y_position, current_line)
            y_position -= line_height

    c.save()
    print(f"PDF创建完成: {output_path}")

def create_pdf_from_images_with_metadata(image_files, output_pdf, metadata=None):
    """
    从图片创建PDF，包含元数据支持

    Args:
        image_files: 图片文件列表
        output_pdf: 输出PDF路径
        metadata: 元数据字典，包含标题、作者等信息
    """
    if not image_files:
        print("没有图片文件")
        return False

    try:
        # 注册中文字体（用于可能的文本内容）
        register_chinese_fonts()

        # 创建PDF
        c = canvas.Canvas(output_pdf, pagesize=A4)

        # 添加元数据
        if metadata:
            c.setTitle(metadata.get('title', 'Document'))
            c.setAuthor(metadata.get('author', ''))
            c.setSubject(metadata.get('subject', ''))

        for image_file in image_files:
            if not os.path.exists(image_file):
                print(f"图片文件不存在: {image_file}")
                continue

            try:
                # 读取图片
                img = Image.open(image_file)

                # 获取页面尺寸
                page_width, page_height = A4

                # 计算图片在页面中的位置和大小，保持纵横比
                img_width, img_height = img.size
                aspect_ratio = img_width / img_height

                # 如果图片太宽，调整大小
                if img_width > page_width:
                    img_width = page_width
                    img_height = img_width / aspect_ratio

                # 如果图片太高，调整大小
                if img_height > page_height:
                    img_height = page_height
                    img_width = img_height * aspect_ratio

                # 居中放置图片
                x = (page_width - img_width) / 2
                y = (page_height - img_height) / 2

                # 将PIL图片转换为ImageReader
                img_buffer = io.BytesIO()
                img.save(img_buffer, format='PNG')
                img_buffer.seek(0)
                img_reader = ImageReader(img_buffer)

                # 添加图片到PDF页面
                c.drawImage(img_reader, x, y, width=img_width, height=img_height)

                # 新建页面
                c.showPage()

            except Exception as e:
                print(f"处理图片错误 {image_file}: {e}")
                continue

        # 保存PDF
        c.save()
        print(f"PDF创建完成: {output_pdf}")
        return True

    except Exception as e:
        print(f"创建PDF错误: {e}")
        return False

def main():
    """主函数 - 示例用法"""
    if len(sys.argv) < 2:
        print("用法:")
        print("  生成文本PDF: python generate_pdf_with_chinese.py text <输出文件> <标题>")
        print("  生成图片PDF: python generate_pdf_with_chinese.py images <输出文件> <图片文件1> [图片文件2] ...")
        return

    command = sys.argv[1]

    if command == "text":
        if len(sys.argv) < 4:
            print("文本模式需要输出文件和标题参数")
            return

        output_file = sys.argv[2]
        title = sys.argv[3]

        # 示例文本内容
        sample_text = """这是一段示例中文文本。
用于测试PDF中的中文字体显示效果。

如果中文字体注册成功，这段文本应该能够正确显示中文字符。
否则可能会显示为乱码或方块字符。

PDF生成工具 - 中文支持版本
"""

        create_pdf_with_text(sample_text, output_file, title)

    elif command == "images":
        if len(sys.argv) < 4:
            print("图片模式需要输出文件和至少一个图片文件")
            return

        output_file = sys.argv[2]
        image_files = sys.argv[3:]

        metadata = {
            'title': '图片合集PDF',
            'author': 'PDF生成工具',
            'subject': '从图片生成PDF文档'
        }

        create_pdf_from_images_with_metadata(image_files, output_file, metadata)

    else:
        print(f"未知命令: {command}")

if __name__ == "__main__":
    main()
