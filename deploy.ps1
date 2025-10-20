# Script para desplegar el Ahorcado en GitHub Pages
# Este script copia los archivos compilados a tu repositorio de portfolio

Write-Host "Desplegando Juego del Ahorcado..." -ForegroundColor Cyan

# Variables de configuracion
$currentPath = Get-Location
$portfolioPath = "C:\Repositorios\deploy temp"
$ahorcadoFolder = "ahorcado"
$distPath = Join-Path $currentPath "dist"

# 1. Verificar que la compilacion existe
if (-not (Test-Path $distPath)) {
    Write-Host "ERROR: No se encontro la carpeta dist. Ejecuta 'npm run build' primero" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Archivos compilados encontrados" -ForegroundColor Green

# 2. Verificar que existe el repositorio de portfolio
if (-not (Test-Path $portfolioPath)) {
    Write-Host "ERROR: No se encontro el repositorio de portfolio en: $portfolioPath" -ForegroundColor Red
    Write-Host "NOTA: Edita el script deploy.ps1 y cambia la variable portfolioPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: Repositorio de portfolio encontrado" -ForegroundColor Green

# 3. Ir al repositorio de portfolio
Set-Location $portfolioPath

# 4. Verificar que es un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: La carpeta '$portfolioPath' no es un repositorio Git" -ForegroundColor Red
    Set-Location $currentPath
    exit 1
}

# 5. Crear/cambiar a la rama ahorcado
Write-Host "`nCreando/cambiando a rama 'ahorcado'..." -ForegroundColor Yellow
git checkout ahorcado 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b ahorcado
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo crear la rama ahorcado" -ForegroundColor Red
        Set-Location $currentPath
        exit 1
    }
}

Write-Host "OK: Rama 'ahorcado' activa" -ForegroundColor Green

# 6. Crear carpeta para el proyecto si no existe
if (-not (Test-Path $ahorcadoFolder)) {
    New-Item -ItemType Directory -Path $ahorcadoFolder | Out-Null
    Write-Host "OK: Carpeta '$ahorcadoFolder' creada" -ForegroundColor Green
}

# 7. Limpiar carpeta anterior
Write-Host "`nLimpiando archivos anteriores..." -ForegroundColor Yellow
Get-ChildItem -Path $ahorcadoFolder -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue

# 8. Copiar archivos compilados
Write-Host "`nCopiando archivos compilados..." -ForegroundColor Yellow
Copy-Item -Path "$distPath\*" -Destination $ahorcadoFolder -Recurse -Force

if (Test-Path "$ahorcadoFolder\index.html") {
    Write-Host "OK: Archivos copiados exitosamente" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se pudieron copiar los archivos" -ForegroundColor Red
    Set-Location $currentPath
    exit 1
}

# 9. Verificar que hay cambios
$status = git status --porcelain
if (-not $status) {
    Write-Host "`nNOTA: No hay cambios para hacer commit" -ForegroundColor Yellow
    Write-Host "Los archivos ya estan actualizados" -ForegroundColor Gray
    Set-Location $currentPath
    exit 0
}

# 10. Agregar y commitear cambios
Write-Host "`nGuardando cambios en Git..." -ForegroundColor Yellow
git add .
$commitMessage = "Deploy: Actualizacion del juego Ahorcado - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo hacer commit" -ForegroundColor Red
    Set-Location $currentPath
    exit 1
}

Write-Host "OK: Commit realizado" -ForegroundColor Green

# 11. Obtener informacion del remote
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "`nNOTA: No hay remote configurado" -ForegroundColor Yellow
    Write-Host "Configura el remote con: git remote add origin <url>" -ForegroundColor Gray
    Set-Location $currentPath
    exit 1
}

# 12. Subir a GitHub
Write-Host "`nSubiendo a GitHub..." -ForegroundColor Yellow
git push origin ahorcado

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nEXITO: Despliegue completado!" -ForegroundColor Green
    Write-Host "`nConfiguracion de GitHub Pages:" -ForegroundColor Cyan
    Write-Host "   1. Ve a tu repositorio en GitHub" -ForegroundColor White
    Write-Host "   2. Settings -> Pages" -ForegroundColor White
    Write-Host "   3. Source: Deploy from a branch" -ForegroundColor White
    Write-Host "   4. Branch: 'ahorcado' -> '/ (root)'" -ForegroundColor White
    Write-Host "   5. Save" -ForegroundColor White
    
    # Intentar extraer usuario y repo de la URL
    if ($remoteUrl -match "github\.com[:/](.+?)\.git") {
        $repoPath = $matches[1]
        Write-Host "`nRepositorio: https://github.com/$repoPath (rama: ahorcado)" -ForegroundColor White
        
        # Construir URL de GitHub Pages
        $parts = $repoPath -split "/"
        if ($parts.Length -eq 2) {
            $user = $parts[0]
            $repo = $parts[1]
            Write-Host "`nURL de GitHub Pages (despues de configurar):" -ForegroundColor Cyan
            Write-Host "   https://$user.github.io/$repo/ahorcado/" -ForegroundColor White
        }
    }
} else {
    Write-Host "`nERROR: No se pudo subir a GitHub" -ForegroundColor Red
    Write-Host "Verifica tu conexion y credenciales de Git" -ForegroundColor Yellow
}

# 13. Volver a la carpeta original
Set-Location $currentPath
Write-Host "`nProceso completado" -ForegroundColor Cyan
