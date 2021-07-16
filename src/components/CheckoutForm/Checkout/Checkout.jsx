import React,{ useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import useStyles from './styles';
import { commerce } from '../../../lib/commerce';

import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({cart, order, handleCaptureCheckout, error}) => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [checkOutToken, setCheckOutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const history = useHistory();
  
  useEffect(()=>{
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
        // console.log(token);
        setCheckOutToken(token);
      } catch (error) {
        history.push('/');
      }
    }
    generateToken();
  },[cart]);

  const increaseActiveStep = () => setActiveStep((previousActiveStep)=> previousActiveStep + 1 )
  const decreaseActiveStep = () => setActiveStep((previousActiveStep)=> previousActiveStep - 1 )

  const next = (data) => {
    setShippingData(data);
    increaseActiveStep();
  }

  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  ));

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    );
  }

  const Form = () => activeStep === 0 ? <AddressForm checkOutToken={checkOutToken} next={next}/>: <PaymentForm checkOutToken={checkOutToken} increaseActiveStep={increaseActiveStep} decreaseActiveStep={decreaseActiveStep} shippingData={shippingData} handleCaptureCheckout={handleCaptureCheckout
  }/>;

  return(
    <>
      <div className={classes.toolbar}/>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center"> Checkout </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
          {
            steps.map((step)=>{
              return (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              )
            })
          }
          </Stepper>
          {activeStep === steps.length ? <Confirmation/> : checkOutToken && <Form/>}
        </Paper>
      </main>
    </>
  );
}

export default Checkout;
