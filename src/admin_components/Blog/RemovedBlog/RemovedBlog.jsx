import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Button, Card, Input, Modal, Table, Typography } from 'antd';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteBlogById,
  getBlogs,
  setBlogLoading,
  setRemoveBlogStatus,
} from '../../../components/Blog/blogSlice';
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

const RemovedBlog = () => {
  useEffect(() => {
    document.title = 'Món ăn đã xoá gần đây - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const { blogLoading, blogs } = useSelector((state) => state.blogs);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [blogsPreview, setBlogsPreview] = useState(
    blogs
      ?.filter((blog) => blog.removed === true)
      ?.map((blog) => ({ ...blog, key: blog.id }))
  );

  useEffect(() => {
    if (blogLoading === 'success') {
      setBlogsPreview(
        blogs
          ?.filter((blog) => blog.removed === true)
          ?.map((blog) => ({ ...blog, key: blog.id }))
      );
    }
  }, [blogLoading, blogs]);

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
      title: 'Bài viết',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div className="blog_info">
          <Text className="blog_title">
            {title?.length < 30 ? title : title?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Bộ sưu tập',
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

  // handle restore one blog
  const handleRestoreClick = (id) => {
    dispatch(setBlogLoading('pending'));
    updateDocument('blogs', id, {
      removed: false,
      updatedAt: serverTimestamp(),
    })
      .then(() => {
        dispatch(setRemoveBlogStatus({ id, status: false }));
        setSelectedRowKeys(
          selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
        );
        dispatch(setBlogLoading('success'));
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  // handle restore more blog
  const handleRestoreMoreBlog = () => {
    try {
      dispatch(setBlogLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('blogs', id, {
          removed: false,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveBlogStatus({ id, status: false }));
          })
          .then(() => {
            if (index === selectedRowKeys.length - 1) {
              setSelectedRowKeys([]);
              dispatch(setBlogLoading('success'));
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

  // handle delete one blog
  const handleDeleteClick = (id) => {
    confirm({
      title: 'Xác nhận xoá bài viết',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setBlogLoading('pending'));
        deleteDocument('blogs', id)
          .then(() => {
            dispatch(deleteBlogById(id));
            setSelectedRowKeys(
              selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
            );
            dispatch(setBlogLoading('success'));
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

  // handle delete more blog
  const handleDeleteMoreBlog = () => {
    confirm({
      title: 'Xác nhận xoá bài viết',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setBlogLoading('pending'));
        selectedRowKeys.forEach((id, index) => {
          deleteDocument('blogs', id)
            .then(() => {
              dispatch(deleteBlogById(id));
            })
            .then(() => {
              if (index === selectedRowKeys.length - 1) {
                setSelectedRowKeys([]);
                dispatch(setBlogLoading('success'));
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
      dispatch(setBlogLoading('pending'));
      const firstList = blogs
        ?.filter(
          (blog) =>
            blog?.removed === true &&
            blog?.title?.toLowerCase()?.includes(e.target.value?.toLowerCase())
        )
        ?.map((blog) => ({ ...blog, key: blog.id }));
      const secondList = blogs
        ?.filter(
          (blog) =>
            blog.removed === true &&
            convertVietnamese(blog?.title)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        )
        ?.map((blog) => ({ ...blog, key: blog.id }));
      result = [...firstList];
      secondList.forEach((blog) => {
        if (
          firstList.filter((blogFirstList) => blogFirstList.id === blog.id)
            ?.length === 0
        ) {
          result.push(blog);
        }
      });
      setBlogsPreview(result);
      dispatch(setBlogLoading('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Bài viết đã xoá gần đây
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
        <div className="blogs_list">
          <div className="action">
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleDeleteMoreBlog}
            >
              Xoá vĩnh viễn
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length < 1}
              onClick={handleRestoreMoreBlog}
            >
              Khôi phục
            </Button>
            {selectedRowKeys.length > 0 && (
              <Text className="blog_selected">{`Đã chọn ${selectedRowKeys.length} bài viết`}</Text>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={blogsPreview}
            rowSelection={rowSelection}
            loading={blogLoading === 'pending'}
          />
        </div>
        <div className="back">
          <Link to={'/app/admin/blogs'}>
            <Button type="primary" size="large">
              Quay lại
            </Button>
          </Link>
        </div>
      </Card>
    </Wrapper>
  );
};

export default RemovedBlog;
