// Thanh điều hướng bên (menu)

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  UserIcon,
  UserCircleIcon,
  PowerIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { usePermissions } from "../../hooks/usePermissions";
import ProtectedComponent from "../common/ProtectedComponent";

// --- Sidebar Component ---
const Sidebar = () => {
  // Thay đổi state để lưu trữ nhiều ID đang mở
  const [open, setOpen] = React.useState([]);
  const location = useLocation();
  const { isAdmin, canViewUsers } = usePermissions();

  // Logic mới để thêm/xóa ID vào mảng
  const handleOpen = (value) => {
    if (open.includes(value)) {
      setOpen(open.filter(id => id !== value));
    } else {
      setOpen([...open, value]);
    }
  };

  const navItems = [
    {
      name: 'Văn bản',
      icon: <RectangleStackIcon className="h-5 w-5 pr-1" />,
      link: '/documents',
      id: 1,
      subItems: [
        { name: 'Danh sách văn bản', icon: <Bars3Icon className="h-3 w-5" />, link: '/documents' },
        { name: 'Tạo mới văn bản', icon: <PlusCircleIcon className="h-3 w-5" />, link: '/documents/create' },
      ]
    },
    // Chỉ hiển thị menu Người dùng nếu user là admin
    ...(isAdmin() ? [{
      name: 'Người dùng',
      icon: <UserIcon className="h-5 w-5 pr-1" />,
      link: '/users',
      id: 2,
      subItems: [
        { name: 'Danh sách người dùng', icon: <Bars3Icon className="h-3 w-5" />, link: '/users' },
        { name: 'Tạo mới người dùng', icon: <PlusCircleIcon className="h-3 w-5" />, link: '/users/create' },
      ]
    }] : []),
    { name: 'Hồ sơ', icon: <UserCircleIcon className="h-5 w-5 pr-1" />, link: '/profile', id: 3 },
    { name: 'Đăng xuất', icon: <PowerIcon className="h-5 w-5 pr-1" />, link: '/login', id: 4 },
  ];

  return (
    <Card className="h-auto w-full max-w-[20rem] p-4 pl-0 pr-0 shadow-blue-gray-900/5 text-sm">
      <div className="mb-2 p-4 pt-1">
        <Typography variant="h5" color="blue-gray">
          DOCUFLOW
        </Typography>   
      </div>
      <div className="px-4 py-2 mb-2">
        <Typography variant="small" color="blue-gray" className="opacity-70">
          Phòng CNTT
        </Typography>
      </div>
      <List>
        {navItems.map(item => (
          item.subItems ? (
            <Accordion
              key={item.id}
              // Kiểm tra xem ID có trong mảng open không
              open={open.includes(item.id)}
              icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open.includes(item.id) ? "rotate-180" : ""}`} />}
            >
              <ListItem className="p-0" selected={open.includes(item.id) || location.pathname.startsWith(item.link)}>
                <AccordionHeader onClick={() => handleOpen(item.id)} className="border-b-0 p-3">
                  <ListItemPrefix>{item.icon}</ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal ">
                    {item.name}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1 text-xs">
                <List className="p-0">
                  {item.subItems.map(subItem => (
                    <Link to={subItem.link} key={subItem.name}>
                      <ListItem selected={location.pathname === subItem.link}>
                        <ListItemPrefix>{subItem.icon}</ListItemPrefix>
                        {subItem.name}
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </AccordionBody>
            </Accordion>
          ) : (
            // Các mục còn lại chỉ là ListItem thông thường
            <Link to={item.link} key={item.id}>
              <hr className="my-2 border-gray-300" />
              <ListItem selected={location.pathname === item.link}>
                <ListItemPrefix>{item.icon}</ListItemPrefix>
                {item.name}
              </ListItem>
            </Link>
          )
        ))}
      </List>
    </Card>
  );
};

export default Sidebar;