#!/usr/bin/env python3
"""
Minificador básico de CSS e JS para otimização de landing pages
"""
import re
import sys

def minify_css(css):
    """Minifica CSS removendo comentários, espaços e quebras de linha"""
    # Remove comentários /* */
    css = re.sub(r'/\*[\s\S]*?\*/', '', css)
    # Remove quebras de linha
    css = css.replace('\n', '').replace('\r', '')
    # Remove espaços múltiplos
    css = re.sub(r'\s+', ' ', css)
    # Remove espaços ao redor de caracteres especiais
    css = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css)
    # Remove espaço antes de !important
    css = css.replace(' !important', '!important')
    # Remove ponto e vírgula antes de }
    css = re.sub(r';\}', '}', css)
    # Remove espaços no início e fim
    return css.strip()

def minify_js(js):
    """Minifica JS removendo comentários e espaços desnecessários"""
    # Remove comentários de linha única //
    js = re.sub(r'//.*?(?=\n|$)', '', js)
    # Remove comentários de múltiplas linhas /* */
    js = re.sub(r'/\*[\s\S]*?\*/', '', js)
    # Remove quebras de linha desnecessárias (preserva strings)
    lines = []
    for line in js.split('\n'):
        line = line.strip()
        if line:
            lines.append(line)
    js = '\n'.join(lines)
    # Remove espaços ao redor de operadores (com cuidado)
    js = re.sub(r'\s*([{}();,=+\-*/<>!&|])\s*', r'\1', js)
    # Restaura espaços necessários para palavras-chave
    js = re.sub(r'(\w)(if|else|for|while|return|function|const|let|var|new|typeof|instanceof)(\w)', r'\1 \2 \3', js)
    # Remove espaços múltiplos
    js = re.sub(r'\s+', ' ', js)
    return js.strip()

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Uso: python3 minify.py <tipo> <input> <output>")
        print("Tipo: css ou js")
        sys.exit(1)

    file_type = sys.argv[1]
    input_file = sys.argv[2]
    output_file = sys.argv[3]

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        if file_type == 'css':
            minified = minify_css(content)
        elif file_type == 'js':
            minified = minify_js(content)
        else:
            print(f"Tipo inválido: {file_type}")
            sys.exit(1)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)

        original_size = len(content)
        minified_size = len(minified)
        reduction = ((original_size - minified_size) / original_size) * 100

        print(f"✅ {input_file} → {output_file}")
        print(f"   Original: {original_size:,} bytes")
        print(f"   Minificado: {minified_size:,} bytes")
        print(f"   Redução: {reduction:.1f}%")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
