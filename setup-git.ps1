$repoPath = "c:\Danny\projects\fluxfolio"
Set-Location $repoPath

# Check if already a git repo
if (Test-Path ".git") {
    Write-Output "Git repo already initialized"
} else {
    & "C:\Program Files\Git\bin\git.exe" init
    & "C:\Program Files\Git\bin\git.exe" checkout -b main
}

& "C:\Program Files\Git\bin\git.exe" add -A
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: FluxFolio fullstack portfolio"
