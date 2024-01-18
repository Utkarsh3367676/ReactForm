import React, { useState } from 'react';
import {  List, ListItem, ListItemText, Collapse, ListItemIcon } from '@mui/material';
import { ExpandLess, ExpandMore, Business, AccountTree } from '@mui/icons-material';

interface Department {
  department: string;
  sub_departments: string[];
}

interface DepartmentDetailsProps {
  data: Department[];
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ data }) => {
  const [openDepartments, setOpenDepartments] = useState<string[]>([]);

  const handleToggle = (department: string) => {
    setOpenDepartments((prevOpenDepartments) => {
      const isOpen = prevOpenDepartments.includes(department);
      return isOpen
        ? prevOpenDepartments.filter((dep) => dep !== department)
        : [...prevOpenDepartments, department];
    });
  };

  const isDepartmentOpen = (department: string) => openDepartments.includes(department);

  return (
    
    <List>
    
      {data.map((departmentData) => (
        <div key={departmentData.department}>
          <ListItem button onClick={() => handleToggle(departmentData.department)}>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary={departmentData.department} />
            {isDepartmentOpen(departmentData.department) ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isDepartmentOpen(departmentData.department)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {departmentData.sub_departments.map((subDepartment) => (
                <ListItem key={subDepartment} style={{ paddingLeft: 16 }}>
                  <ListItemIcon>
                    <AccountTree />
                  </ListItemIcon>
                  <ListItemText primary={subDepartment} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
};

export default DepartmentDetails;
