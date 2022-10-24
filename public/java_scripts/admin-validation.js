var productNameError = document.getElementById('product-name-error');
var productDesError = document.getElementById('product-description-error');
var productimgError = document.getElementById('product-image-error');
var productprizeError = document.getElementById('product-prize-error');
var productlimitError = document.getElementById('product-limit-error');
var productstockError = document.getElementById('product-stock-error');
var productdisError = document.getElementById('product-discount-error');
var submitproductError = document.getElementById('submit-product-error');


function validateProductName() {
    var name = document.getElementById('product-name').value;

    if (name.length == 0) {
        productNameError.innerHTML = '**Company Name is required';
        return false
    }
    // if (!name.match(/^[A-Za-z]+$/)) {
    //     productNameError.innerHTML = '**Only Charector please';
    //     return false
    // }
    productNameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateProductDescription() {
    var name = document.getElementById('product-description').value;

    if (name.length == 0) {
        productDesError.innerHTML = '**Company Name is required';
        return false
    }
    if ((name.length <= 20)) {
        productDesError.innerHTML = '**Description length must be 20 letters';
        return false
    }
    productDesError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateProductImage() {
    var file = document.getElementById('product-image').value;

    if (file.length == 0) {
        productimgError.innerHTML = '**image  is required';
        return false
    }
    // var filePath = file.value;

    // Allowing file type
    // var allowedExtensions =
    //     /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    // if (!allowedExtensions.exec(filePath)) {
    //     file.value = '';
    //     productimgError.innerHTML = '**Only allowed(jpg,jpeg,png,gif)';
    //     return false;
    // }
    productimgError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateProductPrize() {
    var prize = document.getElementById('product-prize').value;

    if (prize.length == 0) {
        productprizeError.innerHTML = 'Product prize is required';
        return false
    }
    if (!prize.match(/^[0-9]+$/)) {
        productprizeError.innerHTML = 'Only digits please';
        return false
    }
    productprizeError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateProductLimit() {
    var limit = document.getElementById('Product_Limit').value;

    if (limit.length == 0) {
        productlimitError.innerHTML = 'Product Limit is required';
        return false
    }
    if (!limit.match(/^[0-9]+$/)) {
        productlimitError.innerHTML = 'Only digits please';
        return false
    }
    productlimitError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateProductStock() {
    var stock = document.getElementById('product-stock').value;

    if (stock.length == 0) {
        productstockError.innerHTML = 'Stock is required';
        return false
    }
    if (!stock.match(/^[0-9]+$/)) {
        productstockError.innerHTML = 'Only digits please';
        return false
    }
    productstockError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateProductDiscount() {
    var discount = document.getElementById('product-discount').value;

    if (discount.length == 0) {
        productdisError.innerHTML = 'Discount is required';
        return false
    }
    if (!discount.match(/^[0-9]+$/)) {
        productdisError.innerHTML = 'Only digits please';
        return false
    }
    productdisError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

