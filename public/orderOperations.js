function addOrder() {
    $.ajax({
        url: '/orders/',
        type: 'POST',
        data: $('#addorder').serialize(),
        success: function(result){
            window.location.replace("./orders");
        }
    })
};

// f;unction addOrderItem(options) {
//     var orderRows = document.getElementById('orderRows');
//     orderRows.appendChild(document.createElement("BR"));
    
//     var category = document.createElement("SELECT");
//     var c = document.createElement("option");
//     for (int i = 0; i < options[0].length; i++) {

//     }
    
//     category.add()
//     var item = document.createElement("SELECT");
//     var sweetness = document.createElement("SELECT");
//     var iced = document.createElement("SELECT");
    
//     orderRows.appendChild(document.createElement("BR"));

//     window.location.replace("/items/" + cid);
// }