Add-Type -AssemblyName System.Drawing

$sourcePath = 'C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded\media_1793088041901_b3ccdc30.png'
$resDir = 'c:\Users\Admin\Documents\antigravity\noble-franklin\android\app\src\main\res'

if (-not (Test-Path $resDir)) { exit 0 }

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)
$minDim = [Math]::Min($srcImg.Width, $srcImg.Height)
$cropX = [int](($srcImg.Width - $minDim) / 2)
$cropY = [int](($srcImg.Height - $minDim) / 2)
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $minDim, $minDim)

function Save-Mipmap([int]$size, [string]$folder) {
    $dir = Join-Path $resDir $folder
    if (-not (Test-Path $dir)) { return }
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($srcImg, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $bmp.Save((Join-Path $dir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save((Join-Path $dir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save((Join-Path $dir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Updated Android mipmap: $folder ($size x $size)"
}

Save-Mipmap 48 "mipmap-mdpi"
Save-Mipmap 72 "mipmap-hdpi"
Save-Mipmap 96 "mipmap-xhdpi"
Save-Mipmap 144 "mipmap-xxhdpi"
Save-Mipmap 192 "mipmap-xxxhdpi"

$srcImg.Dispose()
Write-Host "Android launcher mipmaps updated successfully!"
