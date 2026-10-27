Add-Type -AssemblyName System.Drawing

$sourcePath = 'C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded\media_1793088041901_b3ccdc30.png'
$workDir = 'c:\Users\Admin\Documents\antigravity\noble-franklin'

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image not found: $sourcePath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

# Calculate square crop from center
$minDim = [Math]::Min($srcImg.Width, $srcImg.Height)
$cropX = [int](($srcImg.Width - $minDim) / 2)
$cropY = [int](($srcImg.Height - $minDim) / 2)
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $minDim, $minDim)

function Resize-AndSave([int]$size, [string]$outPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($srcImg, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved: $outPath ($size x $size)"
}

# 1. Base icons
Resize-AndSave 192 (Join-Path $workDir "icon-totoro-192.png")
Resize-AndSave 512 (Join-Path $workDir "icon-totoro-512.png")
Resize-AndSave 512 (Join-Path $workDir "icon-totoro-maskable-512.png")
Resize-AndSave 192 (Join-Path $workDir "icon-192.png")
Resize-AndSave 512 (Join-Path $workDir "icon-512.png")
Resize-AndSave 512 (Join-Path $workDir "icon-maskable-512.png")

# 2. Multi-size icons for ICO packaging
$sizes = @(16, 32, 48, 64, 128, 256)
$scratchDir = Join-Path $workDir "scratch\ico_sizes"
if (-not (Test-Path $scratchDir)) { New-Item -ItemType Directory -Path $scratchDir -Force | Out-Null }

foreach ($s in $sizes) {
    Resize-AndSave $s (Join-Path $scratchDir "icon-$s.png")
}

$srcImg.Dispose()
Write-Host "All icons generated successfully!"
