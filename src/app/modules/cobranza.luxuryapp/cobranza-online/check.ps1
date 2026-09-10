 = Get-Content 'resumen\cobranza-online-resumen.html' -Raw
 =  -split '\r?\n'
 = @()

for ( = 0;  -lt .Length; ++) {
     = []
    
    # Very naive regex for testing
     = [regex]::Matches(, '<div(?=[\s>])')
     = [regex]::Matches(, '</div>')
    
    foreach ( in ) {
         +=  + 1
    }
    
    foreach ( in ) {
        if (.Count -gt 0) {
             = [0..(.Count - 2)]
        } else {
            Write-Host "Extra closing div at line 1"
        }
    }
}
Write-Host "Unclosed divs opened at lines: "
