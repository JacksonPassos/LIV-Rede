//carrega select materialize
$(document).ready(function () {
    $('select').material_select();
    $('.loading').hide();
    $('.div-pesquisa').children().hide();

    getPlanos();


    $('#pesquisa').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            pesquisa();
        }
    });

});

function getPlanos() {

    const URL_REDE = 'https://us-central1-appliv-6385b.cloudfunctions.net/consultas/redes/'

    axios.get(URL_REDE)
        .then(res => {

            let selectPlano = document.querySelector(".div-planos");

            selectPlano.innerHTML = "";

            let html = '<select id="planos" onchange="getCidades();">' +
                '<option value="" disabled selected>Qual o plano/rede?</option>'
            const dados = res.data
            const recebeRedes = []

            for (let aux in dados) {
                if (aux != 0) {

                    // BUSCANDO A DESCRICAO DE CADA REDE

                    recebeRedes.push({
                        "descricao": dados[aux].descricao,
                        "idRede": dados[aux].idRede
                    })
                }
            }

            for (let aux in recebeRedes) {
                html += "<option value='" + recebeRedes[aux].idRede + "'> " + recebeRedes[aux].descricao + " </option>";
            }

            html += '</select>';

            selectPlano.innerHTML = html;

            $('select').material_select();

        })
        .catch(() => console.log("Erro ao buscar dados da API."))
}


function getCidades() {
    $('.result').hide();
    $('.div-pesquisa').children().hide();
    $('.loading').show(); //mostra o loader
    resetPlano();

    let idRede = $('#planos').val();

    //renderizar select cidades
    const URL_CIDADE = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacao/cidades/' + idRede

    axios.get(URL_CIDADE)
        .then(res => {

            let selectCidade = document.querySelector(".div-cidade");

            selectCidade.innerHTML = "";

            let html = '<select id="cidades" onchange="getEspecialidades();">' +
                '<option value="" disabled selected>Estou em</option>'
            let dados = res.data

            let listaCidades = dados

            for (let indice in listaCidades) {
                if (listaCidades[indice].Cid_ds == "FORTALEZA") {
                    let aux = listaCidades[0]
                    listaCidades[0] = listaCidades[indice];
                    listaCidades[indice] = aux
                }
            }


            for (let aux in listaCidades) {
                html += "<option value='" + aux + "'> " + listaCidades[aux].Cid_ds.trim() + " </option>";
            }

            html += '</select>';

            selectCidade.innerHTML = html;

            $('select').material_select();


        })
        .catch(() => console.log("Erro ao buscar dados da API."))

    //mostrar resultados
    const URL_REDE = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacao/redes/' + idRede + '/pagina/1/'

    axios.get(URL_REDE)
        .then(res => {

            let dados = res.data.dados
            //console.log(dados) // OK

            let recebeRedes = []

            //if (this.state.paginaAtual > this.state.totalPaginacao || this.state.totalPaginacao >= this.state.paginaAtual) {

            for (var aux in dados) {
                //if (aux != 0) {

                recebeRedes.push({
                    "idRede": dados[aux].idRede,
                    "descricao": dados[aux].descricao,
                    "credenciamentoLocal": dados[aux].credenciamentoLocal,
                    "razaoSocial": dados[aux].razaoSocial,
                    "localAtendto": dados[aux].localAtendto,
                    "especialidade": dados[aux].especialidade.trim(),
                    "especialidades": dados[aux].especialidades,
                    "idEsp": dados[aux].idEsp,
                    "ibge": dados[aux].ibge.trim(),
                    "logradouro": dados[aux].logradouro,
                    "cidade": dados[aux].cidade,
                    "bairro": dados[aux].bairro,
                    "endereco": dados[aux].end,
                    "tipoDesc": dados[aux].tipoDesc,
                    "fone1": dados[aux].fone1,
                    "uf": dados[aux].uf,
                    "cnpj": dados[aux].cnpj,
                    "nroRegistro": dados[aux].nroRegistro, // CRM - MEDICO
                })
            }

            //ordena em ordem alfabética
            recebeRedes.sort(function (rede1, rede2) {
                return (rede1.descricao > rede2.descricao) ? 1 : ((rede2.descricao > rede1.descricao) ? -1 : 0);
            });

            let result = document.querySelector(".result");

            result.innerHTML = "";

            result.innerHTML += formataResult(recebeRedes);

            $('.loading').hide(); //esconde o loader
            $('.result').show();

        })
        .catch(() => console.log("Erro ao buscar dados da API."))
}

function getEspecialidades() {
    $('.result').hide();
    $('.loading').show(); //mostra o loader
    resetCidade();

    let idRede = $('#planos').val();
    let cidadeSelecionada = $('#cidades option:selected').text();

    let loweredText = cidadeSelecionada.trim().replace(/\s{2,}/g, ' ').toLowerCase();
    let words = loweredText.split(" ");

    for (let a = 0; a < words.length; a++) {
        let w = words[a];
        let firstLetter = w[0];

        if (w.length > 2 || w.length > 3) {
            w = firstLetter.toUpperCase() + w.slice(1);
        } else {
            w = firstLetter + w.slice(1);
        }
        words[a] = w;
    }

    let cid_formatado = words.join(" ")

    cid_formatado = cid_formatado.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    cid_formatado = cid_formatado.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    cid_formatado = cid_formatado.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    cid_formatado = cid_formatado.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    cid_formatado = cid_formatado.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    cid_formatado = cid_formatado.replace(new RegExp('[Ç]', 'gi'), 'c');

    //renderizar select especialidade
    const URL_ESPECIALIDADE = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacaoCidades/consultas/' + cid_formatado.toUpperCase() + '/redes/' + idRede + '/pagina/1/'
    axios.get(URL_ESPECIALIDADE)
        .then(res => {

            let selectEspecialidade = document.querySelector(".especialidade");

            selectEspecialidade.innerHTML = "";

            let html = '<select id="especialidade" onchange="getPrestador();">' +
                '<option value="" disabled selected>Qual especialidade?</option>'

            let dados = res.data.dados
            let recebeEsp = []

            for (let aux in dados) {
                for (let esp in dados[aux].especialidades) {
                    if (dados[aux].especialidades[esp] != null) {
                        recebeEsp.push(dados[aux].especialidades[esp])
                    }
                }
            }

            // RETIRAR DADOS DUPLICADOS EM UM ARRAY DE OBJETOS
            let values = recebeEsp.filter((a) => {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true) || (this[JSON.stringify(a)] = false)
            }, Object.create(null))

            // ORDEM ALFABETICA DAS ESPECIALIDADES
            let valor = values.sort(function (especialidade1, especialidade2) {
                return (especialidade1.especialidade > especialidade2.especialidade) ? 1 : ((especialidade2.especialidade > especialidade1.especialidade) ? -1 : 0);
            });

            let listaEspecialidades = valor;


            for (let aux in listaEspecialidades) {
                html += "<option value='" + listaEspecialidades[aux].idEsp + "'> " + listaEspecialidades[aux].especialidade + " </option>";
            }

            html += '</select>';

            selectEspecialidade.innerHTML = html;

            $('select').material_select();

            //mostrar resultado
            let recebeDados = []
            for (let aux in dados) {
                //if (aux != 0) {

                recebeDados.push({
                    "idRede": dados[aux].idRede,
                    "descricao": dados[aux].descricao,
                    "credenciamentoLocal": dados[aux].credenciamentoLocal,
                    "razaoSocial": dados[aux].razaoSocial,
                    "localAtendto": dados[aux].localAtendto,
                    "especialidade": dados[aux].especialidade.trim(),
                    "especialidades": dados[aux].especialidades,
                    "idEsp": dados[aux].idEsp,
                    "ibge": dados[aux].ibge.trim(),
                    "logradouro": dados[aux].logradouro,
                    "cidade": dados[aux].cidade,
                    "bairro": dados[aux].bairro,
                    "endereco": dados[aux].end,
                    "tipoDesc": dados[aux].tipoDesc,
                    "fone1": dados[aux].fone1,
                    "uf": dados[aux].uf,
                    "cnpj": dados[aux].cnpj,
                    "nroRegistro": dados[aux].nroRegistro, // CRM - MEDICO
                })
            }

            //ordena em ordem alfabética
            recebeDados.sort(function (rede1, rede2) {
                return (rede1.descricao > rede2.descricao) ? 1 : ((rede2.descricao > rede1.descricao) ? -1 : 0);
            });
            $('.result').show();
            let result = document.querySelector(".result");
            result.innerHTML = "";
            result.innerHTML += formataResult(recebeDados);

            $('.loading').hide(); //esconde o loader
            $('.div-pesquisa').children().show();//mostra input de pesquisa


        })
        .catch(() => console.log("Erro ao buscar as especialidades na cidade selecionada."))
}


function getPrestador() {
    $('.result').hide();
    $('.loading').show(); //mostra o loader

    let idRede = $('#planos').val();
    let cidade = $('#cidades option:selected').text();
    let idEsp = $('#especialidade').val();

    let loweredText = cidade.trim().replace(/\s{2,}/g, ' ').toLowerCase();
    let words = loweredText.split(" ");

    for (let a = 0; a < words.length; a++) {
        let w = words[a];
        let firstLetter = w[0];

        if (w.length > 2 || w.length > 3) {
            w = firstLetter.toUpperCase() + w.slice(1);
        } else {
            w = firstLetter + w.slice(1);
        }
        words[a] = w;
    }

    let cid_formatado = words.join(" ")

    cid_formatado = cid_formatado.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    cid_formatado = cid_formatado.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    cid_formatado = cid_formatado.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    cid_formatado = cid_formatado.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    cid_formatado = cid_formatado.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    cid_formatado = cid_formatado.replace(new RegExp('[Ç]', 'gi'), 'c');

    //renderizar select prestador
    const URL_TIPO = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacaoCidades/tipoPrestador/' + idRede + "/" + idEsp + '/' + cid_formatado.toUpperCase()
    axios.get(URL_TIPO)
        .then(res => {

            let selectPrestador = document.querySelector(".div-prestador");

            selectPrestador.innerHTML = "";

            let html = '<select id="prestador" onchange="filtraPrestador();">' +
                '<option value="" disabled selected>Qual o tipo?</option>'

            let tipos = res.data

            for (let aux in tipos) {
                html += "<option value='" + tipos[aux].CodTipo + "'> " + tipos[aux].Tipo.trim() + " </option>";
            }

            html += '</select>';

            selectPrestador.innerHTML = html;

            $('select').material_select();


        })
        .catch(() => console.log("Erro ao buscar dados na API."))


    //mostra resultado
    let opcao = $('#especialidade option:selected').text();
    espec_selec = [opcao.trim()][0].split(" ")[0]
    const URL_ESP_SELECT = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacaoCidades/prestador/' + idRede + '/' + cid_formatado.toUpperCase() + "/" + espec_selec.toUpperCase()
    console.log(URL_ESP_SELECT)
    axios.get(URL_ESP_SELECT)
        .then(res => {
            let dados = res.data
            //ordena em ordem alfabética
            dados.sort(function (rede1, rede2) {
                return (rede1.descricao > rede2.descricao) ? 1 : ((rede2.descricao > rede1.descricao) ? -1 : 0);
            });

            $('.result').show();
            let result = document.querySelector(".result");
            result.innerHTML = "";
            result.innerHTML += formataResult(dados);
            $('.loading').hide(); //esconde o loader

        })
        .catch(() => console.log("Erro ao buscar dados da API."))

}

function filtraPrestador() {
    $('.result').hide();
    $('.loading').show(); //mostra o loader

    let idRede = $('#planos').val();
    let cidade = $('#cidades option:selected').text();
    let idEsp = $('#especialidade').val();
    let idTipoPrestador = $('#prestador').val();

    let loweredText = cidade.trim().replace(/\s{2,}/g, ' ').toLowerCase();
    let words = loweredText.split(" ");

    for (let a = 0; a < words.length; a++) {
        let w = words[a];
        let firstLetter = w[0];

        if (w.length > 2 || w.length > 3) {
            w = firstLetter.toUpperCase() + w.slice(1);
        } else {
            w = firstLetter + w.slice(1);
        }
        words[a] = w;
    }

    let cid_formatado = words.join(" ")

    cid_formatado = cid_formatado.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    cid_formatado = cid_formatado.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    cid_formatado = cid_formatado.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    cid_formatado = cid_formatado.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    cid_formatado = cid_formatado.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    cid_formatado = cid_formatado.replace(new RegExp('[Ç]', 'gi'), 'c');

    //mostra resultado
    const URL_REDE_TIPO_SELECIONADO = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacaoCidades/redeTipo/' + idRede + '/' + idEsp + '/' + idTipoPrestador + '/' + cid_formatado.toUpperCase()
    console.log(URL_REDE_TIPO_SELECIONADO)
    axios.get(URL_REDE_TIPO_SELECIONADO)
        .then(res => {
            let dados = res.data
            //ordena em ordem alfabética
            dados.sort(function (rede1, rede2) {
                return (rede1.descricao > rede2.descricao) ? 1 : ((rede2.descricao > rede1.descricao) ? -1 : 0);
            });

            $('.result').show();
            let result = document.querySelector(".result");
            result.innerHTML = "";
            result.innerHTML += formataResult(dados);
            $('.loading').hide(); //esconde o loader
            console.log(dados)

        })
        .catch(() => console.log("Erro ao buscar dados da API."))

}

function pesquisa() {
    $('.result').hide();
    $('.loading').show(); //mostra o loader
    resetCidade();

    let idRede = $('#planos').val();
    let cidadeSelecionada = $('#cidades option:selected').text();
    let textoPesquisa = $('#pesquisa').val();

    let loweredText = cidadeSelecionada.trim().replace(/\s{2,}/g, ' ').toLowerCase();
    let words = loweredText.split(" ");

    for (let a = 0; a < words.length; a++) {
        let w = words[a];
        let firstLetter = w[0];

        if (w.length > 2 || w.length > 3) {
            w = firstLetter.toUpperCase() + w.slice(1);
        } else {
            w = firstLetter + w.slice(1);
        }
        words[a] = w;
    }

    let cid_formatado = words.join(" ")

    cid_formatado = cid_formatado.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    cid_formatado = cid_formatado.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    cid_formatado = cid_formatado.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    cid_formatado = cid_formatado.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    cid_formatado = cid_formatado.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    cid_formatado = cid_formatado.replace(new RegExp('[Ç]', 'gi'), 'c');

    const URL_PESQUISA = 'https://us-central1-appliv-6385b.cloudfunctions.net/paginacaoCidades/prestador/' + idRede + '/' + cid_formatado.toUpperCase() + '/' + textoPesquisa.toUpperCase()
    axios.get(URL_PESQUISA)
        .then(res => {

            let dados = res.data
            console.log(dados)
            //ordena em ordem alfabética
            dados.sort(function (rede1, rede2) {
                return (rede1.descricao > rede2.descricao) ? 1 : ((rede2.descricao > rede1.descricao) ? -1 : 0);
            });
            $('.result').show();
            let result = document.querySelector(".result");
            result.innerHTML = "";

            dados != "" ? result.innerHTML += formataResult(dados) : result.innerHTML += '<p class="info-resultado">Nenhum resultado encontrado.</p>'
            

            $('.loading').hide(); //esconde o loader

        })
        .catch(() => console.log("Erro na pesquisa."))

}

function formataResult(dados) {

    let html = '<ul class="collection">';

    dados.map((rede) => {

        let cnpj = rede.cnpj

        if (rede.cnpj != undefined) {

            // EXPRESSAO PARA COLOCAR CNPJ FORMATADO
            cnpj = cnpj.replace(/\D/g, ""); //Remov = ve tudo o que não é dígito
            cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2"); //Coloca ponto entre o segundo e o terceiro dígitos
            cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
            cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2"); //Coloca uma barra entre o oitav = vo e o nono dígitos
            cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca um hífen depois do bloco de quatro dígitos

        }

        //console.log(v)

        crm = rede.nroRegistro.trim()

        const novo = []
        for (var i in rede.especialidades) {
            novo.push({ "especialidade": rede.especialidades[i].especialidade })
        }

        const tipoletraMaior = rede.tipoDesc.split('', 1);
        const tipoletraMenor = rede.tipoDesc.slice(1).toLowerCase();
        const tipo = tipoletraMaior + tipoletraMenor

        const logletraMaior = rede.logradouro.split('', 1);
        const logoletraMenor = rede.logradouro.slice(1).toLowerCase();
        const logradouro = logletraMaior + logoletraMenor

        const endletraMaior = rede.endereco.split('', 1);
        const endletraMenor = rede.endereco.slice(1).toLowerCase();
        const endereco = endletraMaior + endletraMenor

        const bairroletraMaior = rede.bairro.split('', 1);
        const bairroletraMenor = rede.bairro.slice(1).toLowerCase();
        const bairro = bairroletraMaior + bairroletraMenor

        const cidletraMaior = rede.cidade.split('', 1);
        const cidletraMenor = rede.cidade.slice(1).toLowerCase();
        const cidade = cidletraMaior + cidletraMenor

        const endereco_completo = logradouro + ' ' + endereco + ' - ' + bairro + ', ' + cidade


        var loweredText = endereco_completo.replace(/\s{2,}/g, ' ').toLowerCase();
        var words = loweredText.split(" ");
        for (var a = 0; a < words.length; a++) {
            var w = words[a];

            var firstLetter = w[0];

            if (w.length > 2 || w.length > 3) {
                w = firstLetter.toUpperCase() + w.slice(1);
            } else {
                w = firstLetter + w.slice(1);
            }

            words[a] = w;
        }

        let endereco_formatado = words.join(" ")

        html +=

            '<li class="collection-item">' +

            '<div style="color: #133d89"><span style="font-size: large; font-weight: 600">' + rede.descricao + '</span>';

        rede.tipoDesc.trim() == "Médico" ?
            html += '<br><span style="color: #133d89">' + tipo.trim() + ' ' + "(" + rede.nroRegistro.trim() + ")" + '</span><br>'
            :
            html += '<br><span style="color: #133d89">' + tipo.trim() + ' ' + "(" + "CNPJ: " + cnpj + ")" + '</span><br>'



        novo.map((nome, pos) => {
            const nomeMaior = nome.especialidade.trim().split('', 1);
            const nomeMenor = nome.especialidade.trim().slice(1).toLowerCase();
            const nomeEsp = nomeMaior + nomeMenor
            var loweredText = nomeEsp.replace(/\s{2,}/g, ' ').toLowerCase();
            var words = loweredText.split(" ");
            for (var a = 0; a < words.length; a++) {
                var w = words[a];

                var firstLetter = w[0];

                if (w.length > 2 || w.length > 3) {
                    w = firstLetter.toUpperCase() + w.slice(1);
                } else {
                    w = firstLetter + w.slice(1);
                }

                words[a] = w;
            }
            let nomeEsp_formatado = words.join(" ")
            let ultimo = novo[novo.length - 1];
            if (nome.especialidade != ultimo.especialidade) {
                html += '<span style="color: #a5a5a5; font-style: italic">' + nomeEsp_formatado + ", " + '</span>'
            } else {
                html += '<span style="color: #a5a5a5; font-style: italic">' + nomeEsp_formatado + "." + '</span>'
            }
        })


        html += '<br><span style="color: #26a69a">' + endereco_formatado + " - " + rede.uf + '</span><br>';

        html += '<span style="color: #26a69a">' + rede.fone1 + '</span>';

        let pesquisaEndereco = endereco_formatado.replace(/ /g, "+");
        let urlEndereco = 'https://www.google.com.br/maps/place/' + pesquisaEndereco
        html += '<a href=' + urlEndereco + ' target="_blank" class="secondary-content">' +
            '<i class="material-icons">location_on</i>' +
            '</a>'

        let urlFone = rede.fone1
        let codigo_operadora = urlFone.split(' ', 1)
        let telefone = urlFone.split(' ', 2).pop()
        let numero_tel = 'tel:' + codigo_operadora + telefone

        html += '<a href=' + numero_tel + ' class="secondary-content">' +
            '<i class="material-icons">phone</i>' +
            '</a>' +
            '</div>' +


            '</li>';

    })

    html += '</ul>';

    return html;


}




