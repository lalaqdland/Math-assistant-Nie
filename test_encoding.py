#!/usr/bin/env python3
import chardet
import os

def check_file_encoding(filepath, label):
    if not os.path.exists(filepath):
        print(f"{label}: File not found")
        return

    with open(filepath, 'rb') as f:
        data = f.read()

    result = chardet.detect(data)
    print(f"{label}:")
    print(f"  Encoding: {result['encoding']}")
    print(f"  Confidence: {result['confidence']:.2f}")
    print(f"  Language: {result.get('language', 'N/A')}")

    # 检查前几个字节是否有BOM
    if data.startswith(b'\xef\xbb\xbf'):
        print("  Has UTF-8 BOM: Yes")
    else:
        print("  Has UTF-8 BOM: No")

    print()

# 检查当前文件
check_file_encoding('js/ai-tutor-module.js', 'Current file')

# 检查最新备份文件
check_file_encoding('encoding-backup/backup_20260111_172908/js/ai-tutor-module.js', 'Latest backup file')

# 比较文件内容是否相同
with open('js/ai-tutor-module.js', 'rb') as f1, open('encoding-backup/backup_20260111_172634/js/ai-tutor-module.js', 'rb') as f2:
    current_data = f1.read()
    backup_data = f2.read()

if current_data == backup_data:
    print("Files are identical - conversion may have failed")
else:
    print("Files are different - conversion was attempted")
