#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil

def move_file():
    source = "2024年考研数学一真题及答案.pdf"
    dest_dir = "考研真题"
    dest = os.path.join(dest_dir, source)

    if os.path.exists(source):
        # 确保目标目录存在
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # 移动文件
        shutil.move(source, dest)
        print(f"File moved successfully: {source} -> {dest}")
        return True
    else:
        print(f"Source file not found: {source}")
        return False

if __name__ == "__main__":
    move_file()




