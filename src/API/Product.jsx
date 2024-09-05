import axiosClient from './axiosClient'

const Product = {

    Get_All_Product: (query) => {
        const url = `/api/Product${query}`
        return axiosClient.get(url)
    },

    Get_Category_Product: (query) => {
        const url = `/api/Product/category${query}`
        return axiosClient.get(url)
    },

    Get_Detail_Product: (id) => {
        const url = `/api/Product/${id}`
        return axiosClient.get(url)
    },

    Get_Category_Gender: (query) => {
        const url = `/api/Product/category/gender${query}`
        return axiosClient.get(url)
    },

    Get_Category: (query) => {
        const url = `/api/Category${query}`
        return axiosClient.get(url)
    },

    Get_Pagination: (query) => {
        const url = `/api/Product/category/pagination${query}`
        return axiosClient.get(url)
    },

    Get_SortBy: (query) => {
        const url = `/api/Product/sortBy${query}`
        return axiosClient.get(url)
    },

    get_search_list: (query) => {
        const url = `/api/Product/scoll/page${query}`
        return axiosClient.get(url)
    },
    updateProduct: (data) => {
        const url = `/api/admin/Product/update`
        return axiosClient.patch(url, data)
    }

}

export default Product