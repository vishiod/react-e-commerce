import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem';
import useStyles from './styles';

const Cart = ({ cart, handlUpdateCartQuantity, handleEmptyCart, handleRemoveFromCart }) => {
  // console.log(cart.line_items.length);

  const classes = useStyles();

  const EmptyCart = () => {
    return (
      <Typography variant = "subtitle1"> Your Shopping cart is empty,
        <Link to="/" className={classes.link}>start adding some</Link>!
      </Typography>
    );
  }

  const FilledCart = () =>{
    return (
      <>
        <Grid container spacing={3}>
        {
          cart.line_items.map((item)=>{
            return (
              <section>
                <Grid item xs={12} sm={4} key={item.id} spacing={3}>
                  <CartItem item={item} handlUpdateCartQuantity={handlUpdateCartQuantity} handleRemoveFromCart={handleRemoveFromCart}/>
                </Grid>
              </section>
              );
            })
          }
          </Grid>
          <main className={classes.cardDetails}>
              <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
              <div>
                <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={()=>handleEmptyCart()}>Empty Cart</Button>
                <Button className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary" component={Link} to="/checkout">Check Out</Button>
              </div>
          </main>
      </>
    );
  }

  if (!cart.line_items) return 'Loading....';

  return(
    <Container>
      <div className={classes.toolbar}/>
      <Typography className={classes.title} variant="h3" gutterBottom> Your Shopping Cart</Typography>
      { !cart.line_items.length ? <EmptyCart/> : <FilledCart/>}
    </Container>
  );
}
export default Cart;
