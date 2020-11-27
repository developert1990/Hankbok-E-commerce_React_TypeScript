import { saveShippingAddressDataType } from './../actions/cartActions';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_EMPTY } from './../constants/cartConstant';
import { CartActionType } from './../actions/types.d';

export interface cartItemType {
    name: string;
    image: string;
    price: number;
    countInStock: number;
    product: string;
    qty: number;
}

export interface cartInitailStateType {
    cartItems: cartItemType[];
    shippingAddress: saveShippingAddressDataType;
    paymentMethod: string;
}

export const cartInitailState: cartInitailStateType = {
    // 새로고침 했을 경우에 localStroage에 제품이 담겨 있으면 그걸 가져와서 state에 저장하게끔 초기화를 한다 없으면 그냥 빈 배열을 state넣는다.
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems") as string)
        : [],
    shippingAddress: localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress") as string) : {},
    paymentMethod: 'PayPal'

}


export const cartReducer = (state = cartInitailState, action: CartActionType) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload; // 카트에 넣을, 즉 선택한 아이템
            const typedItem = item as cartItemType; // item의 타입이 cartItemType 과 string 이 있어서 cartItemType으로 한정지어 줬다.
            const existItem = state.cartItems.find((x) => x.product === typedItem.product); //만약 새로 넣은 아이템이 카트에 이미 존재하는 것인지 아닌지에 대해서 existItem으로 지정해줬다.
            if (existItem) {// 만약 새로 넣은 아이템이 카트에 이미존재할 경우
                console.log("새로운 아이템이 카트에 이미 존재한다: ", existItem);
                console.log('state.cartItems: ', state.cartItems);
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) => x.product === existItem.product ? item : x), // 기존의 카트배열을 순회하면서 각 아이템의 id랑 이미카트에 존재한(선택한 아이템) 아이템의 id가 같으면 카트에 넣을 새로운 아이템을 넣고 아니면 기존의 아이템을 넣고 뽑는다.
                }
            } else { // 만약 새로 넣은 아이템에 카트에 존재하지 않는 경우
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            }
        case CART_EMPTY:
            return {
                ...state,
                cartItems: []
            }

        default:
            return state;
    }
}