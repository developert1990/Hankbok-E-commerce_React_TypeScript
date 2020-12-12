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
import _, { object } from "underscore";

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


    console.log('orders', orders)

    interface objtype {
        paidDate?: number;
        paidMonth?: number;
        paidYear?: number;
        name?: string;
        totalPrice?: number;
    }

    const getPaidDate = () => {
        if (orders) {
            const newArray = orders.map((order) => {
                if (order.paidAt !== undefined) {
                    const obj: objtype = {};
                    obj["paidMonth"] = new Date(order.paidAt).getUTCMonth();
                    obj["paidDate"] = new Date(order.paidAt).getUTCDate();
                    obj["paidYear"] = new Date(order.paidAt).getUTCFullYear();
                    obj["name"] = `${new Date(order.paidAt).getUTCDate()}, ${new Date(order.paidAt).toDateString().slice(4, 7)}, ${new Date(order.paidAt).getUTCFullYear()}`
                    obj["totalPrice"] = order.totalPrice;
                    return obj
                }
                return null
            });
            console.log('newArray', newArray)
            const result = new Set(newArray);

            console.log('같은거 제거', result);
            // 이부분 해결해야한다.



            return newArray;
        }
    }

    const paidInfoData = getPaidDate();
    // console.log('paidInfoData', paidInfoData)



    return (
        <div className="dashboardScreen">
            {loading ? (
                <LoadingBox />
            ) : loadingOrderList ? (
                <LoadingBox />
            ) : loadingUserList ? (
                <LoadingBox />
            ) : (
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
