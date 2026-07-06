import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [tripPlan, setTripPlan] = useState({
    numberOfPeople: 1,
    numberOfDays: 3,
    arrivalMode: 'Train',
    needPickup: false,
    arrivalLocation: '',
    travelDates: { from: '', to: '' },
  });
  
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persist state changes
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('tripPlan');
      if (savedPlan && savedPlan !== 'undefined') {
        const parsed = JSON.parse(savedPlan);
        if (parsed && typeof parsed === 'object') setTripPlan(parsed);
      }
    } catch (e) {
      console.error('Failed to parse tripPlan from localStorage', e);
    }
    try {
      const savedCart = localStorage.getItem('tripCart');
      if (savedCart && savedCart !== 'undefined') {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {
      console.error('Failed to parse tripCart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tripPlan', JSON.stringify(tripPlan));
    }
  }, [tripPlan, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tripCart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const updateTripPlan = (data) => setTripPlan((prev) => ({ ...prev, ...data }));

  const addToCart = (destination) => {
    if (cart.find((d) => d._id === destination._id)) {
      toast.error(`${destination.name} is already in your trip!`);
      return;
    }
    setCart((prev) => [...prev, destination]);
    toast.success(`${destination.name} added to trip! 🗺️`);
  };

  const removeFromCart = (destId) => {
    setCart((prev) => prev.filter((d) => d._id !== destId));
    toast.success('Destination removed from trip');
  };

  const isInCart = (destId) => cart.some((d) => d._id === destId);

  const clearCart = () => setCart([]);

  const generateWhatsAppMessage = (userName, phone) => {
    const destinations = cart.map((d) => `• ${d.name} (${d.location})`).join('\n');
    const msg = `
🌴 *TRIPORIO - KERALA TRIP REQUEST*

👤 *Name:* ${userName}
📱 *Phone:* ${phone}

━━━━━━━━━━━━━━━━━━━

✈️ *TRIP DETAILS*
👥 People: ${tripPlan.numberOfPeople}
📅 Days: ${tripPlan.numberOfDays}
🚗 Arrival Mode: ${tripPlan.arrivalMode}
🚕 Pickup Needed: ${tripPlan.needPickup ? 'Yes' : 'No'}
📍 Arrival Location: ${tripPlan.arrivalLocation || 'Not specified'}
🗓️ Travel Dates: ${tripPlan.travelDates?.from ? new Date(tripPlan.travelDates.from).toLocaleDateString() : 'Flexible'} to ${tripPlan.travelDates?.to ? new Date(tripPlan.travelDates.to).toLocaleDateString() : 'Flexible'}

━━━━━━━━━━━━━━━━━━━

📍 *SELECTED DESTINATIONS (${cart.length})*
${destinations}

━━━━━━━━━━━━━━━━━━━
Please contact me with pricing and trip details. Thank you! 🙏
    `.trim();
    return encodeURIComponent(msg);
  };

  return (
    <TripContext.Provider value={{
      tripPlan, updateTripPlan,
      cart, addToCart, removeFromCart, isInCart, clearCart,
      generateWhatsAppMessage,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within TripProvider');
  return context;
};
