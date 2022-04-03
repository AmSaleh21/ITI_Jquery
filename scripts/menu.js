$(() => {
    //store the items from the json file
    let menuItems = [];

    //store the cart items to avoid repetetion
    // let cartItems = [];
    let cartItems = [];

    //store the menu prices
    let itemPrices = [];

    //a map to store how many is bought of each item
    let itemBuyTimes = new Map();

    //to get & set the dynamically inserted elements ids
    let itterator = 1;


    let cartTotal = 0;
    $('#cartTotal').html(('Total: ' + cartTotal));

    //get the json from the php api 
    $.ajax({
        url: '../api/items.php',
        success: (resp) => {
            menuItems = resp;
            $('#error').addClass('hidden');
            renderItemsInMenu();
        },
        error: () => {
            $('#error').removeClass('hidden');
        },
        complete: () => {
            $('#loader').addClass('hidden');
        }
    })

    /**
     * start function, show the items in the menu
     */
    renderItemsInMenu = () => {
        for (let item of menuItems) {

            const nextItem = $('.hiddenMenuItem.hidden').clone();

            nextItem.removeClass('hidden hiddenMenuItem')
            nextItem.addClass('menuItem')

            nextItem.appendTo('.menus')
                .children('h3').html(`${item.title}, ${item.price}`);

            nextItem.children(`img`).attr(`src`, item.image);

            nextItem.attr('id', itterator);
            itterator++;
            itemPrices.push(item.price);
        }
    }

    //when buy is clicked on menu item
    $('body').on('click', '.menuItem button', function () {
        const btn = $(this),
            id = btn.parent('.menuItem').attr('id'),
            price = itemPrices[(id - 1)];

        if (itemBuyTimes.get(id) >= 1) {
            itemBuyTimes.set(id, (itemBuyTimes.get(id) + 1));
        } else {
            itemBuyTimes.set(id, 1);
        }
        renderItemInCart(id);
        updateCartPriceWithVat(id, price, 1);
    })

    //buy again button
    $('body').on('click', '.cartItem .addToCartButton', function () {
        const btn = $(this),
            id = btn.parent('.cartItem').attr('id'),
            price = itemPrices[(id - 1)];
        itemBuyTimes.set(id, (itemBuyTimes.get(id) + 1));
        updateBuyCount(btn.parent('.cartItem'), id);
        updateCartPriceWithVat(id, price, 1);
    })

    //remove from cart button
    $('body').on('click', '.cartItem .remove', function () {
        const btn = $(this),
            id = btn.parent('.cartItem').attr('id'),
            price = itemPrices[(id - 1)];
        removeFromCart(btn);
        updateCartPriceWithVat(id, price, 0);
        itemBuyTimes.delete(id);
    });

    /**
     * render item in cart on menu buy
     * @param id item id to be rendered
     */
    //show the item in cart (if not already in) and update it's buy count
    renderItemInCart = (id) => {
        let item = $(`#${id}`).clone();
        item.removeClass('menuItem');
        item.addClass('cartItem');
        let removeButton = $('<button/>',
            {
                text: 'Remove',
                class: 'remove'
            });
        removeButton.appendTo(item);
        if (!cartItems.includes(id, 0)) {
            cartItems.push(id);
            item.children('.addToCartButton').html('buy again');
            item.appendTo('.cart');
        }
        // console.log(item);
        updateBuyCount(item, id);
    }

    /**
     * derender item from cart
     * @param btn button clicked
     */
    removeFromCart = (btn) => {
        btn.parent('.cartItem').remove();
        index = cartItems.indexOf(btn.parent('.cartItem').attr('id'))
        cartItems.splice(index, 1);
    }

    /**
     * update total price in the cart
     * @param id item id
     * @param price item price
     * @param flag if it's a buy or remove
     */
    updateCartPriceWithVat = (id, price, flag) => {
        if (flag) {
            cartTotal += price
        } else {
            let amount = itemBuyTimes.get(id);
            cartTotal -= (price * amount)
        }

        storedCartTotal = !cartTotal ? 0 : cartTotal;


        if (storedCartTotal >= 300) {
            discount = Number((storedCartTotal * 0.3).toFixed(2));
            $('#Discount').html(('30% :' + discount));
        } else {
            discount = 0;
            $('#Discount').html((': 0'));
        }

        delivery = storedCartTotal ? 15 : 0;
        vat = storedCartTotal * 0.14

        $("#total").html(storedCartTotal + " LE")
        $("#delivery").html(delivery + " LE")
        $("#VAT").html(Number(vat).toFixed(2) + " LE")
        orderTotal = Number(vat + delivery + storedCartTotal - discount).toFixed(2);
        $("#order-total").html(orderTotal + " LE")
    }

    /**
     * display buy amount
     * @param item item bought again
     * @param id item's id
     */
    updateBuyCount = (item, id) => {
        item.children('h4').html('Amount x' + itemBuyTimes.get(id));
    }
})
