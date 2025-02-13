export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@myantech.com",
    password: "admin123",
    role: "Manager",
    department: "Admin",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 2,
    name: "HR Manager",
    email: "hr@myantech.com",
    password: "hr123",
    role: "Manager",
    department: "HR",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 3,
    name: "Warehouse Staff",
    email: "warehouse@myantech.com",
    password: "warehouse123",
    role: "Manager",
    department: "Warehouse",
    status: "Available",
    joinDate: "2024-01-01",
  },
  {
    id: 4,
    name: "Sales Staff",
    email: "sales@myantech.com",
    password: "sales123",
    role: "Manager",
    department: "Sales",
    status: "Available",
    joinDate: "2024-01-01",
  },
];

export const authenticateUser = (email, password) => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
    };
  }
  return null;
};
