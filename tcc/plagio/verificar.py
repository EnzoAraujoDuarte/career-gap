#!/usr/bin/env python
"""
Verificação de similaridade contra um corpus local.

Mede duas coisas diferentes, porque elas falham de formas diferentes:

  n-gramas  — trechos literalmente iguais. Pega cópia e colagem.
  TF-IDF    — proximidade de vocabulário. Pega reescrita superficial,
              mas sobe sozinho só por os textos serem do mesmo assunto.

Roda dois controles em toda execução, e o resultado só vale se ambos passarem:
  positivo — o documento contra si mesmo deve dar 100 %
  negativo — contra o corpus com a ordem das palavras invertida, os
             n-gramas devem dar ~0 %

Sem os controles, um zero pode ser originalidade ou ferramenta quebrada.
Foi assim que se descobriu que o copydetect marca 65 % em texto embaralhado.

Uso:  python verificar.py alvo.docx corpus/*.docx
"""
import sys, re, zipfile, unicodedata
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

N = 8  # 8 palavras seguidas: longo o bastante para não ser coincidência


def ler(caminho: Path) -> str:
    if caminho.suffix == '.docx':
        x = zipfile.ZipFile(caminho).read('word/document.xml').decode('utf8')
        return ' '.join(re.findall(r'<w:t(?: [^>]*)?>(.*?)</w:t>', x, re.S))
    return caminho.read_text(encoding='utf8')


def palavras(texto: str) -> list[str]:
    t = unicodedata.normalize('NFKD', texto.lower())
    t = ''.join(c for c in t if not unicodedata.combining(c))
    return re.findall(r'[a-z0-9]+', t)


def ngramas(ws: list[str], n: int = N) -> set[str]:
    return {' '.join(ws[i:i + n]) for i in range(len(ws) - n + 1)}


def comparar(alvo: list[str], referencia: list[str]) -> tuple[float, list[str]]:
    a, r = ngramas(alvo), ngramas(referencia)
    if not a:
        return 0.0, []
    comuns = sorted(a & r)
    return 100 * len(comuns) / len(a), comuns


def main(caminho_alvo: str, caminhos_corpus: list[str]) -> int:
    alvo_txt = ler(Path(caminho_alvo))
    alvo = palavras(alvo_txt)
    print(f'alvo: {caminho_alvo}  ({len(alvo)} palavras)\n')

    # --- controles ---------------------------------------------------------
    pos, _ = comparar(alvo, alvo)
    corpus_junto = [w for c in caminhos_corpus for w in palavras(ler(Path(c)))]
    neg, _ = comparar(alvo, list(reversed(corpus_junto)))
    ok = pos > 99 and neg < 1
    print(f'controle positivo (contra si mesmo): {pos:6.2f} %   esperado 100')
    print(f'controle negativo (corpus invertido): {neg:6.2f} %   esperado ~0')
    print(f'>> ferramenta {"CONFIAVEL" if ok else "NAO CONFIAVEL — ignore o resultado abaixo"}\n')

    # --- medição -----------------------------------------------------------
    textos = [alvo_txt]
    pior = 0.0
    for c in caminhos_corpus:
        txt = ler(Path(c))
        textos.append(txt)
        pct, comuns = comparar(alvo, palavras(txt))
        pior = max(pior, pct)
        print(f'{Path(c).name}')
        print(f'  trechos de {N} palavras em comum: {pct:.2f} %')
        for t in comuns[:12]:
            print(f'    • {t}')
        if len(comuns) > 12:
            print(f'    ... e mais {len(comuns) - 12}')

    m = TfidfVectorizer(ngram_range=(1, 2)).fit_transform(textos)
    print('\nproximidade de vocabulário (TF-IDF, sobe só por mesmo assunto):')
    for i, c in enumerate(caminhos_corpus, start=1):
        print(f'  {Path(c).name}: {100 * cosine_similarity(m[0], m[i])[0][0]:.1f} %')

    print(f'\nveredito: maior sobreposição literal = {pior:.2f} %')
    return 0 if ok else 1


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2:]))
