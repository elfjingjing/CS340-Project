function updateCoupon(id){
    var amountVal = document.getElementById('amount' + id).value;
    var validVal = document.getElementById('valid' + id).value;
    $.ajax({
        url: '/coupons/' + id,
        type: 'PUT',
        data: {id: id, amount: amountVal, valid: validVal},
        success: function(result){
            window.location.replace("./coupons");
        }
    })
};

function deleteCoupon(id){
    $.ajax({
        url: '/coupons/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("./coupons");
        }
    })
};