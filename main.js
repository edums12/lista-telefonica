var lista = new Array();

var addContato = (nome, telefone) => {
    let contato = { "nome": nome, "telefone": telefone }

    lista.push(contato)

    atualizaDB()

    atualizarLista()
}

var atualizaDB = () => {
    localStorage.setItem('contatos', lista.ToJSON())
}

var buscaDB = () => {
    let json = JSON.parse(localStorage.getItem('contatos'))

    if (json != null) {
        lista = new Array()

        json.map((value, index, number) => {
            lista.push(value)
        })
    }
}

var atualizarLista = (pLista) => {
    buscaDB()

    if(pLista == null)
        pLista = lista;

    var tbody = $('.table-telefones tbody')

    var limparLista = () => {
        let lines = $('.table-telefones tbody tr')

        lines.remove()
    }

    limparLista();

    var linha = (index, nome, telefone) => {
        let tr = `<tr>
                    <td>${nome}</td>
                    <td>${telefone}</td>
                    <td>
                        <a class="delete btn btn-ligth" onclick="deletarContato(${index})"><i class="material-icons">delete</i> Deletar</a>
                    </td>
                </tr>`;

        return tr
    }

    pLista.forEach((value, index, array) => {
        tbody.append(linha(index, value.nome, value.telefone))
    })
}

atualizarLista()

$('form#form-add').submit((e) => {
    e.preventDefault()

    $('.modal').modal('hide')

    let nome = $("form#form-add input[name=nome]").val()

    let telefone = $("form#form-add input[name=telefone]").val()

    addContato(nome, telefone)

    $('form#form-add')[0].reset()
})

$('#search').keyup(() => {
    var value = $('#search').val()

    var valueRepart = value.split(":");

    if(value != null && value != '')
    {
        let newList = new Array();

        let ident = ((valueRepart.length > 1) ? valueRepart[0] : 'nome')

        let search = ((valueRepart.length > 1) ? valueRepart[1].trim() : value)

        lista.forEach((obj, index, array) => {
            if((eval(`obj.${ident}`)).toLowerCase().includes(search.toLowerCase()))
                newList.push(obj)
        })

        atualizarLista(newList);
    }
    else
    {
        atualizarLista();
    }
})  

function deletarContato(index) {
    lista = lista.removeIndex(index);

    atualizaDB();

    atualizarLista();
}

Array.prototype.ToJSON = function () {
    var json = "[";

    this.forEach((value, index, array) => {
        if (index > 0)
            json += ',';

        json += `{"nome":"${value.nome}", "telefone":"${value.telefone}"}`;
    })

    json += "]";

    return json;
}

Array.prototype.removeIndex = function (pIndex) {
    let newArray = new Array();

    this.forEach((value, index, array) => {
        if (index !== pIndex)
            newArray.push(value)
    })

    return newArray;
}