import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    acertos: 0,
    cronometro: '00:00',
    tempoInicio: 0,
    volumeOn: true,
    
    // Dados do jogo - AGORA SIMPLES E FUNCIONAL
    sequencia: [],
    opcoes: [],
    respostaCorreta: null,
    
    // Cores disponíveis
    cores: ['r', 'p', 'k', 'b', 'g', 'y']
  }),
  
  actions: {
    // GERA UM PADRÃO SIMPLES E FUNCIONAL
    gerarPadrao() {
      console.log('=== GERANDO NOVO PADRÃO ===');
      
      // Limpa dados anteriores
      this.sequencia = [];
      this.opcoes = [];
      this.respostaCorreta = null;
      
      // Escolhe um tipo de padrão aleatório
      const tipos = ['alternancia', 'repeticao', 'progressao'];
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      
      console.log('Tipo de padrão:', tipo);
      
      let cor1, cor2, cor3, resposta;
      
      switch(tipo) {
        case 'alternancia':
          // Padrão: A, B, A, B
          cor1 = this.obterCorAleatoria();
          cor2 = this.obterCorDiferente(cor1);
          resposta = cor2;
          
          this.sequencia = [
            { id: 1, cor: cor1, visivel: true },
            { id: 2, cor: cor2, visivel: true },
            { id: 3, cor: cor1, visivel: true },
            { id: 4, cor: null, visivel: false } // Último oculto
          ];
          break;
          
        case 'repeticao':
          // Padrão: A, A, B, B
          cor1 = this.obterCorAleatoria();
          cor2 = this.obterCorDiferente(cor1);
          resposta = cor2;
          
          this.sequencia = [
            { id: 1, cor: cor1, visivel: true },
            { id: 2, cor: cor1, visivel: true },
            { id: 3, cor: cor2, visivel: true },
            { id: 4, cor: null, visivel: false } // Último oculto
          ];
          break;
          
        case 'progressao':
          // Padrão: A, B, C, D (todas diferentes)
          const coresAleatorias = this.obterCoresDiferentes(4);
          cor1 = coresAleatorias[0];
          cor2 = coresAleatorias[1];
          cor3 = coresAleatorias[2];
          resposta = coresAleatorias[3];
          
          this.sequencia = [
            { id: 1, cor: cor1, visivel: true },
            { id: 2, cor: cor2, visivel: true },
            { id: 3, cor: cor3, visivel: true },
            { id: 4, cor: null, visivel: false } // Último oculto
          ];
          break;
      }
      
      this.respostaCorreta = resposta;
      console.log('Resposta correta:', resposta);
      console.log('Sequência:', this.sequencia);
      
      // Gera opções de resposta
      this.gerarOpcoes(resposta);
      console.log('Opções geradas:', this.opcoes);
    },
    
    // Obtém uma cor aleatória
    obterCorAleatoria() {
      return this.cores[Math.floor(Math.random() * this.cores.length)];
    },
    
    // Obtém uma cor diferente da fornecida
    obterCorDiferente(corExcluir) {
      let cor;
      do {
        cor = this.obterCorAleatoria();
      } while (cor === corExcluir);
      return cor;
    },
    
    // Obtém N cores diferentes
    obterCoresDiferentes(quantidade) {
      const copiaCores = [...this.cores];
      const resultado = [];
      
      for (let i = 0; i < quantidade && copiaCores.length > 0; i++) {
        const index = Math.floor(Math.random() * copiaCores.length);
        resultado.push(copiaCores.splice(index, 1)[0]);
      }
      
      return resultado;
    },
    
    // Gera as opções de resposta
    gerarOpcoes(respostaCorreta) {
      const opcoes = [];
      
      // Adiciona a resposta correta
      opcoes.push({
        id: 'correta',
        cor: respostaCorreta,
        correto: true
      });
      
      // Adiciona opções incorretas
      const coresIncorretas = this.cores.filter(cor => cor !== respostaCorreta)
                                       .sort(() => 0.5 - Math.random())
                                       .slice(0, 5);
      
      coresIncorretas.forEach((cor, index) => {
        opcoes.push({
          id: `errada_${index}`,
          cor: cor,
          correto: false
        });
      });
      
      // Embaralha as opções
      this.opcoes = opcoes.sort(() => 0.5 - Math.random());
    },
    
    // Verifica se a resposta está correta
    verificarResposta(opcaoId) {
      const opcao = this.opcoes.find(o => o.id === opcaoId);
      
      if (opcao && opcao.correto) {
        this.acertos++;
        return true;
      }
      return false;
    },
    
    // Reinicia o jogo
    resetGame() {
      this.acertos = 0;
      this.cronometro = '00:00';
      this.tempoInicio = 0;
      this.sequencia = [];
      this.opcoes = [];
      this.respostaCorreta = null;
    }
  }
})