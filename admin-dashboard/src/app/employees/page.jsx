import * as Tabs from "@radix-ui/react-tabs"
import { Root as DropdownMenuRoot, Trigger as DropdownMenuTrigger, Content as DropdownMenuContent, Item as DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Root as AvatarRoot} from "@radix-ui/react-avatar";
import { Search, Filter, MoreVertical,  Plus } from "lucide-react"
import Button from '@mui/material/Button';

const staffMembers = [
  {
    id: 1,
    name: "Dr. John Doe",
    role: "Lead Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(303) 555-0105",
    email: "tanya.hill@example.com",
    status: "Available",
    treatment: "Cardiovascular Surgery",
    shift: "8:00 AM - 4:00 PM",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    role: "Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(206) 555-0100",
    email: "curtis.weaver@example.com",
    status: "Available",
    treatment: "Chemotherapy",
    shift: "4:00 PM - 12:00 AM",
  },
  {
    id: 1,
    name: "Dr. John Doe",
    role: "Lead Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(303) 555-0105",
    email: "tanya.hill@example.com",
    status: "Available",
    treatment: "Cardiovascular Surgery",
    shift: "8:00 AM - 4:00 PM",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    role: "Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(206) 555-0100",
    email: "curtis.weaver@example.com",
    status: "Available",
    treatment: "Chemotherapy",
    shift: "4:00 PM - 12:00 AM",
  },
  {
    id: 1,
    name: "Dr. John Doe",
    role: "Lead Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(303) 555-0105",
    email: "tanya.hill@example.com",
    status: "Available",
    treatment: "Cardiovascular Surgery",
    shift: "8:00 AM - 4:00 PM",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    role: "Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(206) 555-0100",
    email: "curtis.weaver@example.com",
    status: "Available",
    treatment: "Chemotherapy",
    shift: "4:00 PM - 12:00 AM",
  },
  {
    id: 1,
    name: "Dr. John Doe",
    role: "Lead Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(303) 555-0105",
    email: "tanya.hill@example.com",
    status: "Available",
    treatment: "Cardiovascular Surgery",
    shift: "8:00 AM - 4:00 PM",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    role: "Cardiologist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2011.09.34%20AM-wK1uFZfdoBZ3azKUTMdInSmhbtQ5Wn.png",
    phone: "(206) 555-0100",
    email: "curtis.weaver@example.com",
    status: "Available",
    treatment: "Chemotherapy",
    shift: "4:00 PM - 12:00 AM",
  },
  // Add more staff members as needed
]

export default function StaffList() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex gap-2">
       
          <Button variant="outlined" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Member
          </Button>
        </div>
      </div>

      <Tabs.Root defaultValue="active" className="w-full">
      

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-md w-[300px]" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
  <div className="h-[600px] overflow-y-auto">
    <table className="w-full border-collapse">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="w-4 p-4">
       
          </th>
          <th className="text-left p-4 font-medium">Staff Name</th>
          <th className="text-left p-4 font-medium">Contact Details</th>
          <th className="text-left p-4 font-medium">Status</th>
          <th className="text-left p-4 font-medium">Department</th>
          <th className="text-left p-4 font-medium">Joined Date</th>
          <th className="w-4 p-4"></th>
        </tr>
      </thead>
      <tbody>
        {staffMembers.map((member) => (
          <tr key={member.id} className="border-t">
            <td className="p-4">
              {/* <CheckboxRoot /> */}
            </td>
            <td className="p-4">
              <div className="flex items-center gap-3">
                <AvatarRoot>
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                </AvatarRoot>
                <div>
                  <div className="font-medium">{member.name}</div>
                
                </div>
              </div>
            </td>
            <td className="p-4">
              <div>{member.phone}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </td>
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
                <div>
                    <div className="">{member.treatment}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                </div>
            </td>
            <td className="p-4">{member.shift}</td>
            <td className="p-4">
              <DropdownMenuRoot>
                <DropdownMenuTrigger asChild>
                  <button size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-md shadow-lg p-2 min-w-[160px]">
                  <DropdownMenuItem className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded">
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded">
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
    </div>
  )
}

