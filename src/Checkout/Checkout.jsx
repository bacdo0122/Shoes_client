// CheckoutPage.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Checkout.css'
import OrderAPI from '../API/OrderAPI';
import CouponAPI from '../API/CouponAPI';
import { useDispatch, useSelector } from 'react-redux';
import { changeCount } from '../Redux/Action/ActionCount';
import Product from '../API/Product';
// Các bước checkout: Giỏ hàng, Địa chỉ giao hàng, Thanh toán, Xác nhận
function CheckoutPage() {
  const [step, setStep] = useState(1); // Bước hiện tại

  // Giả lập dữ liệu giỏ hàng
  const cartItems = JSON.parse(localStorage.getItem('carts'));
  const coupon = JSON.parse(localStorage.getItem('coupon'));
  const userId = sessionStorage.getItem('id_user');
  const dispatch = useDispatch()
  const count = useSelector(state => state.Count.isLoad)
  // Tính tổng giá trị giỏ hàng
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price_product * item.count, 0);
  const handleOrder = async () => {
    try {
        const order = await OrderAPI.post_order({
            id_user: userId,
            id_payment:  formik.values.paymentMethod === 'creditCard' ? '66cf9736a49547331ee1f38e' : '66cf978da49547331ee1f38f',
            address: formik.values.address,
            name: formik.values.fullName,
            phone: formik.values.phone,
            total: parseInt(totalAmount),
            status: '1',
            pay:  formik.values.paymentMethod === 'creditCard' ? true : false ,
            feeship: 150,
            id_coupon: coupon ? coupon.id : "",
            create_time: Date.now()
        })
        if(order){
          ///api/DetailOrder
          cartItems.map(async (item) => {
            await OrderAPI.post_detail_order({
              id_order: order._id,
              id_product: item.id_product,
              name_product: item.name_product,
              price_product: item.price_product,
              count: Number(item.count),
              size: item.size,
            })

            await Product.updateProduct({
              id: item.id_product,
              name: item.name_product,
              price: item.price_product,
              stock: Number(item.stock - item.count)
            })

          })

          //tru stock cua product
        }
        if(coupon){
          await CouponAPI.updateCoupon(coupon._id,{
           code: coupon.code,
           count: Number(coupon.count) - 1,
           promotion: coupon.promotion,
           describe: coupon.describe,
          })
        }
        localStorage.setItem("carts", JSON.stringify([]));
        localStorage.removeItem("coupon");
        const action_change_count = changeCount(count)
        dispatch(action_change_count)
    } catch (error) { 
        console.log("err:", error)
    }
  }
  // Sử dụng Formik để quản lý form và xác thực đầu vào
  const formik = useFormik({
    initialValues: {
      fullName: '',
      address: '',
      city: '',
      phone: '',
      paymentMethod: 'cod',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Vui lòng nhập họ tên'),
      address: Yup.string().required('Vui lòng nhập địa chỉ'),
      city: Yup.string().required('Vui lòng nhập thành phố'),
      phone: Yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
      paymentMethod: Yup.string().required('Vui lòng chọn phương thức thanh toán'),
    }),
    onSubmit: (values) => {
      console.log('Thông tin đơn hàng:', values);
      handleOrder();
      setStep(4); // Chuyển sang bước xác nhận
    },
  });

  return (
    <div className="checkout-container">
      <h1>Trang Thanh Toán</h1>

      {step === 1 && (
        <div className="cart-items">
          <h2>Giỏ hàng</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id_product} className="cart-item">
                <img src={`http://localhost:8000${item.image}`} alt={item.name_product} className="item-image" />
                <div className="item-details">
                  <h3 className="item-title">{item.name}</h3>
                  {/* <p className="item-category">{item.category}</p> */}
                  <p className="item-quantity">Số lượng: {item.count}</p>
                  <p className="item-price">{item.price_product.toLocaleString('vi-VN')} VND</p>
                </div>
              </li>
            ))}
          </ul>
          <h3>Tổng cộng: {totalAmount.toLocaleString('vi-VN')} VND</h3>
          <button onClick={() => setStep(2)}>Tiếp tục</button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={formik.handleSubmit}>
          <h2>Thông tin giao hàng</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Họ và Tên"
            value={formik.values.fullName}
            onChange={formik.handleChange}
          />
          {formik.errors.fullName && <p>{formik.errors.fullName}</p>}
          
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
          {formik.errors.address && <p>{formik.errors.address}</p>}
          
          <input
            type="text"
            name="city"
            placeholder="Thành phố"
            value={formik.values.city}
            onChange={formik.handleChange}
          />
          {formik.errors.city && <p>{formik.errors.city}</p>}
          
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.errors.phone && <p>{formik.errors.phone}</p>}
          
          <button type="button" onClick={() => setStep(1)}>Quay lại</button>
          <button type="submit" onClick={() => {
            if(formik.values.fullName && formik.values.address && formik.values.city &&  formik.values.phone){
              setStep(3)

            }
          }}>Tiếp tục</button>
        </form>
      )}

      {step === 3 && (
        <div className="payment-method">
          <h2>Phương thức thanh toán</h2>
          <div>
            <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              onChange={formik.handleChange}
              checked={formik.values.paymentMethod === 'cod'}
            />
          </div>
          <div>
            <label htmlFor="creditCard">Thanh toán bằng thẻ tín dụng</label>
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              value="creditCard"
              onChange={formik.handleChange}
              checked={formik.values.paymentMethod === 'creditCard'}
            />
          </div>
          {formik.errors.paymentMethod && <p>{formik.errors.paymentMethod}</p>}
          
          <button onClick={() => setStep(2)}>Quay lại</button>
          <button onClick={formik.handleSubmit}>Xác nhận</button>
        </div>
      )}

      {step === 4 && (
        <div className="order-confirmation">
          <h2>Xác nhận đơn hàng</h2>
          <p>Đơn hàng của bạn đã được đặt thành công!</p>
          <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;