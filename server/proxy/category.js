const CategoryModel = require('../models/category');

exports.getCategories = async (includeAll = false) => {
  const categories = await CategoryModel.find().exec();
  if (includeAll) {
    categories.unshift({
      _id: '',
      cateName: '全部分类',
      alias: '',
      img: '/images/全部分类.svg'
    });
    categories.push({
      _id: '5d380b18ba304f18c455eb38',
      cateName: '未分类',
      alias: 'others',
      img: '/images/未分类.svg'
    });
  }
  return categories;
}
