import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Avatar, Button, Card, Input, Table, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductReviews,
  setProductReviewLoading,
  setRemoveProductReviewStatus,
} from '../../components/Product/productReviewSlice';
import { getUsers } from '../../components/Profile/profileSlice';
import { getProducts } from '../../components/Product/productSlice';
import { updateDocument } from '../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';

const { Title, Text } = Typography;

function convertVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '-'
  );
  str = str.replace(/-+-/g, '-');
  str = str.replace(/^\-+|\-+$/g, '');

  return str;
}

const ProductReview = () => {
  useEffect(() => {
    document.title = 'Đánh giá món ăn - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductReviews());
    dispatch(getUsers());
    dispatch(getProducts());
  }, [dispatch]);

  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );
  const { productLoading, products } = useSelector((state) => state.products);
  const { userLoading, users } = useSelector((state) => state.users);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [productReviewRemovedQuantity, setProductReviewRemovedQuantity] =
    useState(0);
  const [productReviewsPreview, setProductReviewsPreview] = useState([]);

  useEffect(() => {
    if (
      productReviewLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success'
    ) {
      setProductReviewRemovedQuantity(
        productReviews?.filter(
          (productReview) => productReview.removed === true
        )?.length
      );
      setProductReviewsPreview(
        productReviews
          ?.filter((productReview) => productReview.removed === false)
          ?.map((productReview) => ({
            ...productReview,
            key: productReview.id,
            username: users?.find((user) => user.uid === productReview.userId)
              ?.displayName,
            avatar: users?.find((user) => user.uid === productReview.userId)
              ?.photoURL,
            productName: products?.find(
              (product) => product.productId === productReview.productId
            )?.name,
          }))
      );
    }
  }, [
    productReviewLoading,
    productReviews,
    users,
    products,
    userLoading,
    productLoading,
  ]);

  // select row
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys([...selectedRowKeys]);
  };

  // config table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'Người đánh giá',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <div className="user_info">
          <Avatar size="large" src={record?.avatar}>
            {record?.avatar ? '' : record?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text className="user_title">
            {username?.length < 30
              ? username
              : username?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Sản phẩm đánh giá',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      render: (productName) =>
        productName?.length < 30
          ? productName
          : productName?.substring(0, 30) + '...',
    },
    {
      title: 'Điểm đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '0 sao',
          value: 0,
        },
        {
          text: '1 sao',
          value: 1,
        },
        {
          text: '2 sao',
          value: 2,
        },
        {
          text: '3 sao',
          value: 3,
        },
        {
          text: '4 sao',
          value: 4,
        },
        {
          text: '5 sao',
          value: 5,
        },
      ],
      onFilter: (value, record) => record?.rating === value,
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <>
          <div className="btn_wrapper">
            <Link to={`info/${record.id}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="edit_btn"
              >
                Xem thông tin
              </Button>
            </Link>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="remove_btn"
              onClick={() => handleRemoveProductReview(record.id)}
            >
              Xoá
            </Button>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle remove one product review
  const handleRemoveProductReview = (id) => {
    try {
      dispatch(setProductReviewLoading('pending'));
      updateDocument('productReviews', id, {
        removed: true,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          dispatch(setRemoveProductReviewStatus({ id, status: true }));
          setProductReviewRemovedQuantity(productReviewRemovedQuantity + 1);
          setSelectedRowKeys(
            selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
          );
          dispatch(setProductReviewLoading('success'));
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle remove more product review
  const handleRemoveMoreProductReview = () => {
    try {
      dispatch(setProductReviewLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('productReviews', id, {
          removed: true,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveProductReviewStatus({ id, status: true }));
            setProductReviewRemovedQuantity(productReviewRemovedQuantity + 1);
          })
          .then(() => {
            if (index === selectedRowKeys.length - 1) {
              setSelectedRowKeys([]);
              dispatch(setProductReviewLoading('success'));
            }
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setProductReviewLoading('pending'));
      const firstList = productReviews
        ?.filter((productReview) => productReview?.removed === false)
        ?.map((productReview) => ({
          ...productReview,
          key: productReview.id,
          username: users?.find((user) => user.uid === productReview.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === productReview.userId)
            ?.photoURL,
          productName: products?.find(
            (product) => product.productId === productReview.productId
          )?.name,
        }))
        ?.filter(
          (productReview) =>
            productReview?.username
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            productReview?.productName
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      const secondList = productReviews
        ?.filter((productReview) => productReview.removed === false)
        ?.map((productReview) => ({
          ...productReview,
          key: productReview.id,
          username: users?.find((user) => user.uid === productReview.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === productReview.userId)
            ?.photoURL,
          productName: products?.find(
            (product) => product.productId === productReview.productId
          )?.name,
        }))
        ?.filter(
          (productReview) =>
            convertVietnamese(productReview?.username)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            convertVietnamese(productReview?.productName)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      result = [...firstList];
      secondList.forEach((productReview) => {
        if (
          firstList.filter(
            (productReviewFirstList) =>
              productReviewFirstList.id === productReview.id
          )?.length === 0
        ) {
          result.push(productReview);
        }
      });
      setProductReviewsPreview(result);
      dispatch(setProductReviewLoading('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Danh sách đánh giá món ăn
      </Title>
      <Card>
        <div className="top">
          <div className="search-wrapper">
            <Input
              size="large"
              placeholder="Tìm kiếm đánh giá của khách hàng"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="blogs_list">
          <div className="action">
            <Link to={'removed'} className="removed">
              <DeleteOutlined />
              <Text>{productReviewRemovedQuantity}</Text>
            </Link>
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleRemoveMoreProductReview}
            >
              Xoá
            </Button>
            {selectedRowKeys.length > 0 && (
              <Text className="product-review_selected">{`Đã chọn ${selectedRowKeys.length} đánh giá món ăn`}</Text>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={productReviewsPreview}
            rowSelection={rowSelection}
            loading={
              userLoading === 'pending' ||
              productLoading === 'pending' ||
              productReviewLoading === 'pending'
            }
          />
        </div>
      </Card>
    </Wrapper>
  );
};

export default ProductReview;
