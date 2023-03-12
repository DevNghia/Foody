import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Avatar, Button, Card, Input, Modal, Table, Typography } from 'antd';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProductReviewById,
  getProductReviews,
  setProductReviewLoading,
  setRemoveProductReviewStatus,
} from '../../../components/Product/productReviewSlice';
import { getUsers } from '../../../components/Profile/profileSlice';
import { getProducts } from '../../../components/Product/productSlice';
import { Link } from 'react-router-dom';
import { deleteDocument, updateDocument } from '../../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';

const { Title, Text } = Typography;
const { confirm } = Modal;

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

const RemovedProductReview = () => {
  useEffect(() => {
    document.title = 'Đánh giá món ăn đã xoá gần đây - Food App';
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
  const [productReviewsPreview, setProductReviewsPreview] = useState([]);

  useEffect(() => {
    if (
      productReviewLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success'
    ) {
      setProductReviewsPreview(
        productReviews
          ?.filter((productReview) => productReview.removed === true)
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

  // handle select row
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
          <Text className="user_name">
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
        <div className="btn_wrapper">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            className="restore_btn"
            onClick={() => handleRestoreClick(record.id)}
          >
            Khôi phục
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className="remove_btn"
            onClick={() => handleDeleteClick(record.id)}
          >
            Xoá vĩnh viễn
          </Button>
        </div>
      ),
      width: '15%',
    },
  ];

  // handle restore one product review
  const handleRestoreClick = (id) => {
    dispatch(setProductReviewLoading('pending'));
    updateDocument('productReviews', id, {
      removed: false,
      updatedAt: serverTimestamp(),
    })
      .then(() => {
        dispatch(setRemoveProductReviewStatus({ id, status: false }));
        setSelectedRowKeys(
          selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
        );
        dispatch(setProductReviewLoading('success'));
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  // handle restore more product review
  const handleRestoreMoreProductReview = () => {
    try {
      dispatch(setProductReviewLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('productReviews', id, {
          removed: false,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveProductReviewStatus({ id, status: false }));
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

  // handle delete one product review
  const handleDeleteClick = (id) => {
    confirm({
      title: 'Xác nhận xoá đánh giá',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setProductReviewLoading('pending'));
        deleteDocument('productReviews', id)
          .then(() => {
            dispatch(deleteProductReviewById(id));
            setSelectedRowKeys(
              selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
            );
            dispatch(setProductReviewLoading('success'));
            alert('Xoá thành công');
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      },
      onCancel() {},
    });
  };

  // handle delete more product review
  const handleDeleteMoreProductReview = () => {
    confirm({
      title: 'Xác nhận xoá đánh giá',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setProductReviewLoading('pending'));
        selectedRowKeys.forEach((id, index) => {
          deleteDocument('productReviews', id)
            .then(() => {
              dispatch(deleteProductReviewById(id));
            })
            .then(() => {
              if (index === selectedRowKeys.length - 1) {
                setSelectedRowKeys([]);
                dispatch(setProductReviewLoading('success'));
                alert('Xoá thành công');
              }
            })
            .catch((error) => {
              console.log(error);
              alert(error);
            });
        });
      },
      onCancel() {},
    });
  };

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setProductReviewLoading('pending'));
      const firstList = productReviews
        ?.filter((productReview) => productReview?.removed === true)
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
        ?.filter((productReview) => productReview.removed === true)
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
        Đánh giá món ăn đã xoá gần đây
      </Title>
      <Card>
        <div className="top">
          <div className="search-filter">
            <Input
              size="large"
              placeholder="Tìm kiếm đánh giá của khách hàng"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="product-reviews_list">
          <div className="action">
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleDeleteMoreProductReview}
            >
              Xoá vĩnh viễn
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length < 1}
              onClick={handleRestoreMoreProductReview}
            >
              Khôi phục
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
        <div className="back">
          <Link to={'/app/admin/product-reviews'}>
            <Button type="primary" size="large">
              Quay lại
            </Button>
          </Link>
        </div>
      </Card>
    </Wrapper>
  );
};

export default RemovedProductReview;
