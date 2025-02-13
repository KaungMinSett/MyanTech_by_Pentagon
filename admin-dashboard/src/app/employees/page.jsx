import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, MoreVertical, Plus } from "lucide-react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { Modal } from "@/components/modal/modal";
import CreateNewStaff from "@/components/employees/CreateNewStaff";
import EditStaff from "@/components/employees/EditStaff";
import {
  addStaff,
  updateStaff,
  deleteStaff,
  setSelectedStaff,
  setFilter,
  setSearchQuery,
} from "@/redux/features/employees/employeesSlice";

export default function StaffList() {
  const dispatch = useDispatch();
  const { staffMembers, filter, searchQuery } = useSelector(
    (state) => state.employees
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleDelete = (id) => {
    dispatch(deleteStaff(id));
  };

  const handleEdit = (member) => {
    dispatch(setSelectedStaff(member));
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedStaff) => {
    dispatch(updateStaff(updatedStaff));
    setEditModalOpen(false);
  };
  

  const handleAddStaff = (newStaff) => {
    dispatch(addStaff(newStaff));
    setAddModalOpen(false);
  };

  const handleMenuOpen = useCallback((event, member) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedMember(null);
  }, []);

  const handleEditClick = () => {
    handleEdit(selectedMember);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    handleDelete(selectedMember.id);
    handleMenuClose();
  };

  const filteredStaff =
    staffMembers?.filter(
      (member) =>
        [member.name, member.role, member.email]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery?.toLowerCase() || "") &&
        (filter === "" || member.role === filter || member.status === filter)
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employees</h2>
        <div className="flex items-center gap-4">
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            InputProps={{
              startAdornment: <Search className="w-4 h-4 text-gray-400 mr-2" />,
            }}
            sx={{
              width: "300px",
              "& .MuiInputBase-root": {
                height: "32px",
                fontSize: "14px",
              },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiInputBase-root": {
                height: "32px",
                fontSize: "14px",
              },
            }}
          >
            <Select
              value={filter}
              onChange={(e) => dispatch(setFilter(e.target.value))}
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setAddModalOpen(true)}
            startIcon={<Plus className="w-4 h-4" />}
          >
            New Staff
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="w-[8%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Name
                </th>
                <th className="w-[23%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="w-[11%] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-[16%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pl-12">
                  Department
                </th>
                <th className="w-[14%] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="w-[8%] px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        member.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap pl-12">
                    <div className="text-sm text-gray-900">
                      {member.department}
                    </div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {member.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={(e) => handleMenuOpen(e, member)}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            minWidth: "160px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            mt: 1,
          },
        }}
        MenuListProps={{
          "aria-labelledby": "employee-actions-button",
          autoFocus: false,
          disableAutoFocusItem: true,
        }}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "#DC2626" }}>
          Delete
        </MenuItem>
      </Menu>

      <Modal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        title="Add New Staff"
      >
        <CreateNewStaff onAddStaff={handleAddStaff} />
      </Modal>

      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit Staff"
      >
        {selectedMember && (
          <EditStaff
            staffMember={selectedMember}
            onUpdate={handleUpdate}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
