import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaHome, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const CheckoutForm = () => {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [debugInfo, setDebugInfo] = useState({ visible: false, data: {} });
  
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Reset error when component mounts
    setErrorMessage('');
    setPaymentStatus('loading');
    setProcessingMessage('Connecting to payment service...');

    // Check if we're in development mode
    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
    
    // Use a more reliable endpoint path
    // In production, this should be relative like '/api/payment'
    const apiUrl = 'http://localhost:5000/api/payment/create-payment-intent';
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount: 1000, 
        currency: 'usd', 
        description: 'Premium Plan Subscription' 
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        
        // For debugging purposes
        setDebugInfo(prev => ({
          ...prev,
          data: {
            ...prev.data,
            status: res.status,
            statusText: res.statusText,
            responseText: text.substring(0, 500) // Limit length for display
          }
        }));
        
        // Try to parse as JSON
        try {
          return { ok: res.ok, data: JSON.parse(text) };
        } catch (e) {
          return { 
            ok: false, 
            error: 'Invalid server response format. Expected JSON.',
            parseError: e.message
          };
        }
      })
      .then((result) => {
        if (result.ok && result.data.clientSecret) {
          setClientSecret(result.data.clientSecret);
          setPaymentStatus('idle');
          setProcessingMessage('');
        } else {
          throw new Error(result.error || 'Failed to initialize payment. Please try again later.');
        }
      })
      .catch((err) => {
        console.error('Error fetching client secret:', err);
        setErrorMessage(`Payment initialization failed: ${err.message}`);
        setPaymentStatus('error');
        setProcessingMessage('');
        
        // Add error to debug info
        setDebugInfo(prev => ({
          ...prev, 
          data: {
            ...prev.data,
            error: err.message,
            stack: err.stack
          }
        }));
      });
  }, []);

  const saveTransac = async(paymentObj) => {
    const user = JSON.parse(localStorage.getItem('user'))
    await fetch('http://localhost:5000/api/payment/save-transac', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user._id,
        amount: paymentObj.amount,
        paymentId: paymentObj.id,
        status: paymentObj.status
      }),
    })
    localStorage.setItem('user', JSON.stringify({...user, paymentStatus:true}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setPaymentStatus('loading');
    setProcessingMessage('Processing payment...');

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Test User', // Ideally this would come from a form field
          },
        },
      });

      if (error) {
        console.error('[Payment Error]', error);
        setErrorMessage(`Payment failed: ${error.message}`);
        setPaymentStatus('error');
      } else if (paymentIntent.status === 'succeeded') {
        console.log('[PaymentIntent]', paymentIntent);
        await saveTransac(paymentIntent);
        setPaymentStatus('success');
      } else {
        setErrorMessage(`Payment status: ${paymentIntent.status}. Please contact support.`);
        setPaymentStatus('error');
      }
    } catch (err) {
      console.error('[Unexpected error]', err);
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
      setPaymentStatus('error');
    } finally {
      setProcessingMessage('');
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-5">
        <FaCheckCircle className="text-success mb-3" size={60} />
        <h3 className="mb-3">Payment Successful!</h3>
        <p className="mb-4">Thank you for your purchase. Your premium features are now activated.</p>
        <button 
          className="btn btn-primary px-4 py-2"
          onClick={() => window.location.href = '/homepage'}
          style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
        >
          <FaHome className="me-2" /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        {paymentStatus === 'error' && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" />
            <div>{errorMessage}</div>
          </div>
        )}
        
        {processingMessage && (
          <div className="text-center p-4">
            <div className="spinner-border mb-3" role="status" style={{ color: '#7209b7' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>{processingMessage}</p>
          </div>
        )}
        
        {
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">Card Information</label>
              <div className="border rounded p-3 bg-light">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <small className="text-muted mt-2 d-block">
                For testing, use card number: 4242 4242 4242 4242
              </small>
            </div>
            
            <button
              className="btn btn-primary w-100 py-2"
              type="submit"
              disabled={!stripe || !clientSecret || paymentStatus === 'loading'}
              style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
            >
              <FaCreditCard className="me-2" />
              Pay $10.00
            </button>
          </form>
        }
        
        {/* <div className="mt-4 text-center">
          <button 
            className="btn btn-link text-decoration-none" 
            onClick={() => setDebugInfo(prev => ({ ...prev, visible: !prev.visible }))}
          >
            {debugInfo.visible ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>
        
        {debugInfo.visible && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="mb-2">Debug Information:</h6>
            <pre className="mb-0" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(debugInfo.data, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
     
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="d-flex align-items-center mb-4">
              <a href="/homepage" className="btn btn-outline-secondary me-3">
                <FaArrowLeft /> Back
              </a>
              <h2 className="m-0">Complete Your Payment</h2>
            </div>
            
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title">Premium Plan</h5>
                <p className="card-text text-muted">Access unlimited practice sessions and personalized feedback.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="h3">$10.00</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <span className="badge bg-success px-3 py-2">Best Value</span>
                </div>
              </div>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-4 border-top mt-auto">
        <div className="container text-center text-muted">
          <small>© 2025 PrepNexus. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;