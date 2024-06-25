import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, test } from "vitest";

test("5.13 renders title and name by default, but not URL or likes", () => {
  const blog = {
    title: "Title",
    author: "Jonathan Wang",
    url: "website.com",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Title - Jonathan Wang");
  const url = screen.queryByText("url: website.com");
  const likes = screen.queryByText("likes: 0");
  expect(element).toBeDefined();
  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test("5.14 clicks the view button, and renders the URL and likes", async () => {
  const blog = {
    title: "Title",
    author: "Jonathan Wang",
    url: "website.com",
    user: { name: "Jonathan Wang" },
  };

  const { container } = render(
    <Blog blog={blog} user={{ username: "jonathan_wang" }} />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);
  const element = container.querySelector(".viewContent");
  expect(element).toHaveTextContent("website.com");
  expect(element).toHaveTextContent("likes: like");
});

test("5.15 clicks like button twice and verifies it calls the event handler twice", async () => {
  const blog = {
    title: "Title",
    author: "Jonathan Wang",
    url: "website.com",
    user: { name: "Jonathan Wang" },
  };

  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      updateLike={mockHandler}
      user={{ username: "jonathan_wang" }}
    />,
  );

  const user = userEvent.setup();

  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(1);

  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
