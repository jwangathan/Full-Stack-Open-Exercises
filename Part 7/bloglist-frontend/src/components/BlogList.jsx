import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, updateBlog } from "../reducers/blogReducer";
import { displayNotification } from "../reducers/notificationReducer";

const Blog = ({ blog, updateLike, removeBlog, user }) => {
  const [view, setView] = useState(false);
  const label = view ? "hide" : "view";
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <span>
        {blog.title} - {blog.author}
      </span>
      <button onClick={() => setView(!view)}>{label}</button>
      {view && (
        <div className="viewContent">
          url: {blog.url}
          <br></br>
          likes: {blog.likes} <button onClick={updateLike}>like</button>
          <br></br>
          {blog.user.name}
          <br></br>
          {user.user.username === blog.user.username && (
            <button onClick={removeBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

const BlogList = (user) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const handleLike = (blog) => {
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    dispatch(updateBlog(changedBlog));
    dispatch(displayNotification(`you liked '${changedBlog.title}'`, 5));
  };

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id));
      dispatch(displayNotification(`'${blog.title}' Successfully deleted!`, 5));
    }
  };

  return (
    <div>
      {[...blogs]
        .sort((b1, b2) => b2.likes - b1.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLike={() => handleLike(blog)}
            removeBlog={() => handleDelete(blog)}
            user={user}
          />
        ))}
    </div>
  );
};

export default BlogList;
