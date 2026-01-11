#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检测仓库中文本文件的编码格式
输出非 UTF-8 编码的文件列表
"""

import os
import sys
import chardet
from pathlib import Path
import io

# Ensure stdout is UTF-8 encoded to avoid terminal garbling when printing Unicode.
# This makes the script more robust when run in terminals whose default encoding is not UTF-8.
try:
    stdout_enc = getattr(sys.stdout, "encoding", None)
    if stdout_enc is None or "utf-8" not in (stdout_enc or "").lower():
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    # If we can't wrap stdout for any reason, continue without failing.
    pass

# 需要检测的文本文件扩展名
TEXT_EXTENSIONS = {
    '.md', '.txt', '.js', '.json', '.html', '.css',
    '.py', '.sh', '.yml', '.yaml', '.xml'
}

# 排除的目录
EXCLUDE_DIRS = {
    '.git', 'node_modules', '__pycache__', '.cursor',
    'encoding-backup', 'temp_images'
}

def is_text_file(filepath):
    """检查文件是否为文本文件"""
    try:
        with open(filepath, 'rb') as f:
            sample = f.read(1024)  # 读取前1024字节进行检测

        # 使用chardet检测编码
        result = chardet.detect(sample)

        # 如果检测到编码且置信度大于0.7，认为可能是文本文件
        if result['encoding'] and result['confidence'] > 0.7:
            return True
        return False
    except Exception:
        return False

def detect_file_encoding(filepath):
    """检测单个文件的编码"""
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()

        # 使用chardet检测编码
        result = chardet.detect(raw_data)

        return {
            'filepath': str(filepath),
            'encoding': result['encoding'],
            'confidence': result['confidence'],
            'language': result.get('language', '')
        }
    except Exception as e:
        return {
            'filepath': str(filepath),
            'encoding': None,
            'confidence': 0.0,
            'error': str(e)
        }

def should_check_file(filepath):
    """判断是否应该检测此文件"""
    # 检查扩展名
    if filepath.suffix.lower() not in TEXT_EXTENSIONS:
        return False

    # 检查是否在排除目录中
    for part in filepath.parts:
        if part in EXCLUDE_DIRS:
            return False

    return True

def main():
    """主函数"""
    repo_root = Path(__file__).parent.parent

    print("检测仓库中文本文件编码...")
    print(f"仓库根目录: {repo_root}")
    print("-" * 60)

    non_utf8_files = []
    error_files = []
    total_checked = 0

    # 遍历所有文件
    for filepath in repo_root.rglob('*'):
        if not filepath.is_file():
            continue

        if not should_check_file(filepath):
            continue

        total_checked += 1
        result = detect_file_encoding(filepath)

        # 检查是否为UTF-8
        is_utf8 = (result['encoding'] and
                  result['encoding'].upper() in ['UTF-8', 'UTF-8-SIG'] and
                  result['confidence'] > 0.8)

        if result.get('error'):
            error_files.append(result)
            status = "[错误]"
        elif not is_utf8:
            non_utf8_files.append(result)
            status = "[非UTF-8]"
        else:
            status = "[UTF-8]"

        print("30")

        # 每处理100个文件显示进度
        if total_checked % 100 == 0:
            print(f"\n已检查 {total_checked} 个文件...")

    print(f"\n{'='*60}")
    print(f"检测完成!")
    print(f"总检查文件数: {total_checked}")
    print(f"非UTF-8文件数: {len(non_utf8_files)}")
    print(f"检测错误文件数: {len(error_files)}")

    if non_utf8_files:
        print(f"\n发现 {len(non_utf8_files)} 个非UTF-8编码的文件:")
        print("-" * 60)

        # 按编码分组统计
        encoding_stats = {}
        for file_info in non_utf8_files:
            encoding = file_info['encoding'] or '未知'
            encoding_stats[encoding] = encoding_stats.get(encoding, 0) + 1

        print("编码分布:")
        for encoding, count in sorted(encoding_stats.items()):
            print(f"  {encoding}: {count} 个文件")

        print("\n详细列表:")
        for file_info in non_utf8_files:
            confidence = f"{file_info['confidence']:.2f}"
            encoding = file_info['encoding'] or '未知'
            print(f"  {file_info['filepath']} ({encoding}, 置信度: {confidence})")

        # 保存到文件
        with open('encoding_report.txt', 'w', encoding='utf-8') as f:
            f.write("非UTF-8编码文件报告\n")
            f.write("="*50 + "\n\n")
            f.write(f"检测时间: {os.popen('date').read().strip() if os.name != 'nt' else 'Windows系统'}\n")
            f.write(f"总检查文件数: {total_checked}\n")
            f.write(f"非UTF-8文件数: {len(non_utf8_files)}\n\n")

            f.write("编码分布:\n")
            for encoding, count in sorted(encoding_stats.items()):
                f.write(f"  {encoding}: {count} 个文件\n")

            f.write("\n详细列表:\n")
            for file_info in non_utf8_files:
                confidence = f"{file_info['confidence']:.2f}"
                encoding = file_info['encoding'] or '未知'
                f.write(f"  {file_info['filepath']} ({encoding}, 置信度: {confidence})\n")

        print(f"\n详细报告已保存到: encoding_report.txt")

    if error_files:
        print(f"\n检测过程中出现 {len(error_files)} 个错误:")
        for file_info in error_files:
            print(f"  {file_info['filepath']}: {file_info['error']}")

    print(f"\n检测完成!")

if __name__ == "__main__":
    main()
