import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, Spin, Typography, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../components/Cart/cartSlice';
import moment from 'moment';

const { Title } = Typography;

const generateOptions = (carts, selectedMonth) => {
  const filteredCarts = carts.filter(
    (cart) =>
      moment(cart?.createdAt?.seconds * 1000).format('MM') ===
      (selectedMonth ? selectedMonth.format('MM') : moment().format('MM'))
  );

  const data = [
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '01'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '02'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '03'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '04'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '05'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '06'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '07'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '08'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '09'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '10'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '11'
    ).length,
    filteredCarts.filter(
      (cart) => moment(cart?.createdAt?.seconds * 1000).format('MM') === '12'
    ).length,
  ];

  return {
    title: {
      text: null,
    },
    xAxis: {
      categories: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
      allowDecimals: false,
    },
    series: [
      {
        data,
        name: 'Đơn hàng trong tháng',
      },
    ],
  };
};

const Analytics = () => {
  useEffect(() => {
    document.title = 'Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCarts());
  }, [dispatch]);

  const { cartLoading, carts } = useSelector((state) => state.carts);

  const [options, setOptions] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (cartLoading === 'success') {
      setOptions(generateOptions(carts, selectedMonth));
    }
  }, [cartLoading, carts, selectedMonth]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Thống kê dữ liệu
      </Title>
      <Card>
        <DatePicker.MonthPicker onChange={handleMonthChange} />
        {cartLoading === 'success' ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : (
          <Spin />
        )}
      </Card>
    </Wrapper>
  );
};

export default Analytics;
