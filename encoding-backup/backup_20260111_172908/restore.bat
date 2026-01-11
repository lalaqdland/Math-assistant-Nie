@echo off
echo 正在恢复文件...
setlocal enabledelayedexpansion
set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=..\..\.."
for /r "%SOURCE_DIR%" %%f in (*) do (
    set "rel_path=%%f"
    set "rel_path=!rel_path:%SOURCE_DIR%=!"
    if not "!rel_path!"=="restore.bat" (
        copy "%%f" "%TARGET_DIR%!rel_path!" >nul 2>&1
        echo 恢复: !rel_path!
    )
)
echo 恢复完成!
pause
