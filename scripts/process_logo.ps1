Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Admin\.gemini\antigravity\brain\ed360126-cbd6-4e9c-92fb-38b43251e283\.user_uploaded\media_1793528635750_1f9defe2.jpg"
$destPng = "assets\mascot\may_avatar.png"

Write-Host "Reading image: $srcPath"
$src = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Original dimensions: $($src.Width) x $($src.Height)"

# Function to resize image with high quality
function Resize-Image($image, $width, $height, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    $graph.DrawImage($image, $rect)
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graph.Dispose()
    $bmp.Dispose()
    Write-Host "Saved: $outPath ($width x $height)"
}

# 1. assets\mascot\may_avatar.png (512x512)
Resize-Image $src 512 512 "assets\mascot\may_avatar.png"

# 2. assets\mascot\may_avatar_large.png (1024x1024)
Resize-Image $src 1024 1024 "assets\mascot\may_avatar_large.png"

# 3. icon-512.png & icon-maskable-512.png
Resize-Image $src 512 512 "icon-512.png"
Resize-Image $src 512 512 "icon-maskable-512.png"

# 4. icon-192.png
Resize-Image $src 192 192 "icon-192.png"

# 5. www directory copies
if (Test-Path "www") {
    Copy-Item "assets\mascot\may_avatar.png" -Destination "www\assets\mascot\may_avatar.png" -Force
    Copy-Item "assets\mascot\may_avatar_large.png" -Destination "www\assets\mascot\may_avatar_large.png" -Force
    Copy-Item "icon-512.png" -Destination "www\icon-512.png" -Force
    Copy-Item "icon-maskable-512.png" -Destination "www\icon-maskable-512.png" -Force
    Copy-Item "icon-192.png" -Destination "www\icon-192.png" -Force
}

# 6. Android assets if present
if (Test-Path "android\app\src\main\assets\public") {
    Copy-Item "assets\mascot\may_avatar.png" -Destination "android\app\src\main\assets\public\assets\mascot\may_avatar.png" -Force
    Copy-Item "icon-512.png" -Destination "android\app\src\main\assets\public\icon-512.png" -Force
    Copy-Item "icon-192.png" -Destination "android\app\src\main\assets\public\icon-192.png" -Force
}

# 7. Generate favicon.ico (64x64 or multi-size)
# A simple PNG can be converted to icon format
$bmpFavicon = New-Object System.Drawing.Bitmap 64, 64
$g = [System.Drawing.Graphics]::FromImage($bmpFavicon)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, 0, 0, 64, 64)
$iconHandle = $bmpFavicon.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fileStream = New-Object System.IO.FileStream("favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fileStream)
$fileStream.Close()
$fileStream.Dispose()
$icon.Dispose()
$g.Dispose()
$bmpFavicon.Dispose()
Write-Host "Saved favicon.ico"

if (Test-Path "www") {
    Copy-Item "favicon.ico" -Destination "www\favicon.ico" -Force
    Copy-Item "favicon.ico" -Destination "www\app.ico" -Force
}
Copy-Item "favicon.ico" -Destination "app.ico" -Force

$src.Dispose()
Write-Host "All logo icons replaced successfully with Sói Mây Mascot!"
