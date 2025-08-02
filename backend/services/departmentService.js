// Logic nghiệp vụ cho phòng ban

const Department = require('../models/Department.js');
const User = require('../models/User.js');

  // Tạo phòng ban mới
exports.createDepartment = async (departmentData) => {
    // Logic: Kiểm tra trưởng/phó phòng có tồn tại không
    const head = await User.findById(departmentData.headOfDepartment);
    const viceHead = await User.findById(departmentData.viceHeadOfDepartment);

    if (!head || !viceHead) {
      throw new Error('Head or Vice Head of Department not found.');
    }

    // Logic: Trưởng phòng và phó phòng không được là cùng một người
    if (departmentData.headOfDepartment.toString() === departmentData.viceHeadOfDepartment.toString()) {
      throw new Error('Head and Vice Head cannot be the same person.');
    }

    const newDepartment = new Department(departmentData);
    await newDepartment.save();

    // Cập nhật departmentID cho trưởng phòng và phó phòng
    await User.findByIdAndUpdate(head._id, { departmentID: newDepartment._id });
    await User.findByIdAndUpdate(viceHead._id, { departmentID: newDepartment._id });

    return newDepartment;
  }

  // Lấy tất cả phòng ban
exports.getAllDepartments = async () => {
    // Sử dụng populate để lấy thông tin chi tiết của trưởng và phó phòng
    return await Department.find()
      .populate('headOfDepartment', 'name userName')
      .populate('viceHeadOfDepartment', 'name userName');
  }

  // Lấy chi tiết một phòng ban
exports.getDepartmentById = async (id) => {
    const department = await Department.findById(id)
      .populate('headOfDepartment', 'name userName')
      .populate('viceHeadOfDepartment', 'name userName');
    if (!department) {
      throw new Error('Department not found.');
    }
    return department;
  }

  // Cập nhật phòng ban
exports.updateDepartment = async (id, updateData) => {
    const department = await Department.findById(id);
    if (!department) {
      throw new Error('Department not found.');
    }

    // Logic: Xử lý khi trưởng/phó phòng mới khác với cũ
    if (updateData.headOfDepartment && updateData.headOfDepartment.toString() !== department.headOfDepartment.toString()) {
      // Cập nhật departmentID cho trưởng phòng cũ
      await User.findByIdAndUpdate(department.headOfDepartment, { departmentID: null }); // Hoặc gán lại tùy logic
      // Cập nhật departmentID cho trưởng phòng mới
      await User.findByIdAndUpdate(updateData.headOfDepartment, { departmentID: department._id });
    }
    
    // Tương tự với phó phòng...
    if (updateData.viceHeadOfDepartment && updateData.viceHeadOfDepartment.toString() !== department.viceHeadOfDepartment.toString()) {
      await User.findByIdAndUpdate(department.viceHeadOfDepartment, { departmentID: null }); // Hoặc gán lại tùy logic
      await User.findByIdAndUpdate(updateData.viceHeadOfDepartment, { departmentID: department._id });
    }

    // Cập nhật thông tin phòng ban
    Object.assign(department, updateData);
    await department.save();
    return department;
  },

  // Xóa phòng ban
exports.deleteDepartment = async (id) => {
    // Kiểm tra và xử lý người dùng thuộc phòng ban này trước
    User.updateMany(
      { departmentID: id },
      { $set: { departmentID: null } }
    );

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
        throw new Error('Department not found.');
    }   
    return department;
}