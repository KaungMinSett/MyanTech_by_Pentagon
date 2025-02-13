import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { departments, roles } from "@/mocks/employees/staff-data";
import { updateStaff } from "@/redux/features/employees/employeesSlice";

export default function EditStaff({ onClose }) {
  const dispatch = useDispatch();
  const selectedStaff = useSelector((state) => state.employees.selectedStaff);
  const [formData, setFormData] = useState(selectedStaff || {});

  useEffect(() => {
    if (selectedStaff) {
      setFormData(selectedStaff);
    }
  }, [selectedStaff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateStaff(formData));
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        SelectProps={{
          MenuProps: {
            disablePortal: true,
            disableScrollLock: true,
          },
        }}
      >
        <MenuItem value="Available">Available</MenuItem>
        <MenuItem value="Unavailable">Unavailable</MenuItem>
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
        {departments.map((dept) => (
          <MenuItem key={dept.value} value={dept.value}>
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
          <MenuItem key={role.value} value={role.value}>
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
