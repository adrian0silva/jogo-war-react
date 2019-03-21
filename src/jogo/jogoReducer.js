const INITIAL_STATE = {
    matriz: [
         //0 1 2
    /*0*/ [0,1,0],
    /*1*/ [1,0,1],
    /*2*/ [0,1,0],
    ],
    modal: false,
    iaAtivada: true,
    quantidade: 5,
    listaDeAtaques: [],
    listaDeOrdens: [],
    listaDeOrdensRender: [],
    pais: {
        0: {
            ID: 0,
            NOME: "ARGENTINA",
            VALOR: 40,
            JOGADOR: "PLAYER",
            ACIONADO: false,
            BORDAS: false,
            TOTAL_DE_ATAQUES:0,
            SETAS: {
                CIMA: false,
                DIREITA: 1,
                ESQUERDA: false,
                BAIXO: false
            },
            POSITION: {
                LEFT:10,
                TOP:150
            }
        },
        1: {
            ID: 1,
            NOME: "BRASIL",
            VALOR: 200,
            JOGADOR: "INIMIGO",
            ACIONADO: false,
            BORDAS: false,
            TOTAL_DE_ATAQUES:0,
            SETAS: {
                CIMA: false,
                DIREITA: 2,
                ESQUERDA: 0,
                BAIXO:false
            },
            POSITION: {
                LEFT:90,
                TOP:150
            }
        },
        2:{
            ID: 2,
            NOME: "CHILE",
            VALOR: 10,
            JOGADOR: "PLAYER",
            ACIONADO: false,
            BORDAS: false,
            TOTAL_DE_ATAQUES:0,
            SETAS: {
                CIMA: false,
                DIREITA: false,
                ESQUERDA: 1,
                BAIXO:false
            },
            POSITION: {
                LEFT:170,
                TOP:150
            }
        }
    }
}
export default (state = INITIAL_STATE,action) => {
    switch (action.type) {
        case "IA_ATIVADA":
            var paisInimigo = state.pais;
            var qtdInimigo = 0;
            for(var a = 0;a < 3;a++) {
                if(paisInimigo[a].JOGADOR == "INIMIGO")
                    qtdInimigo = qtdInimigo + 2
            }
            do{
                var valorAleatorio = Math.floor(Math.random() * (qtdInimigo + 1) + 0);
                do{
                    var paisAletorio = Math.floor(Math.random() * 3 + 0)
                }while(paisInimigo[paisAletorio].JOGADOR != "INIMIGO")
                paisInimigo[paisAletorio].VALOR = parseInt(paisInimigo[paisAletorio].VALOR) + parseInt(valorAleatorio) 
                qtdInimigo = qtdInimigo - valorAleatorio;
            } while(qtdInimigo > 1)
            
            do{
                var tentativa = Math.floor(Math.random() * 5 + 0)
                do{
                    var paisInimigoAtacka = Math.floor(Math.random() * 3 + 0)
                }while(paisInimigo[paisInimigoAtacka].JOGADOR == "PLAYER")
                if(paisInimigo[paisInimigoAtacka].VALOR == paisInimigo[paisInimigoAtacka].TOTAL_DE_ATAQUES) {
                    tentativa = 1
                }
                var temAdjacencia = false
                do{
                    var paisRecebe = Math.floor(Math.random() * 3 + 0)
                    if(state.matriz[paisInimigoAtacka][paisRecebe] == 1)
                        temAdjacencia = true
                }while(temAdjacencia == false)
                
                var valorAtaque = Math.floor(Math.random() * (paisInimigo[paisInimigoAtacka].VALOR - paisInimigo[paisInimigoAtacka].TOTAL_DE_ATAQUES) + 0)
                if(valorAtaque == 0) {
                    tentativa = 1
                }
                paisInimigo[paisInimigoAtacka].TOTAL_DE_ATAQUES = paisInimigo[paisInimigoAtacka].TOTAL_DE_ATAQUES + valorAtaque 
                var novaListaDeAtaquesIni = state.listaDeAtaques
                var existe = false
                for (let value of novaListaDeAtaquesIni) {
                    if(value[0] == paisInimigoAtacka && value[1] == paisRecebe) {
                        value[2] = parseInt(value[2]) + parseInt(valorAtaque)
                        existe = true
                    }
                }
                if(!existe){
                    novaListaDeAtaquesIni.push([paisInimigoAtacka,paisRecebe,valorAtaque])
                }
                

            } while(tentativa > 1)

            return {
                ...state,
                pais: paisInimigo,
                iaAtivada: false
            } 
        case"ADICIONAR_VALOR":
            const paisAdicionado = state.pais
            paisAdicionado[action.numero].VALOR = paisAdicionado[action.numero].VALOR + 1
            var novaListaDeOrdens = state.listaDeOrdens
            var existe = false;
            for (let value of novaListaDeOrdens) {
                if(paisAdicionado[action.numero].NOME == value[1]) {
                    value[0] = value[0] + 1
                    existe = true
                } 
            }
            if(!existe) {
                novaListaDeOrdens.push([1,paisAdicionado[action.numero].NOME])
            }

            return {
                ...state,
                pais: paisAdicionado,
                listaDeOrdens: novaListaDeOrdens,
                quantidade: state.quantidade - 1
            }
        case"REMOVER_AÇÂO":
            var removido = state.listaDeOrdens
            var qtdRetirada = removido[action.numeroDaLista][0]
            var paisNome = removido[action.numeroDaLista][1]
            for(var a = 0;a < 3;a++) {
                if(paisNome == state.pais[a].NOME) {
                    var idPaisRetirado = state.pais[a].ID
                }
            }
            var novoPais = state.pais
            novoPais[idPaisRetirado].VALOR = novoPais[idPaisRetirado].VALOR - qtdRetirada
            removido.splice(action.numeroDaLista,1)
            return {
                ...state,
                listaDeOrdens: removido,
                quantidade: state.quantidade + qtdRetirada,
                pais: novoPais
            }
        case "REMOVER_ATAQUE":
            var removerPais = state.listaDeAtaques
            var novoPais = state.pais
            novoPais[state.listaDeAtaques[action.numeroDaLista][0]].TOTAL_DE_ATAQUES = parseInt(novoPais[[state.listaDeAtaques[action.numeroDaLista][0]]].TOTAL_DE_ATAQUES) - parseInt(state.listaDeAtaques[action.numeroDaLista][2])
            removerPais.splice(action.numeroDaLista,1)
            
            return {
                ...state,
                listaDeAtaques: removerPais,
                pais: novoPais
            }
        case"CRIAR_MODAL":
            return {
                ...state,
                modal: true,
                paisAtacka: action.pais,
                paisRecebe: action.coordenada,
                direcao: action.direcao
            }
        case"SAIR":
            return {
                ...state,
                modal: false
            }
        case"ATAQUE/TRANSFERIR":
            var novaListaDeAtaques = state.listaDeAtaques
            var existe = false;
            for (let value of novaListaDeAtaques) {
                if(value[0] == action.paisAtacka && value[1] == action.paisRecebe) {
                    value[2] = parseInt(value[2]) + parseInt(action.valor)
                    existe = true
                }
            }
            if(!existe){
                novaListaDeAtaques.push([action.paisAtacka,action.paisRecebe,action.valor,action.direcao])
            }
            var novoPais = state.pais 
            novoPais[action.paisAtacka].TOTAL_DE_ATAQUES = parseInt(novoPais[action.paisAtacka].TOTAL_DE_ATAQUES) + parseInt(action.valor)
            var novoModal = state.modal
            novoModal = false

            return {
                ...state,
                listaDeAtaques: novaListaDeAtaques,
                pais: novoPais,
                modal: novoModal
            }
        case"COMMITAR":
            var pais = state.pais
            pais[state.listaDeAtaques[action.payload][0]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][0]].VALOR) - parseInt(state.listaDeAtaques[action.payload][2])
            pais[state.listaDeAtaques[action.payload][0]].TOTAL_DE_ATAQUES = parseInt(pais[state.listaDeAtaques[action.payload][0]].TOTAL_DE_ATAQUES) - parseInt(state.listaDeAtaques[action.payload][2])
            
            if(pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "PLAYER" && pais[state.listaDeAtaques[action.payload][1]].JOGADOR == "PLAYER")    
                pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) + parseInt(state.listaDeAtaques[action.payload][2])
            else if (pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "PLAYER" && pais[state.listaDeAtaques[action.payload][1]].JOGADOR == "INIMIGO")
                pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) - parseInt(state.listaDeAtaques[action.payload][2])
            else if (pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "INIMIGO" && pais[state.listaDeAtaques[action.payload][1]].JOGADOR == "PLAYER") 
                pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) - parseInt(state.listaDeAtaques[action.payload][2])
            else if (pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "INIMIGO" && pais[state.listaDeAtaques[action.payload][1]].JOGADOR == "INIMIGO")    
                pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) + parseInt(state.listaDeAtaques[action.payload][2])
       
            if(pais[state.listaDeAtaques[action.payload][1]].VALOR < 0) {
                if(pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "PLAYER") {
                    pais[state.listaDeAtaques[action.payload][1]].JOGADOR = "PLAYER"
                    pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) * -1
                } else if (pais[state.listaDeAtaques[action.payload][0]].JOGADOR == "INIMIGO") {
                    pais[state.listaDeAtaques[action.payload][1]].JOGADOR = "INIMIGO"
                    pais[state.listaDeAtaques[action.payload][1]].VALOR = parseInt(pais[state.listaDeAtaques[action.payload][1]].VALOR) * -1
                }
            }
            var listaDeAtaques = state.listaDeAtaques
            //listaDeAtaques.splice(0,1)
            return {
                ...state,
                pais: pais,
                listaDeAtaques: listaDeAtaques
            }
        case "REFRESH":
            var novaQuantidade = 0;
            for(var a = 0;a < 3;a++){
                if(state.pais[a].JOGADOR == "PLAYER") 
                    novaQuantidade = novaQuantidade + 2
            }
            if(novaQuantidade == 6) {
                alert("VOCE GANHOU!")
                document.write("VOCE GANHOU!")
            } else {
                alert("VOCE PERDEU!")
                document.write("VOCE PERDEU!")    
            }
            return {
                ...state,
                listaDeAtaques: [],
                listaDeOrdens: [],
                listaDeOrdensRender: [],
                quantidade: novaQuantidade,
                iaAtivada: true
            }
        default:
            return state;
    }
}