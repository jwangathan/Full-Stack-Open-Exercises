import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { displayNotification } from "../reducers/notificationReducer";

const BlogForm = () => {
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    event.target.title.value = "";
    event.target.author.value = "";
    event.target.url.value = "";
    dispatch(createBlog(title, author, url));
  };

  return (
    <div className="formDiv">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          Title
          <input
            type="text"
            name="title"
            placeholder="write title here"
            data-testid="title"
          />
        </div>
        <div>
          Author
          <input
            type="text"
            name="author"
            placeholder="write author here"
            data-testid="author"
          />
        </div>
        <div>
          URL
          <input
            type="text"
            name="url"
            placeholder="write url here"
            data-testid="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
