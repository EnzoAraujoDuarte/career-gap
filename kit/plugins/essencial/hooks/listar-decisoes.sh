#!/usr/bin/env bash
# Imprime o índice das decisões aceitas que valem para o repositório desta sessão.

registros="${CLAUDE_PLUGIN_ROOT}/../../decisoes"
projeto="${CLAUDE_PROJECT_DIR:-$PWD}"
remoto=$(git -C "$projeto" remote get-url origin 2>/dev/null)
repo=$(basename "${remoto:-$projeto}" .git)

campo() { sed -n "s/^$1: *//p" "$2" | head -1; }

do_repo=""
de_todos=""
for registro in "$registros"/[0-9]*.md; do
  [[ -f "$registro" && "$(campo status "$registro")" == aceita ]] || continue
  linha="- $(basename "$registro" | cut -c1-4) $(campo resumo "$registro")"
  case ",$(campo repos "$registro" | tr -d '[] ')," in
    *",$repo,"*) do_repo+="$linha"$'\n' ;;
    *",todos,"*) de_todos+="$linha"$'\n' ;;
  esac
done

[[ -z "$do_repo$de_todos" ]] && exit 0

echo "# Decisões"
echo
echo "Leia o registro completo em $registros/ antes de mudar código ligado a uma destas. Quando a IA-07 valer, proponha um registro novo."
[[ -n "$do_repo" ]] && printf '\n## %s\n%s' "$repo" "$do_repo"
[[ -n "$de_todos" ]] && printf '\n## Todos os projetos\n%s' "$de_todos"
exit 0
