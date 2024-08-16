import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSingleProductApi, updateProductApi } from '../../apis/api'
import { toast } from 'react-toastify'

const AdminEditProduct = () => {
    // receive product id from url
    const {id} = useParams()

    // load product data
    useEffect(() => {
        getSingleProductApi(id).then((res) => {
            console.log(res.data)
            setProductName(res.data.product.productName)
            setProductPrice(res.data.product.productPrice)
            setProductDescription(res.data.product.productDescription)
            setProductCategory(res.data.product.productCategory)
            setOldImage(res.data.product.productImageUrl)
        })
    },[id])


    // Make useState
    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [oldImage, setOldImage] = useState('')

    // make useState for image
    const [productImage, setProductImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)


    // image upload function
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        console.log(file)
        setProductImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }

    // handle submit function
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('productName', productName)
        formData.append('productPrice', productPrice)
        formData.append('productDescription', productDescription)
        formData.append('productCategory', productCategory)
        formData.append('productImage', productImage)

        // make a api call
        updateProductApi(id, formData).then((res)=>{
            if(res.data.success == false){
                toast.error(res.data.message)
            } else{
                toast.success(res.data.message)
                navigate('/admin/dashboard')
            }
        }).catch((err) => {
            console.log(err)
            toast.error('Internal Server Error!')
        })



    }


    return (
        <>
            <div className='m-4'>

                <h3>Editing product - <span className='text-danger'>{productName}</span></h3>

                <div className='d-flex gap-3'>
                    <form action="">
                        <label>Product Name</label>
                        <input value={productName} onChange={(e) => setProductName(e.target.value)} className='form-control mb-2' type="text" name="" id="" placeholder='Enter product name' />

                        <label htmlFor="">Product Description</label>
                        <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className='form-control mb-2' placeholder={"Enter description"} cols="4" rows="4"></textarea>

                        <label htmlFor="">Price</label>
                        <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} type="number" className='form-control mb-2' placeholder='Enter your price' />

                        <label htmlFor="">Select category</label>
                        <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className='form-control mb-2'>
                            <option value="Flower">Flower</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Gadgets">Gadgets</option>
                            <option value="Mobile">Mobile</option>
                        </select>

                        <label>Product Image</label>
                        <input onChange={handleImageUpload} type="file" className='form-control' />

                        <button onClick={handleSubmit} className='btn btn-primary w-100 mt-2'>Update product</button>

                    </form>
                    <div>
                        <h6>Old Image Preview</h6>
                        <img className='img-fluid rounded-4 object-fit-cover' width={300} height={300} src={oldImage} alt="" />


                        <h6 className='mt-4'>New Image</h6>
                        {
                            previewImage ? <img src={previewImage} alt="product Image" className='img-fluid rounded-4 object-fit-cover' width={300} height={300}  />
                            : <p>No image selected!</p>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminEditProduct
