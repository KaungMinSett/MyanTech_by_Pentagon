import { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { addStaff } from "@/redux/features/employees/employeesSlice";
import { departments, roles } from "@/mocks/employees/staff-data";

const CreateNewStaff = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    status: "Available",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && { department: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.role ||
        !formData.department
      ) {
        throw new Error("Please fill in all required fields");
      }

      dispatch(addStaff(formData));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out Admin from departments
  const filteredDepartments = departments.filter(
    (dept) => dept.value !== "Admin"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        error={!!error && !formData.name}
      />
      <TextField
        fullWidth
        label="Contact Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={!!error && !formData.email}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        error={!!error && !formData.password}
      />
      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
        error={!!error && !formData.role}
      >
        {roles.map((role) => (
          <MenuItem key={role.value} value={role.value}>
            {role.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        required
        disabled={!formData.role}
        error={!!error && !formData.department}
      >
        {filteredDepartments.map((dept) => (
          <MenuItem key={dept.value} value={dept.value}>
            {dept.label}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Creating..." : "Create Member"}
      </Button>
    </form>
  );
};

export default CreateNewStaff;
