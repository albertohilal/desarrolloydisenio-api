#!/bin/bash

echo "🔄 Sincronización inteligente iniciada..."

# Verificar que haya un remoto llamado origin
if ! git remote | grep -q origin; then
  echo "❌ No se encontró el remoto 'origin'. Abortando."
  exit 1
fi

# Traer información del remoto
echo "📥 Ejecutando git fetch origin..."
git fetch origin

# Verificar si hay conflicto de historia
echo "🧪 Verificando posibles conflictos de historia..."
if git pull --dry-run origin main 2>&1 | grep -q "unrelated histories"; then
  echo "⚠️ Conflicto de historia detectado. Ejecutando: git pull origin main --allow-unrelated-histories"
  git pull origin main --allow-unrelated-histories
else
  echo "✅ Sin conflictos de historia. Ejecutando: git pull origin main"
  git pull origin main
fi

# Comparar diferencias entre local y remoto después del pull
AHEAD=$(git rev-list --left-right --count origin/main...HEAD | awk '{print $2}')
BEHIND=$(git rev-list --left-right --count origin/main...HEAD | awk '{print $1}')

if [ "$AHEAD" -gt 0 ] && [ "$BEHIND" -eq 0 ]; then
  echo "🚀 Subiendo $AHEAD commit(s) local(es) al repositorio remoto..."
  git push origin main
elif [ "$BEHIND" -gt 0 ]; then
  echo "⚠️ Todavía estás detrás del repositorio remoto por $BEHIND commit(s)."
  echo "🔁 Ejecutá: git pull origin main nuevamente o resolvé conflictos si existen."
else
  echo "📦 Todo está sincronizado. No hay nada para subir."
fi
