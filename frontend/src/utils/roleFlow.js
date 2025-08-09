// Cấu hình luồng chuyển giao văn bản.

const roleHierarchy = {
    'admin': ['van_thu', 'truong_phong_so_loai', 'giam_doc', 'pho_giam_doc', 'truong_phong', 'pho_truong_phong', 'can_bo'],
    'van_thu': ['truong_phong_so_loai', 'giam_doc'],
    'truong_phong_so_loai': ['giam_doc'],
    'giam_doc': ['pho_giam_doc'],
    'pho_giam_doc': ['truong_phong'],
    'truong_phong': ['pho_truong_phong'],
    'pho_truong_phong': ['can_bo']
};

export default roleHierarchy;

// [
//     {
//         "role": "van_thu",
//         "child": [
//             {
//                 "role": "truong_phong_so_loai"
//             },
//             {
//                 "role": "giam_doc"
//             }
//         ]
//     },
//     {
//         "role": "truong_phong_so_loai",
//         "child": [
//             {
//                 "role": "giam_doc",
//                 "child": [
//                     {
//                         "role": "pho_giam_doc",
//                         "child": [
//                             {
//                                 "role": "truong_phong",
//                                 "child": [
//                                     {
//                                         "role": "pho_truong_phong",
//                                         "child": [
//                                             {
//                                                 "role": "can_bo"
//                                             }
//                                         ]
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "role": "giam_doc",
//         "child": [
//             {
//                 "role": "pho_giam_doc",
//                 "child": [
//                     {
//                         "role": "truong_phong",
//                         "child": [
//                             {
//                                 "role": "pho_truong_phong",
//                                 "child": [
//                                     {
//                                         "role": "can_bo"
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ]