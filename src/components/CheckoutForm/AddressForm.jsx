import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';
import FormInput from './FormInput.jsx';

const AddressForm = ({ checkOutToken, next}) => {
  const methods = useForm();

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name}));
  const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }));

  const fetchCountries = async (checkOutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkOutTokenId);

    // console.log(countries);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  }

  const fetchSubDivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  }

  const fetchShippingOptions = async (checkOutTokenId, country, region = null) => {
    const options = await commerce.checkout.getShippingOptions(checkOutTokenId, { country, region });
    setShippingOptions(options);
    setShippingOption(options[0].id);
  }

  useEffect (()=>{
    fetchCountries(checkOutToken.id)
  },[]);

  useEffect (()=>{
    if(shippingCountry)
      fetchSubDivisions(shippingCountry);
  },[shippingCountry]);

  useEffect (()=>{
    if(shippingSubdivision)
      fetchShippingOptions(checkOutToken.id, shippingCountry, shippingSubdivision);
  },[shippingSubdivision]);

  return(
    <>
      <Typography variant="h6" gutterBottom> Shipping Address </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data)=>next({ ...data, shippingCountry, shippingSubdivision, setShippingOption}))}>
          <Grid container spacing={3}>
            <FormInput name='firstName' label='First Name' required={true}/>
            <FormInput name='lastName'  label='Last Name'  required={true}/>
            <FormInput name='address'   label='Address'    required={false}/>
            <FormInput name='email'     label='Email'      required={false}/>
            <FormInput name='city'      label='City'       required={true}/>
            <FormInput name='zipcode'   label='Zip Code'   required={false}/>
          </Grid>
          <br/>
          <Grid item xs={12} sm={6} >
            <InputLabel> Shipping Country </InputLabel>
            <Select value={shippingCountry} fullWidth onChange={(e)=>setShippingCountry(e.target.value)}>
            {
              countries.map((country)=>{
                return(
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                );
              })

            }
            </Select>
          </Grid>
          <br/>
          <Grid item xs={12} sm={6} >
            <InputLabel> Shipping subdivision </InputLabel>
            <Select value={shippingSubdivision} fullWidth onChange={(e)=>setShippingSubdivision(e.target.value)}>
            {
              subdivisions.map((subdivision)=>{
                return(
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                );
              })

            }
            </Select>
          </Grid>
          <br/>
          <Grid item xs={12} sm={6}>
            <InputLabel> Shipping Options </InputLabel>
            <Select value={shippingOption} fullWidth onChange={(e)=>setShippingOption(e.target.value)}>
            {
              options.map((option)=>{
                return(
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                );
              })

            }
            </Select>
          </Grid>
          <br/>
          <article style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button variant='outlined' component={Link} to="/cart">Back To Cart</Button>
            <Button variant='contained' type="submit">Next</Button>
          </article>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
