import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { toast } from "react-hot-toast";
import { departments, roles } from "@/mocks/employees/staff-data";
import { updateStaffAsync } from "@/redux/features/employees/employeesSlice";

export default function EditStaff({ onClose, staffMember, onUpdate }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    status: "",
    department: "",
    role: "",
    joinDate: "",
  });

  useEffect(() => {
    if (staffMember) {
      setFormData({ ...staffMember });
    }
  }, [staffMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(updateStaffAsync(formData)).unwrap();
      if (result) {
        toast.success("Employee updated successfully!");
        onUpdate(result);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update staff member");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter out Admin from departments
  const filteredDepartments = departments.filter(
    (dept) => dept.value !== "Admin"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email || ""}
        onChange={handleChange}
        required
      />

      <TextField
        select
        fullWidth
        label="Status"
        name="status"
        value={formData.status || ""}
        onChange={handleChange}
        required
      >
        <MenuItem key="available" value="Available">
          Available
        </MenuItem>
        <MenuItem key="unavailable" value="Unavailable">
          Unavailable
        </MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Department"
        name="department"
        value={formData.department || ""}
        onChange={handleChange}
        required
      >
        {filteredDepartments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role || ""}
        onChange={handleChange}
        required
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.label}
          </MenuItem>
        ))}
      </TextField>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
