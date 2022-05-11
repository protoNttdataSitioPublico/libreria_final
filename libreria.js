console.log('libreria final')
var tagItems = document.querySelectorAll('[data-tag]')
function productImpresion(product, index, mode) {
    var productData = {
        event: 'productImpresion',
        details: product,
        path: window.location.pathname,
        position: index,
    }
    if (mode === 'dataLayer') {
        dataLayer.push(productData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', 'productImpresion', product.name, {
            dimension68: product.name,
            dimension69: product.description,
            dimension70: product.type,
            dimension71: product.producto,
            dimension72: product.precio,
            dimension73: product.marca,
            dimension74: product.forma_pago,
        })
        console.log('enviando a ga')
    }
    return productData
}



function promotionView(promotion, index, mode) {
    var promotionData = {
        event: 'promotionView',
        details: promotion,
        path: window.location.pathname,
        position: index,
    }
    if (mode === 'dataLayer') {
        dataLayer.push(promotionData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', "promotionView", promotion.name, {
            dimension68: promotion.name,
            dimension69: promotion.description,
            dimension70: promotion.type,
            dimension71: promotion.promotion,
            dimension72: promotion.precio,
            dimension73: promotion.marca,
            dimension74: promotion.forma_pago,
        })
        console.log('enviando a ga')
    }
    return promotionData
}




// funciones para pushear eventos click al dataLayer
function promotionClick(promotion, index, mode) {
    var promotionData = {
        event: 'promotionClick',
        details: promotion,
        path: window.location.pathname,
        position: index,
    }
    if (mode === 'dataLayer') {
        dataLayer.push(promotionData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', "promotion click", promotion.name, {
            dimension68: promotion.name,
            dimension69: promotion.description,
            dimension70: promotion.type,
            dimension71: promotion.promotion,
            dimension72: promotion.precio,
            dimension73: promotion.marca,
            dimension74: promotion.forma_pago,
        })
        console.log('enviando a ga')
    }
    return promotionData
}



function promotionByUrl() {
    var dataUrl;
    var urlSearchParams = new URLSearchParams(window.location.search)
    // urlSession = window.location.search
    // var eventTagLibrary = urlSearchParams.get('dataTag')
    if (urlSearchParams) {
        var name = urlSearchParams.get('utmExp_source')
        var description = urlSearchParams.get('utmExp_campaign')
        var index = urlSearchParams.get('index')
        var path = urlSearchParams.get('utmExp_medium')
        var type = urlSearchParams.get('type')

        dataUrl = {
            name: name,
            description: description,
            index: index || null,
            path: path,
            type: type
        }
        console.log(dataUrl)
        saveSessionStorage(dataUrl)
        promotionClick(dataUrl, dataUrl.index, 'GA')
        return dataUrl
    }
}



function productClick(product, index, mode) {
    var productData = {
        event: 'productClick',
        details: product,
        path: window.location.pathname,
        position: index,
    }

    if (mode === 'dataLayer') {
        dataLayer.push(productData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', "productClick", product.name, {
            dimension68: product.name,
            dimension69: product.description,
            dimension70: product.type,
            dimension71: product.product,
            dimension72: product.precio,
            dimension73: product.marca,
            dimension74: product.forma_pago,
        })
        console.log('enviando a ga')
    }
    return productData;
}



function tagInteraction(interaction, index, mode) {
    var interactionData = {
        event: 'tagInteraction',
        details: interaction,
        path: window.location.pathname,
        position: index,
    }

    if (mode === 'dataLayer') {
        dataLayer.push(interactionData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', "tagInteraction", interaction.name, {
            dimension68: interaction.name,
            dimension69: interaction.description,
            dimension70: interaction.type,
            dimension71: interaction.product,
            dimension72: interaction.precio,
            dimension73: interaction.marca,
            dimension74: interaction.forma_pago,
        })
        console.log('enviando a ga')
    }
    return interactionData
}



//funcion para guardar datos en el sessionStorage
function saveSessionStorage(data) {
    var key = 'tagLibrary'
    var sessionData = sessionStorage.getItem(key)



    if (sessionData === null) {
        sessionStorage.setItem(key, JSON.stringify([data]))
    } else {
        // pushear objetos en un array
        var valuesTag
        valuesTag = JSON.parse(sessionStorage.getItem(key))
        valuesTag.push(data)
        sessionStorage.setItem(key, JSON.stringify(valuesTag))
    }
}



// fn para enviar informacion del SessionStorage al dataLayer
function sendSessionStorage(mode) {
    var librarySession = sessionStorage.getItem('tagLibrary')
    if (mode === 'dataLayer') {
        dataLayer.push(librarySession)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', 'sendSessionStorage', "Seeds", { dimension78: librarySession })
    }
}



function formSend(librarySession, mode) {
    formData = {
        event: "formSend",
        detail: {
            product: librarySession,
            path: window.location.pathname,
        },
    };
    if (mode === 'dataLayer') {
        dataLayer.push(formData)
    } else if (mode === 'GA') {
        ga('send', 'event', 'tagLibrary 2.0', "Send", "Solicitar", { dimension78: JSON.stringify(formData) })
    }
    return formData
}



// ------ flujo 1: Marcage View ------
var sendMode = 'GA'
// Push de los Views
tagItems.forEach(function (e, i) {
    var data = JSON.parse(e.dataset.tag)
    var type = data.type
    var mode = data.mode || sendMode
    if (type === 'product') {
        productImpresion(data, i, mode)
    } else if (type === 'promotion') {
        promotionView(data, i, mode)
    }
})



// ------ flujo 2: Marcage Click ------
tagItems.forEach(function (e, i) {
    e.addEventListener('click', function (e) {
        var data = JSON.parse(e.target.dataset.tag)
        var type = data.type
        var mode = data.mode || sendMode
        if (type === 'product') {
            var productData = productClick(data, i, mode)
            saveSessionStorage(productData)
        } else if (type === 'promotion') {
            var promotionData = promotionClick(data, i, mode)
            saveSessionStorage(promotionData)
        }
    })
})



promotionByUrl()
// document.addEventListener('unload', sendSessionStorage())



//------ flujo 3: Formulario ------
tagItems.forEach(function (e) {
    e.addEventListener('click', function (e) {
        var data = JSON.parse(e.target.dataset.tag)
        var type = data.type
        var mode = data.mode || sendMode
        if (type === 'submit') {
            e.preventDefault();
            var librarySession = sessionStorage.getItem('tagLibrary')
            var formData = formSend(librarySession, mode)
            saveSessionStorage(formData)
            sendSessionStorage(formData)
            setTimeout(function () {
                sessionStorage.clear()
            }, 2000)
        }
    });
});




//------ flujo 4: Interacciones ------
tagItems.forEach(function (e, i) {
    e.addEventListener('click', function (e) {
        var data = JSON.parse(e.target.dataset.tag)
        var type = data.type
        var mode = data.mode || sendMode
        if (type === 'interaction') {
            interactionData = tagInteraction(data, i, mode)
            saveSessionStorage(interactionData)
        }
    })
});
