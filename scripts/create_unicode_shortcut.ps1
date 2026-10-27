
$csCode = Get-Content -Raw "C:\Users\Admin\Documents\antigravity\noble-franklin\scripts\ShortcutCreator.cs" -Encoding UTF8
Add-Type -TypeDefinition $csCode

$desktop = [Environment]::GetFolderPath('Desktop')

# Delete old shortcut if present
$oldShortcutPath = [System.IO.Path]::Combine($desktop, "Cùng Đăng Ra Trường — Luyện thi TOEIC & VSTEP.lnk")
if (Test-Path $oldShortcutPath) {
    Remove-Item -Path $oldShortcutPath -Force
    Write-Host "Removed old shortcut: $oldShortcutPath"
}

# Create new shortcut: "Tôi Đi Đâu Đó — Luyện thi TOEIC & VSTEP.lnk"
$newShortcutName = "Tôi Đi Đâu Đó — Luyện thi TOEIC & VSTEP.lnk"
$newShortcutPath = [System.IO.Path]::Combine($desktop, $newShortcutName)

$icoPath = "C:\Users\Admin\Documents\antigravity\noble-franklin\app.ico"
$browserExe = "C:\Program Files\CocCoc\Browser\Application\browser.exe"
if (-not (Test-Path $browserExe)) {
    $browserExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$arguments = "--app=http://localhost:3000"
$description = "Tôi Đi Đâu Đó — Nền tảng luyện thi TOEIC & VSTEP toàn diện miễn phí với Lý thuyết chuyên sâu, Nghe chính tả CEFR, Sổ tay Take Note, Từ điển & Luyện chép từ vựng"
$workingDir = "C:\Users\Admin\Documents\antigravity\noble-franklin"

[ShortcutCreator]::Create($newShortcutPath, $browserExe, $arguments, $icoPath, 0, $description, $workingDir)

if (Test-Path $newShortcutPath) {
    Write-Host "SUCCESS! Created new shortcut with Totoro icon at: $newShortcutPath"
    Write-Host "File size: $((Get-Item $newShortcutPath).Length) bytes"
} else {
    Write-Error "Failed to create shortcut"
}
