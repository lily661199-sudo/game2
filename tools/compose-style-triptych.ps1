$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$renderRoot = Join-Path $projectRoot 'assets\style-concepts\rendered'
$outputPath = Join-Path $projectRoot 'assets\style-concepts\blender-style-triptych.png'
$width = 2100
$height = 1120
$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$background = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(15, 23, 22))
$graphics.FillRectangle($background, 0, 0, $width, $height)
$titleFont = [System.Drawing.Font]::new('Microsoft JhengHei', 30, [System.Drawing.FontStyle]::Bold)
$subtitleFont = [System.Drawing.Font]::new('Microsoft JhengHei', 15, [System.Drawing.FontStyle]::Regular)
$headingFont = [System.Drawing.Font]::new('Microsoft JhengHei', 21, [System.Drawing.FontStyle]::Bold)
$bodyFont = [System.Drawing.Font]::new('Microsoft JhengHei', 15, [System.Drawing.FontStyle]::Regular)
$gold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(232, 205, 145))
$light = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(235, 228, 208))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(177, 190, 174))

$graphics.DrawString('小小夢魔 · Blender 3D 美術方向', $titleFont, $gold, 650, 35)
$graphics.DrawString('依照參考圖的低機位、巨大空間與戲劇光影製作｜同一場景，三種原創風格', $subtitleFont, $muted, 490, 92)

$cards = @(
  @{ id = '01-handcrafted-stop-motion'; number = '1'; title = '霧港定格電影'; description = '手工微縮質感 · 舊木與暖琥珀聚光' },
  @{ id = '02-layered-paper-storybook'; number = '2'; title = '立體紙藝繪本'; description = '柔和紙景層次 · 輕霧與清新色彩' },
  @{ id = '03-stylized-low-poly-cinema'; number = '3'; title = '低多邊形夢境'; description = '青藍幾何切面 · 冷霧與金色焦點' }
)

for ($i = 0; $i -lt $cards.Count; $i++) {
  $x = 35 + $i * 690
  $y = 155
  $cardWidth = 648
  $cardHeight = 830
  $cardRect = [System.Drawing.Rectangle]::new($x, $y, $cardWidth, $cardHeight)
  $cardFill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(30, 43, 39))
  $cardEdge = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(119, 101, 67), 2)
  $graphics.FillRectangle($cardFill, $cardRect)
  $graphics.DrawRectangle($cardEdge, $cardRect)

  $card = $cards[$i]
  $numberFont = [System.Drawing.Font]::new('Microsoft JhengHei', 25, [System.Drawing.FontStyle]::Bold)
  $graphics.DrawString($card.number, $numberFont, $gold, $x + 24, $y + 18)
  $graphics.DrawString($card.title, $headingFont, $light, $x + 74, $y + 23)

  $imagePath = Join-Path $renderRoot ($card.id + '.png')
  $image = [System.Drawing.Image]::FromFile($imagePath)
  $graphics.DrawImage($image, $x + 24, $y + 76, 600, 337.5)
  $image.Dispose()

  $graphics.DrawString($card.description, $bodyFont, $muted, $x + 24, $y + 447)
  $graphics.DrawString('兩關融合玩法：目標抽屜、口袋背包、提燈小徑', $subtitleFont, $light, $x + 24, $y + 490)
  $numberFont.Dispose()
  $cardFill.Dispose()
  $cardEdge.Dispose()
}

$graphics.DrawString('選定 1、2 或 3 後，角色、材質、完整場景與動畫都會依同一風格製作。', $bodyFont, $gold, 510, 1022)
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$background.Dispose()
$titleFont.Dispose()
$subtitleFont.Dispose()
$headingFont.Dispose()
$bodyFont.Dispose()
$gold.Dispose()
$light.Dispose()
$muted.Dispose()
Write-Output $outputPath
