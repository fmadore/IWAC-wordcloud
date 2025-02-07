# Create fonts directory if it doesn't exist
$fontsDir = "src/assets/fonts"
New-Item -ItemType Directory -Force -Path $fontsDir

# Font URLs from Google Fonts CDN
$fonts = @{
    "Inter-Regular" = "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2"
    "Inter-Medium" = "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2"
    "Inter-SemiBold" = "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2"
}

# Download each font
foreach ($font in $fonts.GetEnumerator()) {
    $outputPath = Join-Path $fontsDir "$($font.Key).woff2"
    Write-Host "Downloading $($font.Key) to $outputPath"
    Invoke-WebRequest -Uri $font.Value -OutFile $outputPath
}

Write-Host "Font downloads complete!" 