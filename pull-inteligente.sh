#!/bin/bash

echo "🔄 Verificando estado del repositorio..."

# Paso 1: Verificar si hay remoto configurado
if ! git remote | grep -q origin; then
  echo "❌ No se encontró el remoto 'origin'. Abortando."
  exit 1
fi

# Paso 2: Hacer fetch del remoto
git fetch origin

# Paso 3: Intentar pull simulado
echo "🧪 Probando git pull sin aplicar cambios..."

if git pull --dry-run origin main 2>&1 | grep -q "unrelated histories"; then
  echo "⚠️ Conflicto de historia detectado. Ejecutando: git pull origin main --allow-unrelated-histories"
  git pull origin main --allow-unrelated-histories
else
  echo "✅ Sin conflictos de historia. Ejecutando: git pull origin main"
  git pull origin main
fi
