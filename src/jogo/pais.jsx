import React,{ Component } from 'react' 
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ativar_ia,adicionar, remover, atacar, sair, atacou, removerAtaque, commit, refresh } from './jogoActions'

class Pais extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ação: "deploy",
            plusAction: "btn btn-danger btn-sm",
            arrowAction: "btn btn-danger btn-sm",
            plusPopover: "",
            value: '',
            setaAnimada: <div></div>,
            direcao: "",
            cursor: ""
        }

        this.changeColor = this.changeColor.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
       
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        this.props.atacou(this.props.paisAtacka,this.props.paisRecebe,this.state.value,this.state.direcao)
    }
    cancelar(numero,evento) {
        this.props.remover(numero,evento)
        this.forceUpdate()
    }
    cancelarAtaque(numero,evento) {
        this.props.removerAtaque(numero,evento)
        
        this.forceUpdate()
    }
    changeColor(action) {
        
       if(action == 0) {
            for(var a = 0;a < 3;a++) {
                if(this.props.pais[a].ACIONADO) {
                    this.props.pais[a].ACIONADO = false
                }
            }
            this.setState({
                ação: "deploy",
                plusAction: "btn btn-success btn-sm",
                arrowAction: "btn btn-danger btn-sm",
                plusPopover: <div className="meu_popover">
                                <div className="meu_popover_conteudo" >
                                    <small className="popover__message">0/{this.props.quantidade}</small>
                                </div>
                            </div>
            });
       } else {
            for(var a = 0;a < 3;a++) {
                if(this.props.pais[a].BORDAS) {
                    this.props.pais[a].BORDAS = false
                }
            }
            this.setState({
                ação: "ataque",
                arrowAction: "btn btn-success btn-sm",
                plusAction: "btn btn-danger btn-sm"
            });
       }
    }
    btnAction(algo,seila,op) {

        if(this.props.quantidade == 0) {
           this.state.ação = "ataque" 
            
           this.changeColor(1);
        }
        if(this.state.ação == "deploy") {
            this.props.adicionar(algo,seila);
            for(var a = 0;a < 3;a++) {
                if(this.props.pais[a].BORDAS) {
                    this.props.pais[a].BORDAS = false
                }
            }
            this.props.pais[algo].BORDAS = true
            this.changeColor(0);
        } else {
            for(var a = 0;a < 3;a++) {
                if(this.props.pais[a].ACIONADO) {
                    this.props.pais[a].ACIONADO = false
                }
            }
            this.props.pais[algo].BORDAS = false
            this.props.pais[algo].ACIONADO = true
            this.forceUpdate()
        }
    }
    atacou(pais,coordenada,evento,direcao) {
        this.state.direcao = evento
        this.props.atacar(pais,coordenada,evento)
    }
    
    commitando(isto) {
        if(this.props.iaAtivada)
            this.props.ativar_ia()    
        
        
        var contador = 0;
        for(var a = 0;a < 3;a++) {
            if(this.props.pais[a].ACIONADO) {
                this.props.pais[a].ACIONADO = false
            }
        }
        this.recursiva(contador)
        for(var aux=0;aux < this.props.pais.length;aux++) {
            this.props.pais[aux].TOTAL_DE_ATAQUES = 0
        }
    }
    recursiva(cont){
        var pais = this.props.pais
        var transition = ""
        var positLEFT = pais[this.props.listaDeAtaques[cont][0]].POSITION.LEFT
        var positionTop = pais[this.props.listaDeAtaques[cont][0]].POSITION.TOP
        if(pais[this.props.listaDeAtaques[cont][0]].JOGADOR){
            if(pais[this.props.listaDeAtaques[cont][0]].POSITION.LEFT > pais[this.props.listaDeAtaques[cont][1]].POSITION.LEFT)
                transition = "setaEsquerdaAnimada"
            else 
                transition = "setaDireitaAnimada"
                positLEFT = parseInt(positLEFT) + 50
        }
        if(this.props.listaDeAtaques[cont][3] == "CIMA") {

        } else if(this.props.listaDeAtaques[cont][3] == "ESQUERDA") {
            transition = "setaEsquerdaAnimada"
        } else if(this.props.listaDeAtaques[cont][3] == "DIREITA") {
            transition = "setaDireitaAnimada"
            positLEFT = parseInt(positLEFT) + 25
        }
        const estiloSetaAnimada = { 
            left: positLEFT+'px',top: positionTop+'px',color:"red"
        }
        this.setState({
            setaAnimada: <div className={transition} style={estiloSetaAnimada}>{this.props.listaDeAtaques[cont][2]}</div>
        });
        this.props.commit(cont)
        var refreshId = setInterval(() => {
            if(cont < this.props.listaDeAtaques.length - 1){
                cont++;
                this.recursiva(cont)
            } else {
                this.setState({setaAnimada: "",cursor: "pointer",ação: "deploy"})
                this.props.refresh()
                clearInterval(refreshId)
            }
        }, 4000);
    }
    render() {
        
        //for(var value of this.props.listaDeOrdens){}

        const renderRows = () => {
            const listaRender = [];
            for (let i = 0; i < this.props.listaDeOrdens.length; i++) {
                listaRender.push({
                    conteudo: <li>
                                <i className="fa fa-close btn btn-danger btn-sm" onClick={this.cancelar.bind(this,i)}></i>
                                <small>Deploy {this.props.listaDeOrdens[i][0]} To {this.props.listaDeOrdens[i][1]}</small>
                            </li> 
                });
            }
            return (<div>
                {listaRender.map((lista, index) => (
                    <p key={index}>{lista.conteudo}</p>
                ))}
                </div>);
        }
        

        const renderAtaques = () => {
            const listaAtaques = [];
            const pais = this.props.pais
            for (let i = 0; i < this.props.listaDeAtaques.length; i++) {
                listaAtaques.push({
                    conteudo: <li>
                                <i className="fa fa-close btn btn-danger btn-sm" onClick={this.cancelarAtaque.bind(this,i)}></i>
                                <small>
                                    {this.props.listaDeAtaques[i][2]} armies from {pais[this.props.listaDeAtaques[i][0]].NOME} Will attack/transfer to {pais[this.props.listaDeAtaques[i][1]].NOME}
                                </small>
                            </li> 
                });
            }
            return (<div>
                {listaAtaques.map((lista, index) => (
                    <p key={index}>{lista.conteudo}</p>
                ))}
                </div>);
        }

        const hidden = {visibility: "hidden"}
        const initial = {visibility: "initial"}
        const block = {display: "block"}
        const none = {display: "none"}
        const bordas = {border: "5px solid yellow"}
        const opaco = {opacity: 0.7}
        const zoom = {zoom: 1.3}
        const inlineBlock = {display: "inline-block"}
        var listaDePaises = {} 
        for(var contadorDePaises = 0;contadorDePaises < 3;contadorDePaises++){
            var operador;
            if(this.props.pais[contadorDePaises].JOGADOR == "PLAYER") {
                operador = "btn btn-success"
            } else if(this.props.pais[contadorDePaises].JOGADOR == "INIMIGO") {
                operador = "btn btn-danger"
            } else {
                operador = "btn btn-secondary"
            }
            listaDePaises[contadorDePaises] =
            <div className="popover__wrapper" >
                    <button className={operador} style={(this.props.pais[contadorDePaises].BORDAS) ? bordas : block} onClick={this.btnAction.bind(this,contadorDePaises,operador)}
                        disabled={(this.props.pais[contadorDePaises].JOGADOR == "PLAYER") ? false : true}>
                        <div style={(this.props.pais[contadorDePaises].ACIONADO) ? block : none}>
                            <span className="cima" 
                                style={(typeof this.props.pais[contadorDePaises].SETAS.CIMA == "number") ? initial : hidden}
                                onClick={this.atacou.bind(this, contadorDePaises,this.props.pais[contadorDePaises].SETAS.CIMA,"CIMA")}></span>
                            <span className="esquerda"
                                style={(typeof this.props.pais[contadorDePaises].SETAS.ESQUERDA == "number") ? initial : hidden}
                                onClick={this.atacou.bind(this, contadorDePaises,this.props.pais[contadorDePaises].SETAS.ESQUERDA,"ESQUERDA")}></span>
                            <span className="direita"
                                style={(typeof this.props.pais[contadorDePaises].SETAS.DIREITA == "number") ? initial : hidden}
                                onClick={this.atacou.bind(this, contadorDePaises,this.props.pais[contadorDePaises].SETAS.DIREITA,"DIREITA")}></span>
                            <span className="baixo"
                                style={(typeof this.props.pais[contadorDePaises].SETAS.BAIXO == "number") ? initial : hidden}
                                onClick={this.atacou.bind(this, contadorDePaises,this.props.pais[contadorDePaises].SETAS.BAIXO,"BAIXO")}></span>
                        </div>
                        {this.props.pais[contadorDePaises].VALOR}
                    </button>
                <div className="popover__content" >
                    <small className="popover__message">{this.props.pais[contadorDePaises].NOME}</small>
                </div>
           </div>
        }
        return (
            <div>
                <main className="main" style={(this.props.modal) ? opaco : block}>
                    <div className="divActions">
                        <span className={this.state.plusAction} onClick={() => this.changeColor(0)}>
                            <i className="fa fa-plus"></i>
                        </span>
                        <span className={this.state.arrowAction} onClick={() => this.changeColor(1)}>
                            <i className="fa fa-arrow-right"></i>
                        </span>
                        <br/>
                        <span>{this.state.plusPopover}</span>
                        <button className="btn btn-outline-danger btn-sm" 
                            onClick={(this.props.quantidade <= 0) ? this.commitando.bind(this) : false}>Commit</button>
                    </div>
                    <section>
                        
                        {this.state.setaAnimada}
                        <div className="pais0">
                            {listaDePaises[0]}   
                        </div>
                        <div className="pais1">
                            {listaDePaises[1]}   
                        </div>
                        <div className="pais2">
                            {listaDePaises[2]}
                        </div>
                    </section>
                    <section className="sectionOrders">
                        <div>
                            <i className="fa fa-clipboard"></i><p>Ordens</p>
                            <ul>        
                                {renderRows()}
                                {renderAtaques()}
                            </ul>
                        </div>
                        <div>
                            <i className="fa fa-user"></i><p>Players</p>
                        </div>
                    </section>
                </main>
                <section className="modalSection">              
                        <div style={(this.props.modal) ? block : none}>
                            <div>
                                <h1>ATTACK OR TRANSFER</h1>
                                <th>
                                    <td>{(typeof this.props.paisAtacka != "undefined") ? this.props.pais[this.props.paisAtacka].NOME : false}</td>
                                    <td>------------------></td>
                                    <td>{(typeof this.props.paisRecebe != "undefined") ? this.props.pais[this.props.paisRecebe].NOME : false}</td>
                                </th>
                                <tr>
                                  
                                    <td>{(typeof this.props.paisAtacka != "undefined") ? this.props.pais[this.props.paisAtacka].VALOR - this.props.pais[this.props.paisAtacka].TOTAL_DE_ATAQUES : false}</td>
                                    <td>{(typeof this.props.paisRecebe != "undefined") ? this.props.pais[this.props.paisRecebe].VALOR : false}</td>
                                </tr>
                                <br/>
                                <form onSubmit={this.handleSubmit}>
                                    <input type="number" value={this.state.value} onChange={this.handleChange}
                                    max={(typeof this.props.paisAtacka != "undefined") ? this.props.pais[this.props.paisAtacka].VALOR - this.props.pais[this.props.paisAtacka].TOTAL_DE_ATAQUES : false}  />
                                    <input type="submit" value="Okay" className="btn btn-success btn-sm inputSubmit" />                        
                                </form>
                                <button className="btn btn-danger btn-sm " onClick={this.props.sair}>Cancel</button>
                                
                            </div>
                        </div>
                    </section>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pais: state.jogo.pais,
    quantidade: state.jogo.quantidade,
    listaDeOrdens: state.jogo.listaDeOrdens,
    modal: state.jogo.modal,
    paisAtacka: state.jogo.paisAtacka,
    paisRecebe: state.jogo.paisRecebe,
    direcao: state.jogo.direcao,
    listaDeAtaques: state.jogo.listaDeAtaques,
    iaAtivada: state.jogo.iaAtivada
})

const mapDispatchToProps = dispatch => 
    bindActionCreators({ ativar_ia,adicionar, remover,atacar, sair, atacou, removerAtaque, commit, refresh }, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Pais)


// = (!$user) ? "Digite o seu usuário" : ($user == $mc_user) ? "Este usuário já existe: <b>''$user''</b>" : '' ;