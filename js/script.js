$(document).ready(function(){
    var _url = "https://my-json-server.typicode.com/mahdikur/pwaapi/products";

    var dataResults = '';
    var catResults = '';
    var categories = [];

    function renderPage(data){
        $.each(data, function(key, items){
            _cat = items.category;

             dataResults += `<a href="#" class="list-group-item list-group-item-action" aria-current="true">
                                    <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${items.name}</h5>
                                    </div>
                                    <small>Category : ${items.category}</small>
                                </a>`;
            if($.inArray(items.category, categories) == -1){
                categories.push(_cat);
                catResults += '<option value="'+_cat+'"> '+_cat+' </option>';
            }
        });

        $('#products').html(dataResults); 
        $('#cat_select').html('<option value="all">Semua</option>' + catResults); 
    }

    var networkDataReceived = false;

    // Fresh Data From Online
    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(function(data){
        networkDataReceived = true;
        renderPage(data);
    })

    // return data from cache
    caches.match(_url).then(function(response){
        if(!response) throw Error('no Data on Cache')
        return response.json()
    }).then(function(data){
        if(!networkDataReceived){
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function(){
        return networkUpdate
    })
        
    $('#cat_select').change(function(){
        updateProducts($(this).val());
    });

    function updateProducts(cat){
        var dataResults = '';
        var _newUrl = _url;
        
        if(cat != 'all')
            _newUrl += '?category='+cat;

        $.get(_newUrl, function(data){
            $.each(data, function(key, items){
                _cat = items.category;

                dataResults += `<a href="#" class="list-group-item list-group-item-action" aria-current="true">
                                    <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${items.name}</h5>
                                    </div>
                                    <small>Category : ${items.category}</small>
                                </a>`;
            });
    
            $('#products').html(dataResults);
        });
    }
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
}
