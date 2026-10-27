Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded\media_1793088041901_b3ccdc30.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Source image loaded: $($srcImg.Width)x$($srcImg.Height)"

# Square crop: center crop to min(Width, Height)
$size = [Math]::Min($srcImg.Width, $srcImg.Height)
$cropX = [int](($srcImg.Width - $size) / 2)
$cropY = [int](($srcImg.Height - $size) / 2)

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $size, $size)
$squareBmp = New-Object System.Drawing.Bitmap($size, $size)
$gCrop = [System.Drawing.Graphics]::FromImage($squareBmp)
$gCrop.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gCrop.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gCrop.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gCrop.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$gCrop.DrawImage($srcImg, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$gCrop.Dispose()

function Resize-Bitmap($bmp, $targetWidth, $targetHeight, $padding = 0) {
    $dest = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $drawW = $targetWidth - (2 * $padding)
    $drawH = $targetHeight - (2 * $padding)
    $g.DrawImage($bmp, $padding, $padding, $drawW, $drawH)
    $g.Dispose()
    return $dest
}

function Save-Png($bmp, $outPath) {
    $dir = Split-Path $outPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    if (Test-Path $outPath) {
        Remove-Item $outPath -Force
    }
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Saved: $outPath ($($bmp.Width)x$($bmp.Height))"
}

$rootDir = "C:\Users\Admin\Documents\antigravity\noble-franklin"

# 1. Standard PWA icons (512x512, 192x192)
$bmp512 = Resize-Bitmap $squareBmp 512 512
$bmp192 = Resize-Bitmap $squareBmp 192 192

# Maskable icon (safe zone has ~10% padding so Totoro isn't clipped when round-masked)
$bmpMaskable512 = Resize-Bitmap $squareBmp 512 512 40

Save-Png $bmp512 "$rootDir\icon-512.png"
Save-Png $bmp192 "$rootDir\icon-192.png"
Save-Png $bmpMaskable512 "$rootDir\icon-maskable-512.png"

# Copy to www
Save-Png $bmp512 "$rootDir\www\icon-512.png"
Save-Png $bmp192 "$rootDir\www\icon-192.png"
Save-Png $bmpMaskable512 "$rootDir\www\icon-maskable-512.png"

# Copy to android assets
Save-Png $bmp512 "$rootDir\android\app\src\main\assets\public\icon-512.png"
Save-Png $bmp192 "$rootDir\android\app\src\main\assets\public\icon-192.png"

# 2. Android mipmap icons
$mipmaps = @(
    @{ name = "mipmap-mdpi"; size = 48 },
    @{ name = "mipmap-hdpi"; size = 72 },
    @{ name = "mipmap-xhdpi"; size = 96 },
    @{ name = "mipmap-xxhdpi"; size = 144 },
    @{ name = "mipmap-xxxhdpi"; size = 192 }
)

foreach ($m in $mipmaps) {
    $resDir = "$rootDir\android\app\src\main\res\$($m.name)"
    $bmpM = Resize-Bitmap $squareBmp $m.size $m.size
    Save-Png $bmpM "$resDir\ic_launcher.png"
    Save-Png $bmpM "$resDir\ic_launcher_round.png"
    Save-Png $bmpM "$resDir\ic_launcher_foreground.png"
    $bmpM.Dispose()
}

$srcImg.Dispose()
$squareBmp.Dispose()
$bmp512.Dispose()
$bmp192.Dispose()
$bmpMaskable512.Dispose()

Write-Output "All app icons successfully generated from Totoro image!"
