import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
  // errors have an id of error.

  // Arrange
  render(<ContactForm />);

  // Act
  const error = screen.queryAllByTestId("error");

  // Assert
  expect(error).not.toBeInTheDocument;
});

test("renders the contact form header", () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const header = screen.queryByText(/Contact Form/i);
  // Assert
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  // Arrange
  render(<ContactForm />);

  // Act
  // const firstnameLabel = screen.getByText("First Name*");
  const firstname = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstname, "Edd");

  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const submitButton = screen.getByText("Submit");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errors = screen.queryAllByTestId("error");
    // Assert
    expect(errors).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const firstname = screen.getByLabelText(/first name*/i);
  const lastname = screen.getByLabelText(/last name*/i);
  userEvent.type(firstname, "Anthony");
  userEvent.type(lastname, "Burke");

  const submitButton = screen.getByText("Submit");
  userEvent.click(submitButton);

  await waitFor(() => {});
  const errors = screen.queryAllByTestId("error");
  // Assert
  expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const firstname = screen.getByLabelText(/first name*/i);
  userEvent.type(firstname, "Anthony");

  const lastname = screen.getByLabelText(/last name*/i);
  userEvent.type(lastname, "Burke");

  const email = screen.getByLabelText(/Email*/);
  userEvent.type(email, "example");

  const submitButton = screen.getByText("Submit");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errors = screen.getByTestId("error");
    // Assert
    expect(errors).toHaveTextContent("email must be a valid email address");
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const firstname = screen.getByLabelText(/first name*/i);
  userEvent.type(firstname, "Anthony");

  const lastname = screen.getByLabelText(/last name*/i);

  const email = screen.getByLabelText(/Email*/);
  userEvent.type(email, "example@email.com");

  const submitButton = screen.getByText("Submit");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errors = screen.getByTestId("error");
    // Assert
    expect(errors).toHaveTextContent("lastName is a required field");
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const firstname = screen.getByLabelText(/first name*/i);
  userEvent.type(firstname, "Anthony");

  const lastname = screen.getByLabelText(/last name*/i);
  userEvent.type(lastname, "Burke");

  const email = screen.getByLabelText(/Email*/);
  userEvent.type(email, "example@email.com");

  const submitButton = screen.getByText("Submit");
  await userEvent.click(submitButton);
  // Assert

  const firstnameDisplay = screen.getByTestId("firstnameDisplay");
  const lastnameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  // const messageDisplay = screen.getByTestId("messageDisplay");
  // waitFor()
  expect(firstnameDisplay).toHaveTextContent("Anthony");
  expect(lastnameDisplay).toHaveTextContent("Burke");
  expect(emailDisplay).toHaveTextContent("example@email.com");
  // expect(messageDisplay).toHaveTextContent("");
});

test("renders all fields text when all fields are submitted.", async () => {
  // Arrange
  render(<ContactForm />);
  // Act
  const firstname = screen.getByLabelText(/first name*/i);
  userEvent.type(firstname, "Anthony");

  const lastname = screen.getByLabelText(/last name*/i);
  userEvent.type(lastname, "Burke");

  const email = screen.getByLabelText(/Email*/);
  userEvent.type(email, "example@email.com");

  const message = screen.getByLabelText(/Message/i);
  userEvent.type(message, "Hello world!");

  const submitButton = screen.getByText("Submit");
  await userEvent.click(submitButton);
  // Assert

  const firstnameDisplay = screen.getByTestId("firstnameDisplay");
  const lastnameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  const messageDisplay = screen.getByTestId("messageDisplay");
  // waitFor()
  expect(firstnameDisplay).toHaveTextContent("Anthony");
  expect(lastnameDisplay).toHaveTextContent("Burke");
  expect(emailDisplay).toHaveTextContent("example@email.com");
  expect(messageDisplay).toHaveTextContent("Hello world!");
});
