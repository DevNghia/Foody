import React, { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Table, Typography, Card } from 'antd';
import { Wrapper } from './styles';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProducts,
  setProductLoading,
  setRemoveStatus,
} from '../../components/Product/productSlice';
import { updateDocument } from '../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';

const { Text, Title } = Typography;

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

const Product = () => {
  useEffect(() => {
    document.title = 'Món ăn - Food App';
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
  const [productRemovedQuantity, setProductRemovedQuantity] = useState(
    products?.filter((product) => product.removed === true)?.length
  );
  const [productsPreview, setProductsPreview] = useState(
    products
      ?.filter((product) => product.removed === false)
      ?.map((product) => ({ ...product, key: product.id }))
  );

  useEffect(() => {
    if (productLoading === 'success') {
      setProductRemovedQuantity(
        products?.filter((product) => product.removed === true)?.length
      );
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
          <Avatar size="large" src={record?.photoURL}></Avatar>
          <Text className="product_name">
            {name?.length < 30 ? name : name?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      filters: [
        {
          text: 'Combo',
          value: 'Combo',
        },
        {
          text: 'Burger',
          value: 'Burger',
        },
        {
          text: 'Gà rán',
          value: 'Gà rán',
        },
        {
          text: 'Pizza',
          value: 'Pizza',
        },
        {
          text: 'Món phụ',
          value: 'Món phụ',
        },
      ],
      onFilter: (value, record) => record?.category?.indexOf(value) === 0,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Số lượng còn',
      dataIndex: 'quantityRemaining',
      key: 'quantityRemaining',
      sorter: (a, b) => a.quantityRemaining - b.quantityRemaining,
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <>
          <div className="btn_wrapper">
            <Link to={`edit/${record.id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="edit_btn"
              >
                Sửa
              </Button>
            </Link>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="remove_btn"
              onClick={() => handleRemoveProduct(record.id)}
            >
              Xoá
            </Button>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle remove one product
  const handleRemoveProduct = (id) => {
    try {
      dispatch(setProductLoading('pending'));
      updateDocument('products', id, {
        removed: true,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          dispatch(setRemoveStatus({ id, status: true }));
          setProductRemovedQuantity(productRemovedQuantity + 1);
          setSelectedRowKeys(
            selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
          );
          dispatch(setProductLoading('success'));
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

  // handle remove more product
  const handleRemoveMoreProduct = () => {
    try {
      dispatch(setProductLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('products', id, {
          removed: true,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveStatus({ id, status: true }));
            setProductRemovedQuantity(productRemovedQuantity + 1);
          })
          .then(() => {
            setSelectedRowKeys([]);
            dispatch(setProductLoading('success'));
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
      dispatch(setProductLoading('pending'));
      const firstList = products
        ?.filter(
          (product) =>
            product.removed === false &&
            product?.name
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        )
        ?.map((product) => ({ ...product, key: product.id }));
      const secondList = products
        ?.filter(
          (product) =>
            product.removed === false &&
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
        Danh sách món ăn
      </Title>
      <Card>
        <div className="top">
          <div className="search-wrapper">
            <Input
              size="large"
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
          <Link to="add">
            <Button type="primary" size="large">
              <PlusOutlined />
              Thêm món ăn
            </Button>
          </Link>
        </div>
        <div className="products_list">
          <div className="action">
            <Link to={'removed'} className="removed">
              <DeleteOutlined />
              <Text>{productRemovedQuantity}</Text>
            </Link>
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleRemoveMoreProduct}
            >
              Xoá
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
      </Card>
    </Wrapper>
  );
};

export default Product;
