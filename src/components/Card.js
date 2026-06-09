import React, { useState } from 'react'
import { useDispatchCart, useCart } from './contextReducer'

export default function Card({ fooditem }) {
  const thumbnail = fooditem?.img || 'https://via.placeholder.com/300x180?text=No+Image';
  const title = fooditem?.name || 'Unknown item';
  const description = fooditem?.description || 'No description available.';
  const sizeOptions = fooditem?.options?.[0] || {};
  const sizeKeys = Object.keys(sizeOptions);
  const [selectedSize, setSelectedSize] = useState(sizeKeys[0] || '');
  const [quantity, setQuantity] = useState(1);

  let dispatch = useDispatchCart();
  let data = useCart();
  const handleAddToCart = async () => {
    await dispatch({
      type: 'ADD',
      id: fooditem._id,
      name: fooditem.name,
      price: sizeOptions[selectedSize],
      quantity: quantity,
      size: selectedSize,
      img: fooditem.img // Pass image to cart
    });
    console.log(data);
    alert('Item added to cart');
  };

  const basePrice = selectedSize && sizeOptions[selectedSize] ? sizeOptions[selectedSize] : 0;
  const totalPrice = basePrice * quantity;

  return (
    <div className='h-100'>
      <div
        className='card h-100'
        style={{
          minHeight: '400px',
          background: 'rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(40,167,69,0.18)',
          borderRadius: '18px',
          transition: 'box-shadow 0.3s, background 0.3s',
        }}
      >
        <img src={thumbnail} className='card-img-top' alt={title} style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }} />
        <div className='card-body d-flex flex-column'>
          <h5 className='card-title'>{title}</h5>
          <p className='card-text' style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{description}</p>
          <div className='mt-auto'>
            <div className='row g-2'>
              <div className='col-6'>
                <label style={{ fontSize: '0.85rem' }}>Qty</label>
                <select className='form-select form-select-sm bg-success text-white' value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                  {Array.from(Array(6), (e, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-6'>
                <label style={{ fontSize: '0.85rem' }}>Size</label>
                <select className='form-select form-select-sm bg-success text-white' value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {sizeKeys.map(size => (
                    <option key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='mt-2 text-center'>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                Price: ₹ {basePrice}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#28a745', marginTop: '0.5rem' }}>
                Total: ₹ {totalPrice}
              </div>
            </div>
            <hr />
            <button className={`btn btn-success justify-center ms-2`} onClick={handleAddToCart}> Add to Cart </button>
          </div>
        </div>
      </div>
    </div>
  )
}