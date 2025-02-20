import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { toast } from "react-hot-toast";
import {
  updateStaffAsync,
  fetchRoles,
  fetchDepartments,
} from "@/redux/features/employees/employeesSlice";

const INITIAL_FORM_STATE = {
  id: "",
  name: "",
  email: "",
  status: "Available",
  department: "",
  role: "",
  joinDate: "",
};

const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Unavailable", label: "Unavailable" },
];

export default function EditStaff({ onClose, staffMember, onUpdate }) {
  const dispatch = useDispatch();
  const { roles, departments } = useSelector((state) => state.employees);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (staffMember) {
      setFormData({ ...staffMember });
    }
  }, [staffMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.department ||
        !formData.role
      ) {
        throw new Error("Please fill in all required fields");
      }

      const result = await dispatch(updateStaffAsync(formData)).unwrap();
      if (result) {
        toast.success("Employee updated successfully!");
        onUpdate(result);
        onClose();
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to update staff member";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "role" || name === "department" ? parseInt(value, 10) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <TextField
        fullWidth
        label="Username"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        error={!!error && !formData.name}
        className="mb-4"
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={!!error && !formData.email}
        className="mb-4"
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
        className="mb-4"
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
        error={!!error && !formData.department}
        className="mb-4"
      >
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Status"
        name="status"
        value={formData.status || "Available"}
        onChange={handleChange}
        className="mb-4"
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formData.name || !formData.email}
        >
          Update Employee
        </Button>
      </div>
    </form>
  );
}
