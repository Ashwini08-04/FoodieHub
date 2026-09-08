import { createContext, useEffect, useMemo, useState } from "react"

export const CartContext = createContext()

const parseOffer = (offer = "") => {
  const text = offer.toLowerCase()

  const percentMatch = text.match(/(\d+)\s*%/)
  const capMatch = text.match(/(?:up to|max|maximum)\s*₹?\s*(\d+)/i)
  const flatMatch = text.match(/₹\s*(\d+)\s*off/i)

  return {
    percentage: percentMatch ? Number(percentMatch[1]) : 0,
    maxDiscount: capMatch ? Number(capMatch[1]) : null,
    flatDiscount: flatMatch ? Number(flatMatch[1]) : 0
  }
}

function calculateOffer(item) {
  if (!item.offer) {
    return {
      discount: 0,
      offerText: ""
    }
  }

  const {
    percentage,
    maxDiscount,
    flatDiscount
  } = parseOffer(item.offer)

  const itemTotal =
    Number(item.price) * Number(item.quantity)

  let discount = 0

  if (percentage > 0) {
    discount = (itemTotal * percentage) / 100

    if (maxDiscount !== null) {
      discount = Math.min(
        discount,
        maxDiscount
      )
    }
  }

  if (flatDiscount > 0) {
    discount = flatDiscount
  }

  discount = Math.min(
    discount,
    itemTotal
  )

  return {
    discount: Math.round(discount),
    offerText: item.offer
  }
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart =
      localStorage.getItem("cart")

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

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    )
  }, [cart])

const offerDetails = useMemo(() => {
  let totalDiscount = 0
  const appliedOffers = []

  cart.forEach((item) => {
    const result = calculateOffer(item)

    totalDiscount += result.discount

    if (result.discount > 0 && result.offerText) {
      const exists = appliedOffers.some(
        (offer) =>
          offer.restaurant === (item.restaurantName || "") &&
          offer.offer === result.offerText
      )

      if (!exists) {
        appliedOffers.push({
          restaurant: item.restaurantName || "",
          offer: result.offerText
        })
      }
    }
  })

  return {
    totalDiscount,
    appliedOffers
  }
}, [cart])

  const deliveryFee =
    cart.length > 0 ? 0 : 0

  const totalAmount = Math.max(
    0,
    cartSubtotal -
      offerDetails.totalDiscount +
      deliveryFee
  )

  const addItem = (item) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (cartItem) =>
            cartItem.food === item.food
        )

      if (existingItem) {
        return currentCart.map(
          (cartItem) =>
            cartItem.food === item.food
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity + 1
                }
              : cartItem
        )
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1
        }
      ]
    })
  }

  const updateQuantity = (
    foodId,
    quantity
  ) => {
    setCart((currentCart) => {
      if (quantity <= 0) {
        return currentCart.filter(
          (item) =>
            item.food !== foodId
        )
      }

      return currentCart.map(
        (item) =>
          item.food === foodId
            ? {
                ...item,
                quantity
              }
            : item
      )
    })
  }

  const removeItem = (foodId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.food !== foodId
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,

        cartCount: cart.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),

        cartSubtotal,
        deliveryFee,

        discount:
          offerDetails.totalDiscount,

        totalDiscount:
          offerDetails.totalDiscount,

        appliedOffers:
          offerDetails.appliedOffers,

        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider