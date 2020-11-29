import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import { initialAppStateType } from '../store';

export const PaymentMethodScreen = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [paymentMethod, setPaymentMethod] = useState<string>('PayPal');

    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const { shippingAddress } = cart
    if (!shippingAddress.address) {
        history.push("/shipping");
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    }
    return (
        <div className="paymentScreen">
            <form className="paymentScreen__form" onSubmit={submitHandler}>
                <h1 className="form__title">Payment</h1>
                <div>
                    <div>
                        <input type="radio" id="paypal" value="PayPal" name="paymentMethod" required checked onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="paypal">PayPal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input type="radio" id="stripe" value="Stripe" name="paymentMethod" required onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>
                <div>
                    <Button variant="danger" type="submit">Continue</Button>
                </div>
            </form>
        </div>
    )
}
