import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Footer from '../components/Footer'
import Carousel from '../components/carousel'
import './authForm.css';
import './burgerBg.css';

export default function Home() {
  const [foodCat, setFoodCat] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fooddata')
      const data = await response.json()
      setFoodItems(data)
      setFoodCat([...new Set(data.map(item => item.CategoryName))])
    } catch (error) {
      console.error('Home loadData error:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const visibleItems =
    selectedCategory === 'All'
      ? foodItems
      : foodItems.filter(item => item.CategoryName === selectedCategory)

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <Navbar />
        <Carousel />
        <div className="auth-form-bg">
            <div className="auth-form-container"
              style={{
                maxWidth: '1200px',
                width: '100%',
                background: 'rgba(255,255,255,0.18)',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                border: '1.5px solid rgba(40,167,69,0.18)',
                borderRadius: '18px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'box-shadow 0.3s, background 0.3s',
                padding: '2.5rem 2rem',
                margin: '2rem auto',
              }}>
            <div className='container my-4'>
              <div
                className="auth-form-container mb-4"
                style={{
                  maxWidth: 600,
                  width: '100%',
                  background: 'rgba(255,255,255,0.18)',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(40,167,69,0.18)',
                  borderRadius: '18px',
                  transition: 'box-shadow 0.3s, background 0.3s',
                  padding: '1.5rem 2rem',
                  margin: '0 auto 2rem auto',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: '#28a745',
                }}
              >
                Categories
                <div className='d-flex flex-wrap gap-3 justify-content-center mt-3'>
                  {['All', ...foodCat].map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`btn category-glass-btn${selectedCategory === category ? ' active' : ''}`}
                      style={{minWidth: 100}}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className='container-fluid px-3'>
              <div className='row g-4'>
                {visibleItems.length === 0 ? (
                  <div className='col-12'>Loading food items...</div>
                ) : (
                  visibleItems.map(item => (
                    <div key={item._id} className='col-12 col-sm-6 col-md-4 col-lg-3'>
                      <Card fooditem={item} />
                    </div>
                  ))
                )}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

