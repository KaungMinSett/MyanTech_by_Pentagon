export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@myantech.com",
    password: "admin123",
    role: "Manager",
    department: "Admin",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 2,
    username: "hr",
    email: "hr@myantech.com",
    password: "hr123",
    role: "Manager",
    department: "HR",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 3,
    username: "warehouse",
    email: "warehouse@myantech.com",
    password: "warehouse123",
    role: "Manager",
    department: "Warehouse",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 4,
    username: "sales",
    email: "sales@myantech.com",
    password: "sales123",
    role: "Manager",
    department: "Sales",
    status: "Available",
    joinDate: "2024-01-01",
  },
];

export const authenticateUser = (username, password) => {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access: `mock-access-token-${user.id}`,
      refresh: `mock-refresh-token-${user.id}`,
    };
  }
  return null;
};
