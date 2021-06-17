import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './components';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async (productId, quantity) => {
        const { cart }= await commerce.cart.add(productId, quantity);
        setCart(cart);
    }

    const handleUpdateCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });

        setCart(cart);
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();

        setCart(cart);
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);

        setCart(cart)
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
            refreshCart();
        }
        catch (err) {
            setErrorMessage(err.data.error.message);
        }
    }

    const refreshCart = async () => { 
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    },[]);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart} 
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleUpdateCart={handleUpdateCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout 
                            cart={cart} 
                            order={order} 
                            onCaptureCheckout={handleCaptureCheckout} 
                            error={errorMessage}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
