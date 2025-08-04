// Xử lý các thao tác với phòng ban


const departmentService = require('../services/departmentService');

exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = await departmentService.createDepartment(req.body);
    res.status(201).json({ message: 'Tạo phòng ban thành công!', department: newDepartment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},

  exports.getAllDepartments = async (req, res) => {
    try {
      const departments = await departmentService.searchDepartments(req.query);
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ error: 'Không thể truy xuất phòng ban!' });
    }
  },


  exports.getDepartmentById = async (req, res) => {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      res.status(200).json(department);
    } catch (error) {
      res.status(404).json({ error: 'Không tìm thấy phòng ban!' });
    }
  },

  exports.updateDepartment = async (req, res) => {
    try {
      const updatedDepartment = await departmentService.updateDepartment(req.params.id, req.body);
      res.status(200).json({ message: 'Cập nhật phòng ban thành công!', department: updatedDepartment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  exports.deleteDepartment = async (req, res) => {
    try {
      await departmentService.deleteDepartment(req.params.id);
      res.status(200).json({ message: 'Xóa phòng ban thành công!' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }