$script:tsImportPaths = @(
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-active-desactive'; New = 'src/app/core/components/buttons/web/label/button-active-desactive' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-send-email'; New = 'src/app/core/components/buttons/web/label/button-send-email' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-view-pdf'; New = 'src/app/core/components/buttons/web/label/button-view-pdf' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-download'; New = 'src/app/core/components/buttons/web/label/button-download' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-tracking'; New = 'src/app/core/components/buttons/web/label/button-tracking' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-confirm'; New = 'src/app/core/components/buttons/web/label/button-confirm' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-delete'; New = 'src/app/core/components/buttons/web/label/button-delete' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-edit'; New = 'src/app/core/components/buttons/web/label/button-edit' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-save'; New = 'src/app/core/components/buttons/web/label/button-save' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-item'; New = 'src/app/core/components/buttons/web/label/button-item' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button-add'; New = 'src/app/core/components/buttons/web/label/button-add' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons/custom-button'; New = 'src/app/core/components/buttons/web/label/button' }
    @{ Old = 'src/app/core/components/buttons/legacy/buttons'; New = 'src/app/core/components/buttons/web/label' }
)

$script:tsClasses = @(
    @{ Old = 'CustomButtonActiveDesactive'; New = 'WebButtonLabelActiveDesactive' }
    @{ Old = 'CustomButtonSendEmail'; New = 'WebButtonLabelSendEmail' }
    @{ Old = 'CustomButtonViewPdf'; New = 'WebButtonLabelViewPdf' }
    @{ Old = 'CustomButtonDownload'; New = 'WebButtonLabelDownload' }
    @{ Old = 'CustomButtonTracking'; New = 'WebButtonLabelTracking' }
    @{ Old = 'CustomButtonConfirm'; New = 'WebButtonLabelConfirm' }
    @{ Old = 'CustomButtonDelete'; New = 'WebButtonLabelDelete' }
    @{ Old = 'CustomButtonEdit'; New = 'WebButtonLabelEdit' }
    @{ Old = 'CustomButtonSave'; New = 'WebButtonLabelSave' }
    @{ Old = 'CustomButtonItem'; New = 'WebButtonLabelItem' }
    @{ Old = 'CustomButtonAdd'; New = 'WebButtonLabelAdd' }
    @{ Old = 'CustomButton'; New = 'WebButtonLabel' }
)

$script:htmlSelectors = @(
    @{ Old = '<custom-button-active-desactive'; New = '<il-button-active-desactive' }
    @{ Old = '<custom-button-send-email'; New = '<il-button-send-email' }
    @{ Old = '<custom-button-view-pdf'; New = '<il-button-view-pdf' }
    @{ Old = '<custom-button-download'; New = '<il-button-download' }
    @{ Old = '<custom-button-tracking'; New = '<il-button-tracking' }
    @{ Old = '<custom-button-confirm'; New = '<il-button-confirm' }
    @{ Old = '<custom-button-delete'; New = '<il-button-delete' }
    @{ Old = '<custom-button-edit'; New = '<il-button-edit' }
    @{ Old = '<custom-button-save'; New = '<il-button-save' }
    @{ Old = '<custom-button-item'; New = '<il-button-item' }
    @{ Old = '<custom-button-add'; New = '<il-button-add' }
    @{ Old = '<custom-button'; New = '<il-button' }
    @{ Old = '</custom-button-active-desactive>'; New = '</il-button-active-desactive>' }
    @{ Old = '</custom-button-send-email>'; New = '</il-button-send-email>' }
    @{ Old = '</custom-button-view-pdf>'; New = '</il-button-view-pdf>' }
    @{ Old = '</custom-button-download>'; New = '</il-button-download>' }
    @{ Old = '</custom-button-tracking>'; New = '</il-button-tracking>' }
    @{ Old = '</custom-button-confirm>'; New = '</il-button-confirm>' }
    @{ Old = '</custom-button-delete>'; New = '</il-button-delete>' }
    @{ Old = '</custom-button-edit>'; New = '</il-button-edit>' }
    @{ Old = '</custom-button-save>'; New = '</il-button-save>' }
    @{ Old = '</custom-button-item>'; New = '</il-button-item>' }
    @{ Old = '</custom-button-add>'; New = '</il-button-add>' }
    @{ Old = '</custom-button>'; New = '</il-button>' }
)

function Process-HtmlDir {
    param([string]$path)
    Get-ChildItem -Recurse -Filter "*.html" -LiteralPath $path | Where-Object { $_.FullName -notlike "*legacy*" } | ForEach-Object {
        $c = Get-Content $_.FullName -Raw
        if ($c -notmatch 'custom-button') { return }
        $o = $c
        foreach ($m in $script:htmlSelectors) { $c = $c -replace [regex]::Escape($m.Old), $m.New }
        $c = $c -replace '\s*\[?showLabelOnDesktop\]?\s*(?:=\s*"[^"]*"|=\s*''[^'']*''|)', ''
        if ($c -ne $o) { Set-Content -Path $_.FullName -Value $c -NoNewline; Write-Host "  HTML: $($_.FullName)" }
    }
}

function Process-TsDir {
    param([string]$path)
    Get-ChildItem -Recurse -Filter "*.ts" -LiteralPath $path | Where-Object { $_.FullName -notlike "*legacy*" -and $_.Name -notlike "*.spec.ts" -and $_.Name -notlike "*.test.ts" } | ForEach-Object {
        $c = Get-Content $_.FullName -Raw
        if ($c -notmatch 'custom-button|buttons/legacy') { return }
        $o = $c
        foreach ($m in $script:tsImportPaths) { $c = $c -replace [regex]::Escape($m.Old), $m.New }
        foreach ($m in $script:tsClasses) { $c = $c -replace [regex]::Escape($m.Old), $m.New }
        if ($c -ne $o) { Set-Content -Path $_.FullName -Value $c -NoNewline; Write-Host "  TS:   $($_.FullName)" }
    }
}

# === PROCESS DIRECTORY ===
$dir = $args[0]
Write-Host "=== Processing $dir ==="
Process-HtmlDir $dir
Process-TsDir $dir
Write-Host "=== $dir done ==="