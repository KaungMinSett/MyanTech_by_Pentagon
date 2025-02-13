import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Search, MoreVertical, Plus } from "lucide-react";
import Button from "@mui/material/Button";
import {
  Root as DropdownMenuRoot,
  Trigger as DropdownMenuTrigger,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Modal } from "../../components/modal/modal";
import CreateNewStaff from "../../components/employees/CreateNewStaff";
import EditStaff from "../../components/employees/EditStaff";
import { initialStaffMembers } from "../../mocks/employees/staff-list";


export default function StaffList() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [filter, setFilter] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleDelete = (id) => {
    setStaffMembers(staffMembers.filter((member) => member.id !== id));
  };

  const handleEdit = (member) => {
    console.log("Editing Staff:", member); // Debugging log
    setSelectedStaff(member);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedStaff) => {
    setStaffMembers((prevStaff) =>
      prevStaff.map((member) =>
        member.id === updatedStaff.id ? { ...updatedStaff } : member
      )
    );
  };
  

  // ✅ Function to add new staff
  const handleAddStaff = (newStaff) => {
    setStaffMembers((prev) => [...prev, { id: prev.length + 1, ...newStaff }]);
    setAddModalOpen(false);
  };
  const filteredStaff = staffMembers.filter(
    (member) =>
      [member.name, member.role, member.email, member.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (filter === "" || member.role === filter || member.status === filter)
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Staff
          </Button>
          <Modal
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
            title="Add New Staff"
             modal={false}
          >
            <CreateNewStaff onAddStaff={handleAddStaff} />
          </Modal>
        </div>
      </div>

      <Tabs.Root defaultValue="active" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-3 py-2"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-4 text-left font-medium">Staff Name</th>
                  <th className="p-4 text-left font-medium">Contact Details</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Department</th>
                  <th className="p-4 text-left font-medium">Joined Date</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-t">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4">{member.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          member.status === "Available"
                            ? "bg-green-50 text-green-700"
                            : member.status === "Unavailable"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {member.department}
                      </div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </td>
                    <td className="p-4">{member.joinDate}</td>
                    <td className="p-4">
                      <DropdownMenuRoot>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white rounded-md shadow-lg p-2 min-w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleEdit(member)}
                            className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(member.id)}
                            className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuRoot>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Tabs.Root>
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit Staff"
      >
        {selectedStaff && (
          <EditStaff
            staffMember={selectedStaff}
            onUpdate={handleUpdate}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
