import { createContext, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userPizza, setUserPizza] = useState([]);
  const [token, setToken] = useState(true); // Parte como default el token en true

  const addToCart = (pizza) => {
    const index = cart.findIndex((item) => item.id === pizza.id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart[index].count++;
      setCart(newCart);
    } else {
      const newCart = [...cart, { ...pizza, count: 1 }];
      setCart(newCart);
    }
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((pizza) =>
          pizza.id === id ? { ...pizza, count: pizza.count - 1 } : pizza
        )
        .filter((pizza) => pizza.count > 0)
    );
  };

  const totalPrice = cart.reduce(
    (total, pizza) => total + pizza.price * pizza.count,
    0
  );

  const getQuantity = () => {
    return Math.round(cart.reduce((total, pizza) => total + pizza.count, 0));
  };

  const getPizza = async (id) => {
    const response = await fetch(`http://localhost:5000/api/pizzas/${id}`);
    const data = await response.json();
    setUserPizza(data);
  };

  const logout = () => {
    setToken(false); // Si se presiona Logout, el token cambia a false
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        totalPrice,
        getQuantity,
        getPizza,
        userPizza,
        setUserPizza,
        token,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
