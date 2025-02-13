import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

const CreateNewStaff = ({ onClose, onAddStaff }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debugging
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && { department: "" }), // Reset department when role changes
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert("Please fill all fields");
    onAddStaff(formData);
    onClose();
  };

  return (
    <div >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Contact Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        {/* Role Dropdown */}
        <TextField
          select
          fullWidth
          label="Role"
          key={formData.role}
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="">Select Role</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </TextField>

        {/* Department Dropdown */}
        <TextField
          select
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          margin="normal"
          required
          disabled={!formData.role} // Allow selection only when role is chosen
        >
          <MenuItem value="">Select Department</MenuItem>
          <MenuItem value="sales">Sales</MenuItem>
          <MenuItem value="warehouse">Warehouse</MenuItem>
          <MenuItem value="finance">Finance</MenuItem>
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
    </div>
  );
};

export default CreateNewStaff;
