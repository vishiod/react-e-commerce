import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkOutToken, increaseActiveStep, decreaseActiveStep, shippingData, handleCaptureCheckout }) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if(!stripe || !elements) console.log("Hello some error");;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card:cardElement});

    if(error)
      console.log(error);
    else{
      const orderData = {
        line_items: checkOutToken.live.line_items,
        customer: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email
        },
        shipping: {
          name: 'Primary',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubDivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry
        },
        fulfillment: {
          shipping_method: shippingData.shippingOption
        },
        payment:{
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id
          }
        }
      };

      handleCaptureCheckout(checkOutToken.id, orderData);
    }
  };
  return (
    <>
      <Review checkOutToken={checkOutToken}/>
      <Divider/>
      <Typography variant="h6" gutterBottom style={{margin: '20px 0'}}> Payment Method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
        {
          ({ elements, stripe })=>(
            <form onSubmit={(e)=>handleSubmit(e, elements, stripe)}>
              <CardElement/>
              <br/><br/>
              <div style={{justifyContent: 'space-between', display: 'flex'}}>
                <Button variant="outlined" onClick={decreaseActiveStep}>Back</Button>
                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                  Pay {checkOutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )
        }
        </ElementsConsumer>
      </Elements>
    </>
  );
}

export default PaymentForm;
