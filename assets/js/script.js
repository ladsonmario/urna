let seuVotoPara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');

/*vamos usar o etapaAtual para saber em qual etapa estamos
etapas[etapaAtual]; o JSON etapas possui 1 array com 2 objetos */
let etapaAtual = 0;

/*é a variável que irá controlar o número que está preenchido*/
let numero = '';
let votoBranco = false;

//para guardar os votos
let votos = [];

function comecarEtapa () {
    let etapa = etapas[etapaAtual];

    let numeroHtml = ''; //responsável por quantos números é necessário para o voto
    numero = ''; //o número que fica na memória também precisa ser reiniciado quando o processor de comecarEtapa iniciar, vale para o corrige
    votoBranco = false;

    //criamos um loop usando os numeros do JSON etapas da etapa atual
    for(let i=0; i<etapa.numeros; i++) {
        if(i === 0) { //para o primeiro quadrado ter a class pisca
            numeroHtml += '<div class="numero pisca"></div>';
        } else { //para o restante ter somente a class numero
            numeroHtml += '<div class="numero"></div>';
        }        
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo; //pega o titulo(cargo) que está na etapaAtual(0)
    descricao.innerHTML = ''; //o espaço vazio é para elemento permanecer alí, apenas estará vazio
    aviso.style.display = 'none';
    lateral.innerHTML = ''; //o espaço vazio é para elemento permanecer alí, apenas estará vazio
    numeros.innerHTML = numeroHtml;
    
}

//esta função será executada sempre que tivermos uma ação
function atualizaInterface () {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((i) => {
        if(i.numero === numero) {
            return true;
        } else {
            return false;
        }
    });
    if(candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;
        aviso.style.display = 'block';

        let fotosHtml = '';
        for(let i in candidato.fotos) {
            if(candidato.fotos[i].small) {
                fotosHtml += `<div class="d-1-image small"><img src="${candidato.fotos[i].src}" alt="" />${candidato.fotos[i].legenda}</div>`;
            } else {
                fotosHtml += `<div class="d-1-image"><img src="${candidato.fotos[i].src}" alt="" />${candidato.fotos[i].legenda}</div>`;
            }
        }

        lateral.innerHTML = fotosHtml;
    } else {
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `<div class="aviso">VOTO NULO</div>`;
    }
}

function clique (n) {
    let numeroPisca = document.querySelector('.numero.pisca');
    if(numeroPisca !== null) {
        numeroPisca.innerHTML = n;
        numero = `${numero}${n}`;
        numeroPisca.classList.remove('pisca'); //apois digitar o número a class pisca é removida
        if(numeroPisca.nextElementSibling !== null) {
            //obter o conteúdo HTML do próximo irmão de um item da lista e adicionar a class pisca
            numeroPisca.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}

function branco () {
    if(numero === '') {
        votoBranco = true;
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        numeros.innerHTML = '';
        descricao.innerHTML = `<div class="aviso">VOTO EM BRANCO</div>`;
    } else {
        window.alert(`Para votar em BRANCO o campo de voto deve estar vazio. Aperte CORRIGE para apagar o campo de voto.`)
    }
}

function corrige () {
    comecarEtapa();
}

function confirma () {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;
    if(votoBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if(numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }

    if(votoConfirmado) {
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined) {
            comecarEtapa();
        } else {
            document.querySelector('.reload').style.display = 'block';
            document.querySelector('.tela').innerHTML = `<div class="aviso fim">FIM</div><audio autoplay><source src="./midia/confirma.mp3" type="audio/mp3"></audio>`;
            console.log(votos);
        }
    }
}

comecarEtapa();

document.querySelector('.reload').addEventListener('click',()=>{
    window.location.reload();
});