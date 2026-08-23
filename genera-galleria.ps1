$exts  = @('*.jpg','*.jpeg','*.jfif','*.png','*.webp','*.gif','*.avif')
$files = $exts | ForEach-Object {
  Get-ChildItem -Path "$PSScriptRoot\media\gallery" -Filter $_ -ErrorAction SilentlyContinue
} | Select-Object -ExpandProperty Name | Sort-Object

$entries = $files | ForEach-Object { "  'media/gallery/$_'" }
$content = "window.GALLERY_MANIFEST = [`n" + ($entries -join ",`n") + "`n];"
Set-Content -Path "$PSScriptRoot\media\gallery\manifest.js" -Value $content -Encoding UTF8

Write-Host "Galleria aggiornata: $($files.Count) foto trovate."
