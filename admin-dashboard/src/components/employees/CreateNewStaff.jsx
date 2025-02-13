import { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { addStaff } from "@/redux/features/employees/employeesSlice";
import { departments, roles } from "@/mocks/employees/staff-data";

const CreateNewStaff = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && { department: "" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return alert("Please fill all fields");
    }
    dispatch(addStaff(formData));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        label="Contact Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
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
      >
        {departments.map((dept) => (
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
        sx={{ mt: 2 }}
      >
        Create Member
      </Button>
    </form>
  );
};

export default CreateNewStaff;
