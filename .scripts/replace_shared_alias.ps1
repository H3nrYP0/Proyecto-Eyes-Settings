$files = Get-ChildItem -Path src -Recurse -Include *.js,*.jsx,*.ts,*.tsx -File
$pattern = @'
(?:["'])(?:\.\./)+shared/([^"']+)(?:["'])
'@
foreach ($f in $files) {
  $path = $f.FullName
  $text = Get-Content -Raw -LiteralPath $path
  $new = [regex]::Replace($text, $pattern, '"@shared/$1"')
  if ($new -ne $text) {
    Set-Content -LiteralPath $path -Value $new
    Write-Output $path
  }
}