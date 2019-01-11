function resetPlano() {
    let idEspecialidade = document.querySelector("#especialidade");
    if (idEspecialidade != null) {
        let especialidade = document.querySelector(".especialidade");
        especialidade.innerHTML = "";
        let disableEspecialidade = '<select disabled><option value="" disabled selected>Qual especialidade?</option></select>'
        especialidade.innerHTML = disableEspecialidade
    }

    let idPrestador = document.querySelector("#prestador")
    if (idPrestador != null) {
        let prestador = document.querySelector(".div-prestador");
        prestador.innerHTML = "";
        let disablePrestador = '<select disabled><option value="" disabled selected>Qual o tipo?</option></select>'
        prestador.innerHTML = disablePrestador
    }

    $('select').material_select();

}

function resetCidade() {
    let idPrestador = document.querySelector("#prestador")
    if (idPrestador != null) {
        let prestador = document.querySelector(".div-prestador");
        prestador.innerHTML = "";
        let disablePrestador = '<select disabled><option value="" disabled selected>Qual o tipo?</option></select>'
        prestador.innerHTML = disablePrestador
    }

    $('select').material_select();

}