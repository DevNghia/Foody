import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Button, Card, Input, Table, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBlogs,
  setBlogLoading,
  setRemoveBlogStatus,
} from '../../components/Blog/blogSlice';
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

const Blog = () => {
  useEffect(() => {
    document.title = 'Bài viết - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const { blogLoading, blogs } = useSelector((state) => state.blogs);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [blogRemovedQuantity, setBlogRemovedQuantity] = useState(
    blogs?.filter((blog) => blog.removed === true)?.length
  );
  const [blogsPreview, setBlogsPreview] = useState(
    blogs
      ?.filter((blog) => blog.removed === false)
      ?.map((blog) => ({ ...blog, key: blog.id }))
  );

  useEffect(() => {
    if (blogLoading === 'success') {
      setBlogRemovedQuantity(
        blogs?.filter((blog) => blog.removed === true)?.length
      );
      setBlogsPreview(
        blogs
          ?.filter((blog) => blog.removed === false)
          ?.map((blog) => ({ ...blog, key: blog.id }))
      );
    }
  }, [blogLoading, blogs]);

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
      sorter: (a, b) => a.title.localeCompare(b.title),
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
      title: 'Nhóm thời gian',
      dataIndex: 'timeGroup',
      key: 'timeGroup',
      sorter: (a, b) => a.timeGroup.localeCompare(b.timeGroup),
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
              onClick={() => handleRemoveBlog(record.id)}
            >
              Xoá
            </Button>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle remove one blog
  const handleRemoveBlog = (id) => {
    try {
      dispatch(setBlogLoading('pending'));
      updateDocument('blogs', id, {
        removed: true,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          dispatch(setRemoveBlogStatus({ id, status: true }));
          setBlogRemovedQuantity(blogRemovedQuantity + 1);
          setSelectedRowKeys(
            selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
          );
          dispatch(setBlogLoading('success'));
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

  // handle remove more blog
  const handleRemoveMoreBlog = () => {
    try {
      dispatch(setBlogLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('blogs', id, {
          removed: true,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveBlogStatus({ id, status: true }));
            setBlogRemovedQuantity(blogRemovedQuantity + 1);
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

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setBlogLoading('pending'));
      const firstList = blogs
        ?.filter(
          (blog) =>
            blog?.removed === false &&
            blog?.title?.toLowerCase()?.includes(e.target.value?.toLowerCase())
        )
        ?.map((blog) => ({ ...blog, key: blog.id }));
      const secondList = blogs
        ?.filter(
          (blog) =>
            blog.removed === false &&
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
        Danh sách bài viết
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
              Thêm bài viết
            </Button>
          </Link>
        </div>
        <div className="blogs_list">
          <div className="action">
            <Link to={'removed'} className="removed">
              <DeleteOutlined />
              <Text>{blogRemovedQuantity}</Text>
            </Link>
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleRemoveMoreBlog}
            >
              Xoá
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
      </Card>
    </Wrapper>
  );
};

export default Blog;
