export const mockUsers = [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      id: 2,
      email: 'manager@example.com',
      password: 'manager123',
      name: 'Manager User',
      role: 'manager',
    }
  ];
  
  export const authenticateUser = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: `mock-jwt-token-${user.id}`
      };
    }
    return null;
  };