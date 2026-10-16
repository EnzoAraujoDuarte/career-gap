# Testes

Como verificar uma mudança em qualquer projeto. Quanta verificação uma mudança pede depende do risco dela, definido em `trabalhar-com-ia.md`.

- TST-01: Verifique toda mudança de comportamento na medida do risco. Num projeto com suíte de testes, isso é um teste no mesmo PR. Num projeto sem suíte, rode as verificações que o `AGENTS.md` lista e registre a conferência manual no PR.
- TST-02: Escolha o nível de teste que dá mais confiança pelo custo. Um teste que passa pela rota, pelo job ou pela consulta de verdade costuma valer mais que vários testes unitários com mocks. Use teste unitário para lógica com muitos casos. Simule só o que o ambiente de teste não consegue rodar: APIs de terceiros, o relógio, o acaso.
- TST-03: Correção de bug começa reproduzindo o bug. Escreva um teste que falha pelo mesmo motivo do bug, conserte e veja o teste passar. Sem suíte, reproduza à mão e registre os passos.
- TST-04: Nunca apague, pule ou enfraqueça um teste para a suíte passar. Se um teste está errado, mude-o de propósito e diga por quê.
- TST-05: Relate o que você rodou de fato: o comando e o resultado. Nunca diga que uma verificação passou se não a rodou.
