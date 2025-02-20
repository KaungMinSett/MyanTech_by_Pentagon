import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-hot-toast";
import {
  createStaff,
  fetchRoles,
  fetchDepartments,
  deleteStaffAsync,
  fetchEmployees,
} from "@/redux/features/employees/employeesSlice";

const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  role: null,
  department: null,
  status: "Available",
  joinDate: new Date().toISOString().split("T")[0],
};

const CreateNewStaff = ({ onClose }) => {
  const dispatch = useDispatch();
  const {
    loading,
    error: apiError,
    roles,
    departments,
  } = useSelector((state) => state.employees);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
  }, [dispatch]);

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
      if (Object.values(formData).some((value) => !value && value !== 0)) {
        throw new Error("Please fill in all required fields");
      }

      await dispatch(createStaff(formData)).unwrap();
      toast.success("Employee added successfully!");
      onClose();
    } catch (err) {
      if (err.name === "Error") {
        setError(err.message);
        toast.error(err.message);
      } else {
        dispatch(fetchEmployees());
        toast.success("Employee added successfully!");
        onClose();
      }
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const result = await dispatch(deleteStaffAsync(id)).unwrap();
      if (result) {
        toast.success("Employee deleted successfully!");
        onClose();
        dispatch(fetchEmployees());
      }
    } catch (err) {
      toast.error(err || "Failed to delete employee");
      onClose();
    }
  };

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
        error={!!error && !formData.username}
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
            {role.name}
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
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
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
