import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Avatar, Button, Card, Input, Table, Typography, Modal } from 'antd';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProductById,
  getProducts,
  setProductLoading,
  setRemoveStatus,
} from '../../../components/Product/productSlice';
import { deleteDocument, updateDocument } from '../../../firebase/services';
import { Link } from 'react-router-dom';
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

const RemovedProduct = () => {
  useEffect(() => {
    document.title = 'Món ăn đã xoá gần đây - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const { productLoading, products } = useSelector((state) => state.products);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys([...selectedRowKeys]);
  };
  const [productsPreview, setProductsPreview] = useState(
    products
      ?.filter((product) => product.removed === true)
      ?.map((product) => ({ ...product, key: product.id }))
  );

  useEffect(() => {
    if (productLoading === 'success') {
      setProductsPreview(
        products
          ?.filter((product) => product.removed === false)
          ?.map((product) => ({ ...product, key: product.id }))
      );
    }
  }, [productLoading, products]);

  // config table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'Món ăn',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="product_info">
          <Avatar size="large" src={record.photoURL}></Avatar>
          <Text className="product_name">{name}</Text>
        </div>
      ),
      sorter: true,
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

  // handle restore one product
  const handleRestoreClick = (id) => {
    dispatch(setProductLoading('pending'));
    updateDocument('products', id, {
      removed: false,
      updatedAt: serverTimestamp(),
    })
      .then(() => {
        dispatch(setRemoveStatus({ id, status: false }));
        setSelectedRowKeys(
          selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
        );
        dispatch(setProductLoading('success'));
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  // handle restore more product
  const handleRestoreMoreProduct = () => {
    try {
      dispatch(setProductLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('products', id, {
          removed: false,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveStatus({ id, status: false }));
          })
          .then(() => {
            if (index === selectedRowKeys.length - 1) {
              setSelectedRowKeys([]);
              dispatch(setProductLoading('success'));
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

  // handle delete one product
  const handleDeleteClick = (id) => {
    confirm({
      title: 'Xác nhận xoá món ăn',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setProductLoading('pending'));
        deleteDocument('products', id)
          .then(() => {
            dispatch(deleteProductById(id));
            setSelectedRowKeys(
              selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
            );
            dispatch(setProductLoading('success'));
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

  // handle delete more product
  const handleDeleteMoreProduct = () => {
    confirm({
      title: 'Xác nhận xoá món ăn',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setProductLoading('pending'));
        selectedRowKeys.forEach((id, index) => {
          deleteDocument('products', id)
            .then(() => {
              dispatch(deleteProductById(id));
            })
            .then(() => {
              if (index === selectedRowKeys.length - 1) {
                setSelectedRowKeys([]);
                dispatch(setProductLoading('success'));
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
      dispatch(setProductLoading('pending'));
      const firstList = products
        ?.filter(
          (product) =>
            product.removed === true &&
            product?.name
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        )
        ?.map((product) => ({ ...product, key: product.id }));
      const secondList = products
        ?.filter(
          (product) =>
            product.removed === true &&
            convertVietnamese(product?.name)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        )
        ?.map((product) => ({ ...product, key: product.id }));
      result = [...firstList];
      secondList.forEach((product) => {
        if (
          firstList.filter(
            (productFirstList) => productFirstList.id === product.id
          )?.length === 0
        ) {
          result.push(product);
        }
      });
      setProductsPreview(result);
      dispatch(setProductLoading('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Món ăn đã xoá gần đây
      </Title>
      <Card>
        <div className="top">
          <div className="search-filter">
            <Input
              size="large"
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="products_list">
          <div className="action">
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleDeleteMoreProduct}
            >
              Xoá vĩnh viễn
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length < 1}
              onClick={handleRestoreMoreProduct}
            >
              Khôi phục
            </Button>
            {selectedRowKeys.length > 0 && (
              <Text className="product_selected">{`Đã chọn ${selectedRowKeys.length} món ăn`}</Text>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={productsPreview}
            rowSelection={rowSelection}
            loading={productLoading === 'pending'}
          />
        </div>
        <div className="back">
          <Link to={'/app/admin/products'}>
            <Button type="primary" size="large">
              Quay lại
            </Button>
          </Link>
        </div>
      </Card>
    </Wrapper>
  );
};

export default RemovedProduct;
