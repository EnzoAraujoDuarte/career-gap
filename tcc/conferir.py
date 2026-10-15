"""Renderiza o PDF, descobre a pagina real de cada ancora e realimenta paginas.json."""
import json, re, subprocess, os
import pymupdf

SOFFICE = '/Applications/LibreOffice.app/Contents/MacOS/soffice'
DOCX, PDF = 'PROJETO_TCC_CAREER_GAP.docx', 'PROJETO_TCC_CAREER_GAP.pdf'

# chave -> texto que abre a secao/legenda, na ordem em que aparece no corpo
ANCORAS = {
    'intro': 'INTRODUÇÃO',
    's1':   '1 PROBLEMA DE PESQUISA E HIPÓTESES',
    's11':  '1.1 DELIMITAÇÃO DO PÚBLICO-ALVO',
    's2':   '2 OBJETIVOS',
    's21':  '2.1 OBJETIVO GERAL',
    's22':  '2.2 OBJETIVOS ESPECÍFICOS',
    's3':   '3 PROCEDIMENTOS METODOLÓGICOS E ANÁLISE DE DADOS',
    's31':  '3.1 IDENTIFICAÇÃO DAS LACUNAS DE CONHECIMENTO',
    's32':  '3.2 GERAÇÃO DO ROADMAP',
    's33':  '3.3 AVALIAÇÃO COM USUÁRIOS',
    's4':   '4 REFERENCIAL TEÓRICO',
    's41':  '4.1 A LACUNA ENTRE FORMAÇÃO E INDÚSTRIA DE SOFTWARE',
    's42':  '4.2 COMPETÊNCIAS PROFISSIONAIS E MODELOS DE NÍVEL',
    's43':  '4.3 ROADMAPS E SEQUENCIAMENTO DE APRENDIZAGEM',
    's44':  '4.4 PERSONALIZAÇÃO E SISTEMAS DE RECOMENDAÇÃO',
    'ref':  'REFERÊNCIAS',
}
PRE_TEXTUAIS = 3  # capa, folha de rosto, sumario


def render():
    if os.path.exists(PDF):
        os.remove(PDF)
    subprocess.run([SOFFICE, '--headless', '--convert-to', 'pdf', DOCX],
                   capture_output=True, timeout=240)
    return pymupdf.open(PDF)


def localizar(doc):
    """Pagina de cada ancora, ignorando as paginas pre-textuais."""
    paginas, texto = {}, {}
    for i in range(PRE_TEXTUAIS, doc.page_count):
        texto[i + 1] = re.sub(r'\s+', ' ', doc[i].get_text())
    for chave, alvo in ANCORAS.items():
        alvo_n = re.sub(r'\s+', ' ', alvo)
        for pagina in sorted(texto):
            if alvo_n in texto[pagina]:
                paginas[chave] = pagina
                break
        else:
            paginas[chave] = 0
    return paginas


anterior = None
for tentativa in range(1, 6):
    doc = render()
    atual = localizar(doc)
    faltando = [k for k, v in atual.items() if v == 0]
    print(f'passada {tentativa}: {doc.page_count} paginas' +
          (f' | NAO ENCONTRADO: {faltando}' if faltando else ''))
    if atual == anterior:
        print('estavel.')
        break
    json.dump(atual, open('paginas.json', 'w'), indent=1, ensure_ascii=False)
    subprocess.run(['node', 'gerar.js'], capture_output=True, check=True)
    anterior = atual
else:
    print('nao estabilizou em 5 passadas')

doc = render()
print(f'\nfinal: {doc.page_count} paginas')
for k, v in localizar(doc).items():
    print(f'  {k:>5} -> p.{v}')
