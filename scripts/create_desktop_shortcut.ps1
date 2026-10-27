$sh = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

$shortcutPath = Join-Path $desktop "Cùng Đăng Ra Trường — Luyện thi TOEIC & VSTEP.lnk"
$icoPath = "C:\Users\Admin\Documents\antigravity\noble-franklin\app.ico"
$browserExe = "C:\Program Files\CocCoc\Browser\Application\browser.exe"

if (-not (Test-Path $browserExe)) {
    $browserExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$sc = $sh.CreateShortcut($shortcutPath)
$sc.TargetPath = $browserExe
$sc.Arguments = "--app=http://localhost:3000"
$sc.WorkingDirectory = "C:\Users\Admin\Documents\antigravity\noble-franklin"
$sc.IconLocation = "$icoPath,0"
$sc.Description = "Nền tảng luyện thi TOEIC & VSTEP toàn diện miễn phí với Lý thuyết chuyên sâu, Nghe chính tả CEFR, Sổ tay Take Note, Từ điển & Luyện chép từ vựng"
$sc.Save()

Write-Host "Created Desktop shortcut: $shortcutPath"
Write-Host "Target: $($sc.TargetPath) $($sc.Arguments)"
Write-Host "Icon: $($sc.IconLocation)"
