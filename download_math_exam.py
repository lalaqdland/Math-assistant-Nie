#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import requests
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader
import io

def download_image(url, filename):
    """下载图片并保存到本地"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def create_pdf_from_images(image_files, output_pdf):
    """将图片合并成PDF"""
    if not image_files:
        print("No images to process")
        return False

    try:
        # 创建PDF
        c = canvas.Canvas(output_pdf, pagesize=A4)

        for image_file in image_files:
            if not os.path.exists(image_file):
                print(f"Image file not found: {image_file}")
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
                print(f"Error processing image {image_file}: {e}")
                continue

        # 保存PDF
        c.save()
        print(f"PDF created: {output_pdf}")
        return True

    except Exception as e:
        print(f"Error creating PDF: {e}")
        return False

def main():
    # 图片URL列表
    base_url = "https://www.eol.cn/e_ky/images/2023/24zhenti/sxy"
    image_urls = [f"{base_url}{i:02d}.png" for i in range(1, 20)]  # sxy01.png to sxy19.png

    # 创建临时文件夹
    temp_dir = "temp_images"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    # 下载所有图片
    downloaded_files = []
    for i, url in enumerate(image_urls, 1):
        filename = os.path.join(temp_dir, f"sxy{i:02d}.png")
        if download_image(url, filename):
            downloaded_files.append(filename)

    if not downloaded_files:
        print("No images were downloaded successfully")
        return

    # 创建PDF
    output_pdf = "2024年考研数学一真题及答案.pdf"
    if create_pdf_from_images(downloaded_files, output_pdf):
        print(f"Success! PDF created: {output_pdf}")

        # 清理临时文件
        print("Cleaning up temporary files...")
        for file in downloaded_files:
            try:
                os.remove(file)
            except:
                pass
        try:
            os.rmdir(temp_dir)
        except:
            pass

    else:
        print("Failed to create PDF")

if __name__ == "__main__":
    main()


