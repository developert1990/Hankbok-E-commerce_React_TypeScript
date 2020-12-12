
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

export const OrderedProductsChart: React.FC<OrderChartPropType> = ({ orders }) => {

    const getOrderedProducts = () => {
        if (orders) {
            const orderedProducts = orders.map((order) => order.orderItems.map((data) => data.name)).flat();

            const result = orderedProducts.reduce((countWords: any, word: any) => {
                countWords[word] = ++countWords[word] || 1;
                return countWords;
            }, {});

            // 아래 구현한거 제대로 해보기
            return Object.entries(result).map(([name, y]) => ({ name, y }));

        }
    }

    const resultOrderedProducts = getOrderedProducts();



    // react HighChart column bar chart
    const initialOptions = {
        title: {
            text: "Product sales",
            style: {
                color: ' #5e4e4e',
            }
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column'
        },
        credits: { enabled: false },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
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
                data: resultOrderedProducts
            }
        ],

    };



    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={initialOptions} />
    )
}
