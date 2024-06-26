import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText("write title here");
  const author = screen.getByPlaceholderText("write author here");
  const url = screen.getByPlaceholderText("write url here");
  const sendButton = screen.getByText("create");

  await user.type(title, "Title");
  await user.type(author, "Jonathan Wang");
  await user.type(url, "url.com");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Title");
  expect(createBlog.mock.calls[0][0].author).toBe("Jonathan Wang");
  expect(createBlog.mock.calls[0][0].url).toBe("url.com");
});
