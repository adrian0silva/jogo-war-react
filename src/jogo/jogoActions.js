export function ativar_ia(){
    return {
        type: "IA_ATIVADA"
    }
}
export function adicionar(a,pais) {
    return {
        type: "ADICIONAR_VALOR",
        btn: pais,
        numero: a
    }
}

export function remover(num,event) {
    return {
        type: "REMOVER_AÇÂO",
        numeroDaLista: num
    }
}

export function removerAtaque(num,event) {
    return {
        type: "REMOVER_ATAQUE",
        numeroDaLista: num
    }
}

export function atacar(pais,coordenada,evento,direcao) {
    return {
        type: "CRIAR_MODAL",
        pais: pais,
        coordenada: coordenada
    }
}

export function sair() {
    return {
        type: "SAIR"
    }
}

export function atacou(paisAtacka,paisRecebe,valor,direcao) {
    return {
        type:"ATAQUE/TRANSFERIR",
        paisAtacka: paisAtacka,
        paisRecebe: paisRecebe,
        valor: valor,
        direcao: direcao
    }
}

export function commit(params) {
    return {
        type: "COMMITAR",
        payload: params
    }
} 

export function refresh(){
    return{
        type:"REFRESH"
    }
}