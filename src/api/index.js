import ajax from './ajax'
import jsonp from 'jsonp'

const BASE_URL = ''

export const reqLogin = (username, password) =>
  ajax(BASE_URL+'/login', {username, password}, 'POST')

export const reqCategorys = (parentId) =>
  ajax(BASE_URL+'/manage/category/list', {parentId})
export const reqCategoryAdd = (parentId, categoryName) =>
  ajax(BASE_URL+'/manage/category/add', {parentId, categoryName}, 'POST')
export const reqCategoryUpdate = (categoryId, categoryName) =>
  ajax(BASE_URL+'/manage/category/update', {categoryId, categoryName}, 'POST')
export const reqCategoryInfo = (categoryId) =>
  ajax(BASE_URL+'/manage/category/info', {categoryId})

export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE_URL+'/manage/product/list', {pageNum, pageSize})
export const reqProductSearch = ({pageNum, pageSize, productType, productName}) =>
  ajax(BASE_URL+'/manage/product/search', {pageNum, pageSize, [productType]:productName})
export const reqProductAddUpdate = (product) =>
  ajax(BASE_URL+'/manage/product/'+(product._id?'update':'add'), product, 'POST')
export const reqProductUpdateStatus = (productId, status) =>
  ajax(BASE_URL+'/manage/product/updateStatus', {productId, status}, 'POST')

export const reqImgUpload = (image) =>
  ajax(BASE_URL+'/manage/img/upload', {image}, 'POST')
export const reqImgDel = (name) =>
  ajax(BASE_URL+'/manage/img/delete', {name}, 'POST')

export const reqRoles = () =>  ajax(BASE_URL+'/manage/role/list')
export const reqRoleAdd = (roleName) =>
  ajax(BASE_URL+'/manage/role/add', {roleName}, 'POST')
export const reqRoleUpdate = (role) => ajax(BASE_URL+'/manage/role/update', role, 'POST')

export const reqUsers = () => ajax(BASE_URL+'/manage/user/list')
export const reqUserAddUpdate = (user) =>
  ajax(BASE_URL+'/manage/user/'+(user._id?'update':'add'), user, 'POST')
export const reqUserDel = (userId) =>
  ajax(BASE_URL+'/manage/user/delete', {userId}, 'POST')

export const reqWeather = (city) => {
  const url =
    `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {}, (error, response) => {
      if (!error && response.status === 'success') {
        const {dayPictureUrl, weather} = response.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        console.log('jsonp error:'+error)
      }
    })
  })
}


