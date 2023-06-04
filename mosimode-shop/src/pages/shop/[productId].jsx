import React, { useState, useRef } from "react";
import styles from "./[productId].module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Products from "@/components/Sections/Products";
import Image from "next/image";
import generateStars from "../../utils/generateStars";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

const ProductPage = ({ product, productList }) => {
	const dispatch = useDispatch();
	const [userRating, setUserRating] = useState(5);
	const rateInputRef = useRef(null);

	const ratingSubmitHandle = () => {
		const userRate = parseInt(rateInputRef.current.value);
		if (userRate > 5 || userRate < 0) {
			alert("your rating should be in the range of 0 to 5");
			return;
		}
		//work of updating the product rating
	};
	const addToBasketHandler = () => {
		dispatch(addToCart({ product, count: 1 }));
	};
	if (product == null)
		return (
			<>
				<Header />
				<div className={styles.invalidpage}>
					<h1>this product does not exist!</h1>
				</div>
				<Footer />
			</>
		);

	return (
		<>
			<Header />
			<section className={styles.section}>
				<div className={styles.product_container}>
					<div className={styles.product_image}>
						<Image className={styles.product_picture} src={product.image} alt={product.title} width={1080} height={1350} />
					</div>
					<div className={styles.product_info}>
						<h3>{product.title}</h3>
						<p className={styles.category}>category: {product.category}</p>
						<div className={styles.stars}>
							{generateStars(product.rating.rate)}
							<br />

							<div className={styles.rateit}>
								rate:
								<input type="number" min="0" max="5" value={userRating} ref={rateInputRef} onChange={(e) => setUserRating(e.target.value)} />
								<button onClick={ratingSubmitHandle}>ok</button>
							</div>
						</div>
						<p className={styles.price}>${product.price}</p>
						<p className={styles.description}>description: {product.description}</p>
						<button className={styles.addtobasket_btn} onClick={addToBasketHandler}>
							Add To Basket
						</button>
					</div>
				</div>
			</section>
			<Products products={productList} title="more products" />
			<Footer />
		</>
	);
};
export async function getServerSideProps(context) {
	const { productId } = context.query;

	try {
		// Fetch the product details based on productId
		const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
		const response2 = await fetch(`https://fakestoreapi.com/products/`);
		const product = await response.json();
		const productList = await response2.json();
		// Return the fetched product as props
		return {
			props: {
				product,
				productList: productList.slice(0, 6),
			},
		};
	} catch (error) {
		return {
			props: {
				product: null,
				productList: {},
			},
		};
	}
}
export default ProductPage;