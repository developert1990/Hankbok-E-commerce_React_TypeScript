import React, { useEffect } from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { initialAppStateType } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { LoadingBox } from "../components/LoadingBox";
import { listOrders } from "../actions/orderAction";
import { listUsers } from "../actions/userActions";

import { OrderedProductsChart } from '../utils/OrderedProductsChart';
import { OrderCharts } from "../utils/OrderCharts";

export const DashboardScreen = () => {
    const productListStore = useSelector(
        (state: initialAppStateType) => state.productListStore
    );
    const { loading, products } = productListStore;

    const orderListStoreInfo = useSelector(
        (state: initialAppStateType) => state.orderListStore
    );
    const { loading: loadingOrderList, orders } = orderListStoreInfo;

    const userListStore = useSelector(
        (state: initialAppStateType) => state.userListStore
    );
    const { loading: loadingUserList, users } = userListStore;

    const getTotalPaid = () => {
        if (orders) {
            const totalPaid = orders
                .filter((order) => order.isPaid === true)
                .reduce((a, c) => a + c.totalPrice, 0);
            return totalPaid;
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listProducts("all", "all", 0, "none"));
        dispatch(listOrders());
        dispatch(listUsers());
    }, [dispatch]);



    interface PayType {
        paidYear: number;
        paidMonth: number;
        paidDate: number;
        name: string;
        totalPrice: number;
    }


    const getPaidDate = () => {
        if (orders) {
            const newArray = orders.map((order) => {
                if (order.paidAt !== undefined) {
                    const obj: PayType = { name: '', paidDate: 0, paidMonth: 0, paidYear: 0, totalPrice: 0 };
                    obj["paidMonth"] = new Date(order.paidAt).getUTCMonth();
                    obj["paidDate"] = new Date(order.paidAt).getUTCDate();
                    obj["paidYear"] = new Date(order.paidAt).getUTCFullYear();
                    obj["name"] = `${new Date(order.paidAt).getUTCDate()}, ${new Date(order.paidAt).toDateString().slice(4, 7)}, ${new Date(order.paidAt).getUTCFullYear()}`
                    obj["totalPrice"] = order.totalPrice;
                    return obj
                }
                return undefined;
            });
            console.log('newArray', newArray)
            const pays: (PayType | undefined)[] = newArray;




            // 요거 리듀스 계속 보고 익숙해지기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const all = pays.reduce((total, pay) => {
                if (pay) {
                    const { paidDate, paidMonth, paidYear } = pay;
                    const found = total.find((p) => p.paidDate === paidDate && p.paidMonth === paidMonth && p.paidYear === paidYear);
                    if (found) {
                        found.totalPrice += pay.totalPrice;
                    } else {
                        total.push(pay);
                    }
                }
                return total;
            }, [] as PayType[]);

            console.log("선생님작품: ", all);


            // 이거 해보기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // const allPayObject = pay.reduce((total, pay) => {
            //     if (pay) {
            //         const dateString = `${pay.paidYear}-${String(pay.paidMonth).padStart(2, '0')}-${String(pay.paidDate).padStart(2, '0')}`;
            //         if (!total[dateString]) {
            //             total[dateString] = pay.totalPrice
            //         } else {
            //             total[dateString] += pay.totalPrice;
            //         }
            //     }
            //     return total;
            // }, {} as { [date: string]: number });
            // console.log(allPayObject);



            return newArray;
        }
    }

    const paidInfoData = getPaidDate();
    // console.log('paidInfoData', paidInfoData)




    // Object.entries(obj).map(([name, y]) => ({ name, y }))
    // Object.entries(obj).map(([key, val]) => ({ name: key, y: val })

    const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

    console.log(Object.entries(obj).map(([key, val]) => { return { name: key, y: val } }));


    return (
        <div className="dashboardScreen">
            {loading ? (
                <LoadingBox />
            ) : loadingOrderList ? (
                <LoadingBox />
            ) : loadingUserList ? (
                <LoadingBox />
            ) : (
                            orders &&
                            <div>
                                <div className="dashboard__total">
                                    <div className="products_total dashboard__total__items">
                                        <div>
                                            <h2>{products.length}</h2>
                                            <h3>Total products</h3>
                                        </div>
                                        <FolderOpenIcon />
                                    </div>
                                    <div className="orders_total dashboard__total__items">
                                        <div>
                                            <h2>{orders.length}</h2>
                                            <h3>Total orders</h3>
                                        </div>
                                        <ShoppingCartIcon />
                                    </div>
                                    <div className="sales_total dashboard__total__items">
                                        <div>
                                            <h2>{`$ ${getTotalPaid()}`}</h2>
                                            <h3>Total sales</h3>
                                        </div>
                                        <AttachMoneyIcon />
                                    </div>
                                    <div className="user_total dashboard__total__items">
                                        <div>
                                            <h2>{users.length}</h2>
                                            <h3>Total users</h3>
                                        </div>
                                        <PermIdentityOutlinedIcon />
                                    </div>
                                </div>

                                <div className="dashboard__detail">
                                    <div className="prodcut__sales detail__graph">
                                        각 제품 판매갯수
                                        <OrderedProductsChart orders={orders} />
                                    </div>

                                    <div className="product_selling_categories detail__graph">
                                        카테고리별 판매량
                                    </div>
                                    <div className="product__daySale detail__graph">
                                        일일 제품 판매량
                                        {<OrderCharts orders={orders} />}
                                    </div>
                                    <div className="total__dayOrder detail__graph">총 일일 주문량</div>
                                </div>
                            </div>
                        )}
        </div>
    );
};
