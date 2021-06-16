import React from 'react';
import  { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles  from './Styles';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, handleEmptyCart, handleUpdateCart, handleRemoveFromCart }) => {
    const classes = useStyles(); 

    const EmptyCard = () => (
        <Typography variant="subtitle1">You have no item in your shopping cart,
            <Link to='/' className={classes.link}> start adding some!</Link>!
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item, i) => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <CartItem item={item} onUpdateCart={handleUpdateCart} onRemoveCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="container" color="secondary" onClick={handleEmptyCart}>EmptyCard</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="container" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    )

    if (!cart.line_items) return 'Loading...'

    return (
        <Container>
            <div className={classes.toolbar}  />
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
            {!cart.line_items.length ? <EmptyCard /> : <FilledCart />}
        </Container>
    )
}

export default Cart
