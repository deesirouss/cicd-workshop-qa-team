import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserStats from "../UserStats";

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe("UserStats Component", () => {
  beforeEach(() => {
    mockReload.mockClear();
  });

  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@test.com",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      createdAt: new Date().toISOString(),
    },
  ];

  it("renders user statistics correctly", () => {
    render(<UserStats users={mockUsers} />);

    expect(screen.getByText("📊 User Statistics")).toBeInTheDocument();
    expect(screen.getByTestId("total-users")).toHaveTextContent("3");
    expect(screen.getByText("Total Users")).toBeInTheDocument();
  });

  it("calculates recent users correctly", () => {
    render(<UserStats users={mockUsers} />);

    // Should show 2 recent users (created within 24 hours)
    expect(screen.getByTestId("recent-users")).toHaveTextContent("2");
    expect(screen.getByText("New Users (24h)")).toBeInTheDocument();
  });

  it("calculates growth rate correctly", () => {
    render(<UserStats users={mockUsers} />);

    // Growth rate should be 67% (2 recent out of 3 total)
    expect(screen.getByTestId("growth-rate")).toHaveTextContent("67%");
    expect(screen.getByText("Growth Rate")).toBeInTheDocument();
  });

  it("displays domain statistics", () => {
    render(<UserStats users={mockUsers} />);

    expect(screen.getByText("🌐 Users by Domain")).toBeInTheDocument();
    expect(screen.getByTestId("domain-stats")).toBeInTheDocument();

    // Should show example.com: 2, test.com: 1
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("test.com")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles empty users array", () => {
    render(<UserStats users={[]} />);

    expect(screen.getByTestId("total-users")).toHaveTextContent("0");
    expect(screen.getByTestId("recent-users")).toHaveTextContent("0");
    expect(screen.getByTestId("growth-rate")).toHaveTextContent("0%");
    expect(screen.queryByText("🌐 Users by Domain")).not.toBeInTheDocument();
  });

  it("handles users without email", () => {
    const usersWithoutEmail = [
      { id: 1, name: "John Doe", createdAt: new Date().toISOString() },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@test.com",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<UserStats users={usersWithoutEmail} />);

    expect(screen.getByTestId("total-users")).toHaveTextContent("2");
    // Only one user has email, so only test.com should appear
    expect(screen.getByText("test.com")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("refresh button triggers page reload", () => {
    render(<UserStats users={mockUsers} />);

    const refreshButton = screen.getByTestId("refresh-stats");
    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("displays correct icons and styling", () => {
    render(<UserStats users={mockUsers} />);

    expect(screen.getByText("👥")).toBeInTheDocument();
    expect(screen.getByText("🆕")).toBeInTheDocument();
    expect(screen.getByText("📈")).toBeInTheDocument();
    expect(screen.getByText("🔄 Refresh Stats")).toBeInTheDocument();
  });
});
