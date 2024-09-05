import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import OrderAPI from '../../API/OrderAPI';

MainHistory.propTypes = {

};

function MainHistory(props) {

    const [history, set_history] = useState([])

    const [isLoad, setIsLoad] = useState(true)

    useEffect(() => {

        const fetchData = async () => {

            const response = await OrderAPI.get_order(sessionStorage.getItem('id_user'))


            set_history(response)

        }

        fetchData()

    }, [isLoad])

    const [show_error, set_show_error] = useState(false)

    const deleteOrder = async (id, pay) => {

        if (pay === true){
            set_show_error(true)

            setTimeout(() => {
                set_show_error(false)
            }, 2000)
            return
        }

        if (!show_error){
            const params = {
                id: id
            }
    
            const query = '?' + queryString.stringify(params)
    
            const response = await OrderAPI.cancel_order(query)
    
            console.log(response)
    
            setIsLoad(!isLoad)
        }
    }

    console.log("history:", history)
    return (
        <div>

            {
                show_error &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Không Thể Hủy Vì Đơn Hàng Đã Được Thanh Toán!</h4>
                    </div>
                </div>
            }
            
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li className="active">Lịch sử</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form action="#">
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">Mã đơn hàng</th>
                                                <th className="li-product-thumbnail">Tên</th>
                                                <th className="cart-product-name">Số điện thoại</th>
                                                <th className="li-product-price">Địa chỉ</th>
                                                <th className="li-product-quantity">Tổng</th>
                                                <th className="li-product-subtotal">Thanh toán</th>
                                                <th className="li-product-subtotal">Tình trạng</th>
                                                <th className="li-product-subtotal">Hủy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                history && history.map(value => (
                                                    <tr key={value._id}>
                                                        <td className="li-product-price"><span className="amount"><Link to={`/history/${value._id}`}>View</Link></span></td>
                                                        <td className="li-product-price"><span className="amount">{value.name}</span></td>
                                                        <td className="li-product-price"><span className="amount">{value.phone}</span></td>
                                                        <td className="li-product-price"><span className="amount">{value.address}</span></td>

                                                        <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(value.total) + ' VNĐ'}</span></td>
                                                        <td className="li-product-price"><span className="amount" style={value.pay ? { color: 'green' } : { color: 'red' }}>{value.pay ? 'Paid' : 'Unpaid'}</span></td>
                                                        <td className="li-product-price"><span className="amount" >
                                                            {
                                                                value.status === '1' ? 'Processing' :
                                                                    (value.status === '2' ? 'Confirmed' :
                                                                        (value.status === '3' ? 'Shipping' :
                                                                            (value.status === '4' ? 'Finished' : 'Canceled')))}
                                                        </span>
                                                        </td>
                                                        <td className="li-product-price">
                                                        {(() => {
                                                            switch(value.status) {
                                                                case '1' || '2':
                                                                    return <span onClick={() => deleteOrder(value._id, value.pay)} className="text-danger" style={{ cursor: 'pointer' }}>X</span>
                                                                case '2':
                                                                    return <span onClick={() => deleteOrder(value._id, value.pay)} className="text-danger" style={{ cursor: 'pointer' }}>X</span>
                                                                case '3':
                                                                    return <i className="fa fa-check text-success" style={{ fontSize: '25px' }}></i>
                                                                case '4':
                                                                    return <i className="fa fa-check text-success" style={{ fontSize: '25px' }}></i>
                                                                default:
                                                                    return <span className="text-danger">Cancelled</span>
                                                            }
                                                        })()}
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainHistory;