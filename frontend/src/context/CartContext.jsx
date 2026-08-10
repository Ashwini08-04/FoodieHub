import { createContext, useEffect, useState } from "react"

export const CartContext = createContext()

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")

    return savedCart
      ? JSON.parse(savedCart)
      : []
  })

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    )
  }, [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartCount: cart.reduce((total, item) => total + item.quantity, 0),
        addItem: (item) => {
          setCart((currentCart) => {
            const existingItem = currentCart.find((cartItem) => cartItem.food === item.food)
            if (existingItem) {
              return currentCart.map((cartItem) =>
                cartItem.food === item.food
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              )
            }
            return [...currentCart, { ...item, quantity: 1 }]
          })
        },
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider