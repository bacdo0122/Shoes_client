// CheckoutPage.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Checkout.css'
import OrderAPI from '../API/OrderAPI';
// Các bước checkout: Giỏ hàng, Địa chỉ giao hàng, Thanh toán, Xác nhận
function CheckoutPage() {
  const [step, setStep] = useState(1); // Bước hiện tại

  // Giả lập dữ liệu giỏ hàng
  const cartItems = JSON.parse(localStorage.getItem('carts'));
  const coupon = JSON.parse(localStorage.getItem('coupon'));
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Tính tổng giá trị giỏ hàng
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price_product * item.count, 0);
  
  const handleOrder = async () => {
    try {
        await OrderAPI.post_order({
            id_user: '66cf6b39820e3f781e6a88a9',
            id_payment:  formik.values.paymentMethod === 'creditCard' ? '66cf9736a49547331ee1f38e' : '66cf978da49547331ee1f38f',
            address: formik.values.address,
            name: formik.values.fullName,
            phone: formik.values.phone,
            total: parseInt(totalAmount),
            status: '1',
            pay:  formik.values.paymentMethod === 'creditCard' ? true : false ,
            feeship: 150,
            id_coupon: coupon._id,
            create_time: Date.now()
        })
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
      paymentMethod: '',
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
          <button type="submit" onClick={() => setStep(3)}>Tiếp tục</button>
        </form>
      )}

      {step === 3 && (
        <div className="payment-method">
          <h2>Phương thức thanh toán</h2>
          <div>
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              onChange={formik.handleChange}
              checked={formik.values.paymentMethod === 'cod'}
            />
            <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
          </div>
          <div>
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              value="creditCard"
              onChange={formik.handleChange}
              checked={formik.values.paymentMethod === 'creditCard'}
            />
            <label htmlFor="creditCard">Thanh toán bằng thẻ tín dụng</label>
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