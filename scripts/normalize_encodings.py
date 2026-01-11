#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
规范化仓库中文本文件的编码为 UTF-8（无 BOM）
自动备份原文件，支持回滚
"""

import os
import sys
import shutil
import time
from pathlib import Path
import chardet

# 需要转换的编码类型
CONVERTIBLE_ENCODINGS = {
    'Windows-1254',  # 通常是GBK的误识别
    'GBK', 'GB2312', 'GB18030',
    'ISO-8859-1', 'latin1',
    'ascii'  # 虽然ascii是UTF-8的子集，但为了统一也转换
}

# 排除的文件类型（不进行编码转换）
EXCLUDE_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico',
    '.pdf', '.zip', '.gz', '.7z',
    '.pyc', '.exe', '.dll'
}

# 排除的目录
EXCLUDE_DIRS = {
    '.git', 'node_modules', '__pycache__', '.cursor',
    'encoding-backup', '.vscode'  # 排除我们刚创建的目录
}

def detect_file_encoding(filepath):
    """检测文件编码"""
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()

        result = chardet.detect(raw_data)
        return result
    except Exception as e:
        return {'encoding': None, 'confidence': 0.0, 'error': str(e)}

def should_convert_file(filepath):
    """判断是否应该转换此文件"""
    # 检查扩展名
    if filepath.suffix.lower() in EXCLUDE_EXTENSIONS:
        return False

    # 检查是否在排除目录中
    for part in filepath.parts:
        if part in EXCLUDE_DIRS:
            return False

    return True

def convert_file_to_utf8(filepath, backup_dir):
    """转换单个文件为UTF-8并备份"""
    try:
        # 检测编码
        encoding_info = detect_file_encoding(filepath)

        # 如果已经是UTF-8（无BOM），跳过
        if (encoding_info['encoding'] and
            encoding_info['encoding'].upper() in ['UTF-8', 'UTF-8-SIG'] and
            encoding_info['confidence'] > 0.8):
            return {'status': 'skipped', 'reason': 'already_utf8'}

        # 如果编码不在转换列表中，跳过
        if not encoding_info['encoding'] or encoding_info['encoding'] not in CONVERTIBLE_ENCODINGS:
            return {'status': 'skipped', 'reason': 'not_convertible'}

        # 读取原文件
        with open(filepath, 'rb') as f:
            raw_data = f.read()

        # 尝试用检测到的编码解码
        text_content = None

        # 优先尝试UTF-8（因为很多文件实际上已经是UTF-8但被误检测）
        encodings_to_try = ['utf-8', 'utf-8-sig']

        # 如果检测到Windows-1254，很可能是GBK编码的中文文件
        if encoding_info['encoding'] == 'Windows-1254':
            encodings_to_try.extend(['gbk', 'gb2312', 'gb18030', 'Windows-1254'])
        else:
            encodings_to_try.append(encoding_info['encoding'])

        # 尝试各种编码
        for encoding in encodings_to_try:
            try:
                text_content = raw_data.decode(encoding)
                print(f"  成功解码使用编码: {encoding}")
                break
            except UnicodeDecodeError:
                continue

        if text_content is None:
            return {'status': 'failed', 'reason': 'decode_error'}

        # 创建备份
        relative_path = filepath.relative_to(Path(__file__).parent.parent)
        backup_path = backup_dir / relative_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)

        shutil.copy2(filepath, backup_path)
        print(f"  备份: {relative_path}")

        # 写入UTF-8文件（无BOM）
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(text_content)

        print(f"  转换: {relative_path} ({encoding_info['encoding']} -> UTF-8)")
        return {'status': 'converted', 'from_encoding': encoding_info['encoding']}

    except Exception as e:
        return {'status': 'failed', 'reason': str(e)}

def create_backup_directory():
    """创建带时间戳的备份目录"""
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    backup_dir = Path(f"encoding-backup/backup_{timestamp}")
    backup_dir.mkdir(parents=True, exist_ok=True)
    return backup_dir

def main():
    """主函数"""
    repo_root = Path(__file__).parent.parent

    print("规范化仓库中文本文件编码为 UTF-8...")
    print(f"仓库根目录: {repo_root}")
    print("-" * 60)

    # 创建备份目录
    backup_dir = create_backup_directory()
    print(f"备份目录: {backup_dir}")

    # 从检测报告中读取需要转换的文件列表
    files_to_convert = []

    # 首先尝试从报告文件中读取
    report_file = repo_root / 'encoding_report.txt'
    if report_file.exists():
        print("从检测报告中读取文件列表...")
        try:
            with open(report_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 解析报告文件中的文件路径
            lines = content.split('\n')
            in_detail_section = False
            for line in lines:
                line = line.strip()
                if '详细列表:' in line:
                    in_detail_section = True
                    continue
                elif in_detail_section and line.startswith('  ') and '(' in line and line.endswith(')'):
                    # 提取文件路径
                    filepath_str = line.split(' (')[0].strip()
                    filepath = Path(filepath_str)
                    if filepath.exists():
                        files_to_convert.append(filepath)
        except Exception as e:
            print(f"读取报告文件失败: {e}")

    # 如果报告文件没有找到足够的文件，手动扫描
    if len(files_to_convert) < 5:  # 如果找到的文件太少，重新扫描
        print("重新扫描仓库中的所有文本文件...")
        files_to_convert = []
        for filepath in repo_root.rglob('*'):
            if not filepath.is_file():
                continue
            if should_convert_file(filepath):
                # 检查是否需要转换
                encoding_info = detect_file_encoding(filepath)
                if (encoding_info['encoding'] and
                    encoding_info['encoding'] not in ['UTF-8', 'UTF-8-SIG'] and
                    encoding_info['confidence'] > 0.3 and
                    encoding_info['encoding'] in CONVERTIBLE_ENCODINGS):
                    files_to_convert.append(filepath)

    if not files_to_convert:
        print("没有找到需要转换的文件")
        return

    print(f"找到 {len(files_to_convert)} 个待转换文件")
    print("-" * 60)

    # 统计信息
    converted_count = 0
    skipped_count = 0
    failed_count = 0
    encoding_stats = {}

    # 转换文件
    for filepath in files_to_convert:
        result = convert_file_to_utf8(filepath, backup_dir)

        if result['status'] == 'converted':
            converted_count += 1
            from_encoding = result['from_encoding']
            encoding_stats[from_encoding] = encoding_stats.get(from_encoding, 0) + 1
        elif result['status'] == 'skipped':
            skipped_count += 1
        else:
            failed_count += 1
            print(f"  失败: {filepath} - {result['reason']}")

    # 输出统计信息
    print(f"\n{'='*60}")
    print("转换完成!")
    print(f"总文件数: {len(files_to_convert)}")
    print(f"成功转换: {converted_count}")
    print(f"跳过文件: {skipped_count}")
    print(f"转换失败: {failed_count}")

    if encoding_stats:
        print(f"\n编码转换统计:")
        for encoding, count in sorted(encoding_stats.items()):
            print(f"  {encoding} -> UTF-8: {count} 个文件")

    # 创建恢复脚本
    restore_script = backup_dir / "restore.bat"
    with open(restore_script, 'w', encoding='utf-8') as f:
        f.write("@echo off\n")
        f.write("echo 正在恢复文件...\n")
        f.write("setlocal enabledelayedexpansion\n")
        f.write("set \"SOURCE_DIR=%~dp0\"\n")
        f.write("set \"TARGET_DIR=..\\..\\..\"\n")
        f.write("for /r \"%SOURCE_DIR%\" %%f in (*) do (\n")
        f.write("    set \"rel_path=%%f\"\n")
        f.write("    set \"rel_path=!rel_path:%SOURCE_DIR%=!\"\n")
        f.write("    if not \"!rel_path!\"==\"restore.bat\" (\n")
        f.write("        copy \"%%f\" \"%TARGET_DIR%!rel_path!\" >nul 2>&1\n")
        f.write("        echo 恢复: !rel_path!\n")
        f.write("    )\n")
        f.write(")\n")
        f.write("echo 恢复完成!\n")
        f.write("pause\n")

    print(f"\n备份位置: {backup_dir}")
    print(f"恢复脚本: {backup_dir}/restore.bat")
    print("\n如需恢复原文件，请运行恢复脚本。")

if __name__ == "__main__":
    main()
