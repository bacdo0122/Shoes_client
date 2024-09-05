import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string'
import Product from '../API/Product';
import { Link, useParams } from 'react-router-dom';
import Products from './Component/Products';
import Pagination from './Component/Pagination';
import Search from './Component/Search';

Shop.propTypes = {

};

function Shop(props) {

    const { id } = useParams()

    const [products, setProducts] = useState([])

    //Tổng số trang
    const [totalPage, setTotalPage] = useState()
    const [totalProducts, setTotalProducts] = useState(0)
    const [male, set_male] = useState([])
    const [female, set_female] = useState([])
    const [sortBy, setSortBy] = useState('all')
    //Từng trang hiện tại
    const [pagination, setPagination] = useState({
        page: '1',
        count: '9',
        category: id
    })

    const [search, setSearch] = useState('')

    //Hàm này dùng để thay đổi state pagination.page
    //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
    const handlerChangePage = (value) => {

        //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
        setPagination({
            page: value,
            count: pagination.count,
            category: pagination.category
        })
    }

  

    //Gọi hàm để load ra sản phẩm theo pagination dữ vào id params 
    useEffect(() => {

        const fetchData = async () => {

            const params = {
                page: pagination.page,
                count: pagination.count,
                category: id,
                sortBy,
                search: search,
            }

            const query = '?' + queryString.stringify(params)

            const response = await Product.Get_Pagination(query)
            console.log("response:", response)
            setProducts(response.data)
            setTotalProducts(response.total)
            const totalPage = Math.ceil(parseInt(response.total) / parseInt(pagination.count))

            setTotalPage(totalPage)

        }

        fetchData()

    }, [id, sortBy, pagination, search])

    useEffect(() => {
        setPagination({...pagination, page: 1})
    }, [id])



    // Gọi API theo phương thức GET để load category
    useEffect(() => {

        const fetchData = async () => {

            // gender = male
            const params_male = {
                gender: 'male'
            }

            const query_male = '?' + queryString.stringify(params_male)

            const response_male = await Product.Get_Category(query_male)
            set_male(response_male)

            // gender = female
            const params_female = {
                gender: 'female'
            }

            const query_female = '?' + queryString.stringify(params_female)

            const response_female = await Product.Get_Category(query_female)

            set_female(response_female)

        }

        fetchData()

    }, [])


    const handler_Search = (value) => {
        setPagination({...pagination, page: '1'})
        setSearch(value);
    }

    const handleSortBy = (e) => {
        setSortBy(e.target.value)
    }
    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Shop</li>
                        </ul>
                    </div>
                </div>
            </div>


            <div className="li-main-blog-page li-main-blog-details-page pt-60 pb-60 pb-sm-45 pb-xs-45">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 order-lg-1 order-2">
                            <div className="li-blog-sidebar-wrapper">
                                <div className="li-blog-sidebar">
                                    <div className="li-sidebar-search-form">
                                        <Search handler_Search={handler_Search} />
                                    </div>
                                </div>
                                <div className="li-blog-sidebar pt-25">
                                    <h4 className="li-blog-sidebar-title">Tất cả sản phẩm</h4>
                                    <ul className="li-blog-archive">
                                        <li><Link to="/shop/all" style={id === 'all' ? { cursor: 'pointer', color: '#fed700' } : { cursor: 'pointer' }}>Tất cả</Link></li>
                                    </ul>
                                </div>
                                <div className="li-blog-sidebar pt-25 123" style={{ marginBottom: "20px" }}>
                                    <h4 className="li-blog-sidebar-title" >Đàn ông</h4>
                                    <ul className="li-blog-archive">
                                        {
                                            male && male.map(value => (
                                                <li key={value._id}>
                                                    <Link to={`/shop/${value._id}`} style={id === value._id ? { cursor: 'pointer', color: '#fed700' } : { cursor: 'pointer' }}>{value.category}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="li-blog-sidebar">
                                <h4 className="li-blog-sidebar-title" >Phụ nữ</h4>
                                    <ul className="li-blog-archive">
                                        {
                                            female && female.map(value => (
                                                <li key={value._id}>
                                                    <Link to={`/shop/${value._id}`} style={id === value._id ? { cursor: 'pointer', color: '#fed700' } : { cursor: 'pointer' }}>{value.category}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 order-1 order-lg-2">
                            <div className="shop-top-bar">
                                <div className="product-select-box">
                                    <div className="product-short">
                                        <p>Sắp xếp theo:</p>
                                        <select className="nice-select" onChange={handleSortBy}>
                                            <option value="all">Liên quan</option>
                                            <option value="lowToHight">Giá (Thấp &gt; Cao)</option>
                                            <option value="highToLow">Giá (Cao &gt; Thấp)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="shop-products-wrapper">
                                <div className="tab-content">
                                    <div id="grid-view" className="tab-pane active" role="tabpanel">
                                        <div className="product-area shop-product-area">
                                            <Products products={products} />
                                        </div>
                                    </div>
                                    <div className="paginatoin-area">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <p>Hiển thị {pagination.count * (pagination.page - 1) + 1}-{(pagination.page - 1) * (pagination.count) + products.length} của {totalProducts } sản phẩm</p>
                                            </div>
                                            <Pagination pagination={pagination} handlerChangePage={handlerChangePage} totalPage={totalPage} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;