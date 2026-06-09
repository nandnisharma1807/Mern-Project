// Stripe.js loader for React
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe('pk_test_YourTestKeyHere'); // Replace with your Stripe publishable key
