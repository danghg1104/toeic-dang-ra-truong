Add-Type -AssemblyName System.Drawing

$brainDir = "C:\Users\Admin\.gemini\antigravity\brain\ed360126-cbd6-4e9c-92fb-38b43251e283\.user_uploaded"
$outDir = "C:\Users\Admin\Documents\antigravity\noble-franklin\assets\mascot"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Crop-Image($sourcePath, $x, $y, $w, $h, $destPath) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $rect = [System.Drawing.Rectangle]::new($x, $y, $w, $h)
    $dest = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($src, [System.Drawing.Rectangle]::new(0, 0, $w, $h), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $src.Dispose()
    
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Saved: $destPath ($w x $h)"
}

# Image 1: media_1793284275081_756d409e.jpg (4 poses: Star top-left, Book reading top-right, Headphone bottom-left, Trophy bottom-right)
$img1 = "$brainDir\media_1793284275081_756d409e.jpg"
if (Test-Path $img1) {
    $bmp1 = [System.Drawing.Bitmap]::FromFile($img1)
    $W = $bmp1.Width
    $H = $bmp1.Height
    $bmp1.Dispose()
    Write-Output "Image 1 size: $W x $H"

    $halfW = [int]($W / 2)
    $halfH = [int]($H / 2)

    # Top-Right: Reading Book with Glasses
    Crop-Image $img1 $halfW 0 $halfW $halfH "$outDir\may_reading.png"

    # Bottom-Left: Studio Headphones Listening
    Crop-Image $img1 0 $halfH $halfW $halfH "$outDir\may_listening.png"

    # Bottom-Right: Trophy Celebration
    Crop-Image $img1 $halfW $halfH $halfW $halfH "$outDir\may_trophy.png"
}

# Image 5: media_1793284275171_4feb1de4.jpg (Top-left: Map Explorer; Bottom-left: Hiking stick; Top-right: Camera; Bottom-right: Binoculars)
$img5 = "$brainDir\media_1793284275171_4feb1de4.jpg"
if (Test-Path $img5) {
    $bmp5 = [System.Drawing.Bitmap]::FromFile($img5)
    $W5 = $bmp5.Width
    $H5 = $bmp5.Height
    $bmp5.Dispose()
    Write-Output "Image 5 size: $W5 x $H5"

    $halfW5 = [int]($W5 / 2)
    $halfH5 = [int]($H5 / 2)

    # Top-Left: Map Explorer with Backpack
    Crop-Image $img5 0 0 $halfW5 $halfH5 "$outDir\may_explorer.png"

    # Bottom-Left: Hiking stick guide
    Crop-Image $img5 0 $halfH5 $halfW5 $halfH5 "$outDir\may_guide.png"
}

# Image 2: media_1793284275080_b2838cdf.jpg (Top-right: Resting with water bottle)
$img2 = "$brainDir\media_1793284275080_b2838cdf.jpg"
if (Test-Path $img2) {
    $bmp2 = [System.Drawing.Bitmap]::FromFile($img2)
    $W2 = $bmp2.Width
    $H2 = $bmp2.Height
    $bmp2.Dispose()

    $halfW2 = [int]($W2 / 2)
    $halfH2 = [int]($H2 / 2)

    # Top-Right: Resting & water bottle (Care/Break)
    Crop-Image $img2 $halfW2 0 $halfW2 $halfH2 "$outDir\may_resting.png"
}

# Create Avatar (close-up face crop from may_reading.png or mascot_portrait.jpg)
$portrait = "$outDir\mascot_portrait.jpg"
if (Test-Path $portrait) {
    $srcP = [System.Drawing.Bitmap]::FromFile($portrait)
    # Face is in top half centered
    $pw = $srcP.Width
    $ph = $srcP.Height
    $avatarSize = [int]($pw * 0.75)
    $ax = [int](($pw - $avatarSize) / 2)
    $ay = [int]($ph * 0.05)
    $srcP.Dispose()
    Crop-Image $portrait $ax $ay $avatarSize $avatarSize "$outDir\may_avatar.png"
}
