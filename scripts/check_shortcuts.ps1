$sh = New-Object -ComObject WScript.Shell
$recent = 'C:\Users\Admin\AppData\Roaming\Microsoft\Windows\Recent'
Get-ChildItem $recent -Filter '*.lnk' | ForEach-Object {
    if ($_.Name -like '*c_ng*' -or $_.Name -like '*CungDang*' -or $_.Name -like '*ti_ng*') {
        try {
            $sc = $sh.CreateShortcut($_.FullName)
            Write-Host ($_.Name + ' -> ' + $sc.TargetPath)
        } catch {
            Write-Host ($_.Name + ' error')
        }
    }
}
