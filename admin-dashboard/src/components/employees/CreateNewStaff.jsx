import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-hot-toast";
import { createStaff } from "@/redux/features/employees/employeesSlice";
import { departments, roles } from "@/mocks/employees/staff-data";

const CreateNewStaff = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error: apiError } = useSelector((state) => state.employees);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: null,
    department: null,
    status: "Available",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "role" || name === "department" ? parseInt(value, 10) : value,
      ...(name === "role" && { department: null }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.role ||
        !formData.department
      ) {
        throw new Error("Please fill in all required fields");
      }

      const result = await dispatch(createStaff(formData)).unwrap();
      if (result) {
        toast.success("Employee added successfully!");
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to create staff member");
      toast.error(err.message || "Failed to create staff member");
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
        label="Username"
        name="username"
        value={formData.username}
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
        value={formData.role || ""}
        onChange={handleChange}
        required
        error={!!error && !formData.role}
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Department"
        name="department"
        value={formData.department || ""}
        onChange={handleChange}
        required
        disabled={!formData.role}
        error={!!error && !formData.department}
      >
        {filteredDepartments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.label}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Creating..." : "Create Member"}
      </Button>
    </form>
  );
};

export default CreateNewStaff;
