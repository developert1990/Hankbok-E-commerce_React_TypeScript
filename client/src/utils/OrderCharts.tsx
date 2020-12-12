
import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { OrdersListType } from '../reducers/orderReducers';


interface newOrderDataType {
    month?: string;
    date?: number;
    year?: number;
    name?: string;
    y?: number;
}

interface OrderChartPropType {
    orders: OrdersListType[];
}

export const OrderCharts: React.FC<OrderChartPropType> = ({ orders }) => {

    const getOrderdate = () => {
        if (orders) {
            const orderDate = orders.map((order) => new Date(order.createdAt));
            const newDate = orderDate.map((order) => {
                const newOrderData: newOrderDataType = {};
                newOrderData["month"] = order.toDateString().slice(4, 7);
                newOrderData["date"] = order.getUTCDate();
                newOrderData["year"] = order.getUTCFullYear();
                newOrderData["name"] = `${order.getUTCDate()}, ${order.toDateString().slice(4, 7)}, ${order.getUTCFullYear()}`;
                return newOrderData;
            })

            // 중복된 object 찾아서 새로운 객체가 담긴 배열 추출.
            const result = [...newDate.reduce((r, o) => {
                const key = o.month + '-' + o.date;
                const item = r.get(key) || Object.assign({}, o, {
                    y: 0
                });
                item.y += 1;
                return r.set(key, item);
            }, new Map()).values()];

            return Object.values(result);

        }
    }
    const resultOrderData = getOrderdate();
    // console.log('resultOrderData', resultOrderData)


    // react HighChart column bar chart
    const initialOptions = {
        title: {
            text: "Daily Orders",
            style: {
                color: ' #5e4e4e',
            }
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'areaspline'
        },
        credits: { enabled: false },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: 'Order: {point.y}',
                    color: ' #413737',
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
        },
        xAxis: { type: 'category' },
        yAxis: {
            title: {
                text: 'Total orders',

            }

        },
        legend: { enabled: false },
        series: [
            {
                name: "Orders",
                colorByPoint: true,
                data: resultOrderData
            }
        ],

    };



    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={initialOptions} />
    )
}