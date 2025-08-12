#!/usr/bin/env pwsh
# Script PowerShell pour merger avec gestion automatique des versions

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("feature", "hotfix", "develop")]
    [string]$MergeType,
    
    [Parameter(Mandatory=$true)]
    [string]$BranchName,
    
    [switch]$PushTag
)

Write-Host "🚀 Merge avec gestion automatique des versions..." -ForegroundColor Green

# Fonction pour vérifier l'état du repo
function Test-RepoStatus {
    $status = git status --porcelain
    if ($status) {
        Write-Host "❌ Des modifications non commitées existent. Committez d'abord." -ForegroundColor Red
        Write-Host "Modifications détectées:" -ForegroundColor Yellow
        Write-Host $status -ForegroundColor Yellow
        exit 1
    }
}

# Fonction pour mettre à jour la version
function Update-Version {
    param([string]$VersionType)
    
    Write-Host "🔄 Mise à jour de la version ($VersionType)..." -ForegroundColor Yellow
    
    try {
        # Mettre à jour la version
        $result = npm version $VersionType --no-git-tag-version
        $newVersion = $result.Trim()
        
        Write-Host "✅ Version mise à jour : $newVersion" -ForegroundColor Green
        
        # Commiter la mise à jour de version
        git add package.json package-lock.json
        git commit -m "chore: bump version to $newVersion"
        
        # Créer le tag
        git tag -a "v$newVersion" -m "Release $newVersion"
        
        Write-Host "🏷️  Tag git créé : v$newVersion" -ForegroundColor Green
        
        return $newVersion
    }
    catch {
        Write-Host "❌ Erreur lors de la mise à jour de version: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Vérifier l'état du repo
Test-RepoStatus

# Déterminer le type de version selon le merge
$versionType = switch ($MergeType) {
    "feature" { "minor" }    # 1.0.0 -> 1.1.0
    "hotfix" { "patch" }     # 1.0.0 -> 1.0.1
    "develop" { "minor" }    # Par défaut, considérer comme une feature
}

Write-Host "📊 Type de merge : $MergeType" -ForegroundColor Cyan
Write-Host "📈 Type de version : $versionType" -ForegroundColor Cyan

# Mettre à jour la version
$newVersion = Update-Version -VersionType $versionType

# Effectuer le merge
Write-Host "🔄 Effectuation du merge..." -ForegroundColor Yellow

try {
    switch ($MergeType) {
        "feature" {
            # Merge feature vers develop
            git checkout develop
            git pull origin develop
            git merge $BranchName
            git push origin develop
            Write-Host "✅ Feature mergée vers develop" -ForegroundColor Green
        }
        "hotfix" {
            # Merge hotfix vers main puis develop
            git checkout main
            git pull origin main
            git merge $BranchName
            git push origin main
            
            git checkout develop
            git pull origin develop
            git merge $BranchName
            git push origin develop
            
            Write-Host "✅ Hotfix mergé vers main et develop" -ForegroundColor Green
        }
        "develop" {
            # Merge develop vers main
            git checkout main
            git pull origin main
            git merge develop
            git push origin main
            Write-Host "✅ Develop mergé vers main" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "❌ Erreur lors du merge: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Pousser le tag si demandé
if ($PushTag) {
    Write-Host "🏷️  Poussage du tag..." -ForegroundColor Yellow
    git push origin "v$newVersion"
    Write-Host "✅ Tag v$newVersion poussé" -ForegroundColor Green
}

# Nettoyage
Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
if ($MergeType -eq "feature" -or $MergeType -eq "hotfix") {
    git branch -d $BranchName
    Write-Host "✅ Branche $BranchName supprimée localement" -ForegroundColor Green
}

Write-Host "🎉 Merge terminé avec succès !" -ForegroundColor Green
Write-Host "📊 Résumé:" -ForegroundColor Cyan
Write-Host "   Type de merge : $MergeType" -ForegroundColor White
Write-Host "   Nouvelle version : $newVersion" -ForegroundColor White
Write-Host "   Tag : v$newVersion" -ForegroundColor White

if ($MergeType -eq "develop") {
    Write-Host "🚀 Déploiement Netlify déclenché automatiquement !" -ForegroundColor Green
}
