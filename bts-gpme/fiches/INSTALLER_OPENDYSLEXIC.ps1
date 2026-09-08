param([string]$Archive="")
$ErrorActionPreference="Stop"
$Root=Split-Path -Parent $MyInvocation.MyCommand.Path
$FontDir=Join-Path $Root "assets\fonts"
New-Item -ItemType Directory -Force -Path $FontDir | Out-Null
if(-not $Archive){$Archive=Get-ChildItem -Path $Root,(Split-Path -Parent $Root) -Filter "MATRICE_OFFICIELLE_COURS_V1*.zip" -File -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName}
if(-not $Archive -or -not(Test-Path $Archive)){
  Add-Type -AssemblyName System.Windows.Forms
  $dlg=New-Object System.Windows.Forms.OpenFileDialog
  $dlg.Title="Sélectionnez MATRICE_OFFICIELLE_COURS_V1.zip"
  $dlg.Filter="Archives ZIP (*.zip)|*.zip|Tous les fichiers (*.*)|*.*"
  if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){Write-Host "Aucune archive sélectionnée." -ForegroundColor Yellow;exit 1}
  $Archive=$dlg.FileName
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip=[System.IO.Compression.ZipFile]::OpenRead($Archive)
try{
 $expected=@("OpenDyslexic-Regular.otf","OpenDyslexic-Bold.otf","OpenDyslexic-Italic.otf","OpenDyslexic-BoldItalic.otf","OpenDyslexicMono-Regular.otf")
 foreach($name in $expected){
   $entry=$zip.Entries | Where-Object {$_.Name -eq $name -and ($_.FullName -match "(^|/)fonts/" -or $_.FullName -match "/dys/fonts/")} | Select-Object -First 1
   if(-not $entry){throw "Police introuvable dans la matrice : $name"}
   $dest=Join-Path $FontDir $name
   [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry,$dest,$true)
   Write-Host "Préparée : $name" -ForegroundColor Green
 }
 Write-Host "OpenDyslexic est prête pour cette bibliothèque. Rechargez la page (Ctrl+F5)." -ForegroundColor Cyan
} finally {$zip.Dispose()}
