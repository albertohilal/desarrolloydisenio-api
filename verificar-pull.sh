#!/bin/bash

echo "🔄 Verificando estado del repositorio..."

# Paso 1: Verificar si hay remoto configurado
if ! git remote | grep -q origin; then
  echo "❌ No se encontró el remoto 'origin'. Abortando."
  exit 1
fi

# Paso 2: Hacer fetch del remoto
git fetch origin

# Paso 3: Intentar hacer pull simulado
echo "🧪 Probando git pull sin aplicar cambios..."

if git pull --dry-run origin main 2>&1 | grep -q "unrelated histories"; then
  echo "⚠️ Conflicto de historia detectado: es necesario usar --allow-unrelated-histories"
  echo "👉 Ejecutá: git pull origin main --allow-unrelated-histories"
else
  echo "✅ No hay conflicto de historia. Podés usar: git pull origin main"
fi
